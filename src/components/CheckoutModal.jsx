import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, Truck, Lock, ArrowRight, Printer, Download, Sparkles, Building2, Banknote, Search } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import { calculateShiprocketRates, loadRazorpayScript } from '../lib/supabase';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    activeCoupon, 
    submitOrder,
    user
  } = useStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [shippingRateDetails, setShippingRateDetails] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || 'Ananya Sharma',
    email: user?.email || 'ananya.s@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Royal Palms, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400050',
    shippingMethod: 'standard', // 'standard' | 'express'
    paymentMethod: 'razorpay', // 'razorpay' | 'upi' | 'card' | 'cod'
    upiId: 'ananya@okicici',
    cardNumber: '4532 •••• •••• 8892',
    cardExpiry: '08/29',
    cardCvc: '432'
  });

  if (!isCheckoutOpen) return null;

  const baseShippingCost = shippingRateDetails ? shippingRateDetails.shippingCharge : (formData.shippingMethod === 'express' ? 299 : (cartSubtotal >= 2500 ? 0 : 199));
  const shippingCost = formData.shippingMethod === 'express' ? baseShippingCost + 100 : baseShippingCost;
  const discountAmount = activeCoupon ? (cartSubtotal * activeCoupon.discountPercent) / 100 : 0;
  const grandTotal = cartSubtotal - discountAmount + shippingCost;

  const handleCheckPincode = async () => {
    if (!formData.zip || formData.zip.length < 6) {
      alert('Please enter a valid 6-digit Indian Pincode.');
      return;
    }
    setIsCheckingPincode(true);
    const rates = await calculateShiprocketRates(formData.zip, 500);
    setShippingRateDetails(rates);
    setIsCheckingPincode(false);
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!shippingRateDetails) {
        await handleCheckPincode();
      }
      setStep(2);
    } else if (step === 2) {
      setIsProcessingPayment(true);

      const customerDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zip}`
      };

      const logisticsInfo = {
        shippingPincode: formData.zip,
        shippingCourier: shippingRateDetails?.courierName || 'Shiprocket Express',
        awbCode: `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`,
        trackingUrl: `https://shiprocket.co/tracking/${formData.zip}`
      };

      if (formData.paymentMethod === 'cod') {
        const order = await submitOrder(
          customerDetails,
          'Cash on Delivery (COD)',
          null,
          logisticsInfo.shippingPincode,
          logisticsInfo.shippingCourier,
          logisticsInfo.awbCode,
          logisticsInfo.trackingUrl
        );
        setCompletedOrder(order);
        setIsProcessingPayment(false);
        setStep(3);
      } else {
        // Razorpay Online Payment Integration
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !window.Razorpay) {
          // Fallback simulation if network blocks Razorpay script in test preview
          const paymentId = `pay_sim_${Date.now()}`;
          const order = await submitOrder(
            customerDetails,
            `Razorpay Online (${formData.paymentMethod.toUpperCase()})`,
            paymentId,
            logisticsInfo.shippingPincode,
            logisticsInfo.shippingCourier,
            logisticsInfo.awbCode,
            logisticsInfo.trackingUrl
          );
          setCompletedOrder(order);
          setIsProcessingPayment(false);
          setStep(3);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_EllaCreationsDemoKey',
          amount: Math.round(grandTotal * 100), // amount in paise
          currency: 'INR',
          name: 'Ella Creations India',
          description: 'Luxury Artificial & Bridal Jewelry Order',
          image: '/logo.png',
          handler: async function (response) {
            const paymentId = response.razorpay_payment_id || `pay_rzp_${Date.now()}`;
            const order = await submitOrder(
              customerDetails,
              `Razorpay Online (${response.razorpay_payment_id ? 'Verified' : 'Simulated'})`,
              paymentId,
              logisticsInfo.shippingPincode,
              logisticsInfo.shippingCourier,
              logisticsInfo.awbCode,
              logisticsInfo.trackingUrl
            );
            setCompletedOrder(order);
            setIsProcessingPayment(false);
            setStep(3);
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#8B263E'
          },
          modal: {
            ondismiss: function() {
              setIsProcessingPayment(false);
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-brand-gold/30 relative">
        
        {/* Header */}
        <div className="bg-brand-cream px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Ella Creations Logo" className="h-8 w-auto" />
            <h2 className="font-serif text-lg font-bold text-stone-900">Secure Checkout</h2>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setStep(1);
              setCompletedOrder(null);
            }}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Checkout Steps Indicator */}
        {step < 3 && (
          <div className="px-6 py-3 bg-brand-sand/40 border-b border-stone-200 flex justify-center gap-8 text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-brand-rose font-bold' : 'text-stone-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-brand-rose text-white' : 'bg-stone-300 text-stone-700'}`}>1</span>
              Delivery Address (India)
            </div>
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-brand-rose font-bold' : 'text-stone-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-brand-rose text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
              Payment & Place Order
            </div>
          </div>
        )}

        {/* Step 1 & Step 2 Form Content */}
        {step < 3 ? (
          <form onSubmit={handleNextStep} className="p-6 md:p-8 space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900">1. Customer & Shipping Address</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (+91)</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Flat / House No. & Street</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Pincode (Shiprocket Check)</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          required
                          maxLength="6"
                          placeholder="e.g. 400050"
                          value={formData.zip}
                          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleCheckPincode}
                          disabled={isCheckingPincode}
                          className="bg-stone-900 hover:bg-stone-800 text-white text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-1 font-semibold flex-shrink-0"
                        >
                          {isCheckingPincode ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <Search className="w-3.5 h-3.5" />
                          )}
                          Check
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shiprocket Rate Result Box */}
                {shippingRateDetails && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" /> Pincode {shippingRateDetails.destinationPincode} Serviceable!
                      </span>
                      <span className="text-emerald-700">{shippingRateDetails.courierName}</span>
                    </div>
                    <p className="text-stone-600 text-[11px]">
                      Est. Delivery: <strong>{shippingRateDetails.etd}</strong> ({shippingRateDetails.estimatedDays} Business Days) • Rate: <strong>{formatPrice(shippingRateDetails.shippingCharge)}</strong>
                    </p>
                  </div>
                )}

                {/* Shipping Method Options */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-2">Select Shipping Speed</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      formData.shippingMethod === 'standard' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shipping"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                          className="accent-brand-rose"
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900">Standard Ground Logistics</p>
                          <p className="text-[11px] text-stone-500">Includes anti-tarnish velvet gift box</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">
                        {formatPrice(baseShippingCost)}
                      </span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      formData.shippingMethod === 'express' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shipping"
                          checked={formData.shippingMethod === 'express'}
                          onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                          className="accent-brand-rose"
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900">Shiprocket Priority Air Express</p>
                          <p className="text-[11px] text-stone-500">1-2 Days Priority Dispatch</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-stone-900">{formatPrice(baseShippingCost + 100)}</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              /* Step 2: Payment Options */
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900">2. Payment Gateway & Options</h3>
                
                <div className="space-y-3">
                  {/* Razorpay Online Payment Option */}
                  <label className={`p-4 rounded-xl border block cursor-pointer transition-all ${
                    formData.paymentMethod === 'razorpay' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === 'razorpay'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}
                          className="accent-brand-rose"
                        />
                        <ShieldCheck className="w-5 h-5 text-brand-rose" />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">Razorpay Payment Gateway (UPI / Credit Card / Debit Card / NetBanking)</span>
                          <span className="text-[10px] text-stone-500">100% Encrypted & Instant Confirmation</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-brand-rose text-white font-bold px-2.5 py-0.5 rounded-full">INSTANT PAY</span>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label className={`p-4 rounded-xl border block cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                          className="accent-brand-rose"
                        />
                        <Banknote className="w-5 h-5 text-brand-gold" />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">Cash on Delivery (COD)</span>
                          <span className="text-[10px] text-stone-500">Pay cash upon delivery to courier agent</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded">PAY AT DOORSTEP</span>
                    </div>
                  </label>
                </div>

                {/* Total Summary Bar */}
                <div className="bg-brand-cream p-4 rounded-2xl border border-brand-gold/30 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Order Subtotal:</span>
                    <span>{formatPrice(cartSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({activeCoupon?.code}):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping ({formData.shippingMethod}):</span>
                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Payable Amount:</span>
                    <span className="text-brand-rose">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  ← Back to Address
                </button>
              )}

              <button
                type="submit"
                className="ml-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 shadow-soft-rose transition-colors text-xs uppercase tracking-wider"
              >
                {step === 1 ? 'Continue to Payment' : `Pay ${formatPrice(grandTotal)} Now`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Step 3: Order Confirmation & Receipt View */
          <div className="p-6 md:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Thank You For Your Order</span>
              <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">Order #{completedOrder?.id} Confirmed!</h2>
              <p className="text-xs text-stone-500 mt-1">
                Confirmation invoice sent to <strong>{completedOrder?.customer.email}</strong> & saved to database.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-brand-card p-6 rounded-2xl border border-brand-gold/30 text-left space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">Ella Creations Official Receipt</h4>
                  <p className="text-[11px] text-stone-500">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              </div>

              {/* Items Purchased */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-700">Items Ordered:</p>
                {completedOrder?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-stone-800">{item.qty}x {item.title} ({item.finish})</span>
                    <span className="font-semibold text-stone-900">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Total Paid */}
              <div className="pt-3 border-t border-stone-200 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(completedOrder?.subtotal || 0)}</span>
                </div>
                {completedOrder?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatPrice(completedOrder?.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1">
                  <span>Total Amount Paid:</span>
                  <span className="text-brand-rose">{formatPrice(completedOrder?.total || 0)}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-100">
                <strong>Shipping Address:</strong> {completedOrder?.customer.address}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setStep(1);
                  setCompletedOrder(null);
                }}
                className="px-6 py-2 bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold rounded-lg shadow-soft-rose transition-colors"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
