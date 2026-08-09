import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Truck, 
  Lock, 
  ArrowRight, 
  Printer, 
  Sparkles, 
  Banknote,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function CheckoutView() {
  const { 
    cart, 
    cartSubtotal, 
    activeCoupon, 
    submitOrder,
    user,
    navigateTo
  } = useStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [completedOrder, setCompletedOrder] = useState(null);

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
    paymentMethod: 'upi', // 'upi' | 'card' | 'netbanking' | 'cod'
    upiId: 'ananya@okicici',
    cardNumber: '4532 •••• •••• 8892',
    cardExpiry: '08/29',
    cardCvc: '432'
  });

  const shippingCost = formData.shippingMethod === 'express' ? 299 : (cartSubtotal >= 2500 ? 0 : 199);
  const discountAmount = activeCoupon ? (cartSubtotal * activeCoupon.discountPercent) / 100 : 0;
  const grandTotal = cartSubtotal - discountAmount + shippingCost;

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-cream mx-auto flex items-center justify-center text-brand-rose">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900">Your Cart is Currently Empty</h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Explore our handcrafted Kundan, Cubic Zirconia, and 22k gold plated jewelry collections to start shopping.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-brand-rose text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full shadow-soft-rose hover:bg-brand-rose/90 transition-colors"
        >
          Browse Master Collection
        </button>
      </div>
    );
  }

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      const order = await submitOrder(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zip}`
        },
        formData.paymentMethod === 'upi'
          ? `UPI (${formData.upiId})`
          : formData.paymentMethod === 'card' 
          ? 'Credit / Debit Card'
          : formData.paymentMethod === 'netbanking'
          ? 'NetBanking' 
          : 'Cash on Delivery (COD)'
      );
      setCompletedOrder(order);
      setStep(3);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </button>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Checkout & Order Confirmation</h1>
        </div>

        {/* Secure Trust Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
          <Lock className="w-4 h-4 text-emerald-600" /> 256-Bit SSL Encrypted & Database Synchronized
        </div>
      </div>

      {/* Progress Steps Indicator */}
      {step < 3 && (
        <div className="bg-brand-cream/60 p-4 rounded-2xl border border-brand-gold/30 flex justify-center gap-8 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-brand-rose font-bold' : 'text-stone-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-brand-rose text-white' : 'bg-stone-300 text-stone-700'}`}>1</span>
            1. Shipping Address (India)
          </div>
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-brand-rose font-bold' : 'text-stone-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-brand-rose text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
            2. Payment & Place Order
          </div>
        </div>
      )}

      {/* Main Grid Content */}
      {step < 3 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-sm space-y-6">
            <form onSubmit={handleNextStep} className="space-y-6">
              {step === 1 ? (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-stone-900">1. Customer & Shipping Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (+91)</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Flat / House No. & Street</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          value={formData.zip}
                          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="pt-3">
                    <label className="block text-xs font-semibold text-stone-700 mb-2">Delivery Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
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
                            <p className="text-xs font-bold text-stone-900">Standard Delivery (3-5 Days)</p>
                            <p className="text-[11px] text-stone-500">Velvet box included</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">
                          {cartSubtotal >= 2500 ? 'FREE' : formatPrice(199)}
                        </span>
                      </label>

                      <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
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
                            <p className="text-xs font-bold text-stone-900">Air Priority Express (1-2 Days)</p>
                            <p className="text-[11px] text-stone-500">Insured fast track</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-stone-900">{formatPrice(299)}</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* Step 2: Payment Options */
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-stone-900">2. Select Payment Method</h3>
                  
                  <div className="space-y-3">
                    {/* Instant UPI */}
                    <label className={`p-4 rounded-2xl border block cursor-pointer transition-all ${
                      formData.paymentMethod === 'upi' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={formData.paymentMethod === 'upi'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                            className="accent-brand-rose"
                          />
                          <Smartphone className="w-5 h-5 text-emerald-600" />
                          <div>
                            <span className="text-xs font-bold text-stone-900 block">Instant UPI (GPay, PhonePe, Paytm, BHIM)</span>
                            <span className="text-[10px] text-stone-500">Fastest payment confirmation</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
                      </div>

                      {formData.paymentMethod === 'upi' && (
                        <div className="mt-3 pt-3 border-t border-stone-200">
                          <label className="block text-[11px] font-semibold text-stone-600 mb-1">Enter VPA / UPI ID</label>
                          <input
                            type="text"
                            placeholder="e.g. mobile@upi or username@okicici"
                            value={formData.upiId}
                            onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                          />
                        </div>
                      )}
                    </label>

                    {/* Card Option */}
                    <label className={`p-4 rounded-2xl border block cursor-pointer transition-all ${
                      formData.paymentMethod === 'card' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={formData.paymentMethod === 'card'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                          className="accent-brand-rose"
                        />
                        <CreditCard className="w-5 h-5 text-brand-rose" />
                        <span className="text-xs font-bold text-stone-900">Credit / Debit Card (Visa, Mastercard, RuPay)</span>
                      </div>
                    </label>

                    {/* COD Option */}
                    <label className={`p-4 rounded-2xl border block cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                    }`}>
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
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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
                  className="ml-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3.5 px-8 rounded-full flex items-center gap-2 shadow-soft-rose transition-colors text-xs uppercase tracking-wider"
                >
                  {step === 1 ? 'Continue to Payment' : `Pay ${formatPrice(grandTotal)} Now`}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-brand-gold/20 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary ({cart.reduce((a, b) => a + b.qty, 0)} Items)
            </h3>

            {/* Cart Items List with Uncropped Thumbnails */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center border-b border-stone-100 pb-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-stone-50 to-brand-cream/40 p-1 border border-stone-200 flex-shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-stone-500">Finish: {item.finish} | Qty: {item.qty}</p>
                    <p className="text-xs font-bold text-brand-rose mt-0.5">{formatPrice(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-brand-cream/50 p-4 rounded-2xl border border-brand-gold/30 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({activeCoupon?.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Shipping ({formData.shippingMethod}):</span>
                <span className="font-semibold text-stone-900">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-brand-rose">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 space-y-1 pt-1">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> Includes 100% Anti-Tarnish Warranty
              </p>
              <p className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-rose" /> Signature Velvet Box Included
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* Step 3: Order Confirmation Screen & Printable Receipt */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-gold/30 shadow-xl text-center space-y-8 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Thank You For Your Order</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">Order #{completedOrder?.id} Confirmed!</h2>
            <p className="text-xs text-stone-500">
              Confirmation receipt sent to <strong>{completedOrder?.customer.email}</strong> & saved to database.
            </p>
          </div>

          {/* Receipt Box */}
          <div className="bg-brand-cream/60 p-6 rounded-2xl border border-brand-gold/30 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <h4 className="font-serif text-sm font-bold text-stone-900">Ella Creations Official Invoice</h4>
                <p className="text-[11px] text-stone-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-stone-700">Items Ordered:</p>
              {completedOrder?.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-stone-800">{item.qty}x {item.title} ({item.finish})</span>
                  <span className="font-semibold text-stone-900">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

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
              <strong>Delivery Address:</strong> {completedOrder?.customer.address}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Tax Receipt
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-2.5 bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold rounded-xl shadow-soft-rose transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
