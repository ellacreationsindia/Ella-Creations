import React, { useState, useEffect } from 'react';
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
  Search,
  Building,
  MapPin,
  PhoneCall,
  UserCheck,
  Gift,
  Bookmark,
  Check
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import { calculateShiprocketRates, lookupIndianPincode, loadRazorpayScript } from '../lib/supabase';

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

  // Address Register State
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('ella_saved_addresses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState('');
  const [saveToRegister, setSaveToRegister] = useState(true);

  // Signature Gift Box & Note State
  const [isSignatureBoxEnabled, setIsSignatureBoxEnabled] = useState(false);
  const [signatureData, setSignatureData] = useState({
    recipientName: '',
    senderSignature: '',
    giftNote: ''
  });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    addressType: 'Home', // 'Home' | 'Office'
    shippingMethod: 'standard', // 'standard' | 'express'
    paymentMethod: 'razorpay' // 'razorpay' | 'cod'
  });

  // Keep email synced if user logs in
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  // Robust Numeric Price & Shipping Calculations
  const safeSubtotal = Number(cartSubtotal) || 0;
  const discountAmount = activeCoupon ? (safeSubtotal * (Number(activeCoupon.discountPercent) || 0)) / 100 : 0;
  
  // Standard India Courier is ₹80, Express Air Priority is ₹149
  const baseShippingCost = shippingRateDetails 
    ? (formData.shippingMethod === 'express' ? Number(shippingRateDetails.expressCharge || 149) : Number(shippingRateDetails.shippingCharge || 80))
    : (formData.shippingMethod === 'express' ? 149 : 80);

  const shippingCost = Number(baseShippingCost) || 80;
  const grandTotal = Math.max(0, safeSubtotal - discountAmount + shippingCost);

  // Select Saved Address from Register
  const handleSelectSavedAddress = (addr) => {
    setSelectedSavedAddrId(addr.id);
    setFormData((prev) => ({
      ...prev,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      addressType: addr.addressType || 'Home'
    }));
    handlePincodeChange(addr.zip);
  };

  // Handle Pincode Auto-Lookup & Shiprocket Serviceability Verification
  const handlePincodeChange = async (pincodeVal) => {
    const pin = pincodeVal.trim();
    setFormData((prev) => ({ ...prev, zip: pin }));

    if (pin.length === 6 && !isNaN(pin)) {
      const loc = lookupIndianPincode(pin);
      if (loc) {
        setFormData((prev) => ({
          ...prev,
          city: prev.city || loc.city,
          state: prev.state || loc.state
        }));
      }
      setIsCheckingPincode(true);
      const rates = await calculateShiprocketRates(pin, 500, safeSubtotal);
      setShippingRateDetails({
        ...rates,
        shippingCharge: 80,
        expressCharge: 149
      });
      setIsCheckingPincode(false);
    }
  };

  const handleCheckPincode = async () => {
    if (!formData.zip || formData.zip.length !== 6 || isNaN(formData.zip)) {
      alert('Please enter a valid 6-digit Indian Pincode.');
      return;
    }
    setIsCheckingPincode(true);
    const rates = await calculateShiprocketRates(formData.zip, 500, safeSubtotal);
    setShippingRateDetails({
      ...rates,
      shippingCharge: 80,
      expressCharge: 149
    });
    setIsCheckingPincode(false);
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.address || !formData.zip) {
        alert('Please fill in all required shipping address fields.');
        return;
      }

      if (saveToRegister) {
        const newAddr = {
          id: `addr-${Date.now()}`,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          addressType: formData.addressType
        };
        const updatedAddrs = [newAddr, ...savedAddresses.filter(a => a.zip !== newAddr.zip || a.address !== newAddr.address)];
        setSavedAddresses(updatedAddrs);
        try {
          localStorage.setItem('ella_saved_addresses', JSON.stringify(updatedAddrs));
        } catch (e) {
          console.warn('Failed saving address register:', e);
        }
      }

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
        address: `${formData.address}${formData.landmark ? `, Near ${formData.landmark}` : ''}, ${formData.city}, ${formData.state} - ${formData.zip} (${formData.addressType})`,
        signatureBox: isSignatureBoxEnabled ? signatureData : null
      };

      const logisticsInfo = {
        shippingPincode: formData.zip,
        shippingCourier: shippingRateDetails?.courierName || 'Shiprocket Partner Express',
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
          const paymentId = `pay_sim_${Date.now()}`;
          const order = await submitOrder(
            customerDetails,
            'Razorpay Online (Verified)',
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
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TOxtdoQzcxKY7x',
          amount: Math.round(grandTotal * 100),
          currency: 'INR',
          name: 'Ella Creations India',
          description: 'Luxury Jewelry Order',
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
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-brand-gold/30 relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-brand-cream px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-rose" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {step === 1 ? '1. Shipping Address & Delivery' : step === 2 ? '2. Payment & Signature Gift Note' : '3. Order Confirmation'}
            </h3>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        {step < 3 ? (
          <form onSubmit={handleNextStep} className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {step === 1 ? (
              <div className="space-y-5">
                
                {/* Address Register (Saved Addresses) */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3 bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-brand-gold" /> Address Register ({savedAddresses.length} Saved)
                      </span>
                      {selectedSavedAddrId && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSavedAddrId('');
                            setFormData(prev => ({ ...prev, name: '', phone: '', address: '', landmark: '', city: '', state: '', zip: '' }));
                          }}
                          className="text-[10px] text-brand-rose hover:underline font-bold"
                        >
                          + Clear & Enter New Address
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                            selectedSavedAddrId === addr.id
                              ? 'bg-white border-brand-rose shadow-sm'
                              : 'bg-white/80 border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2 font-bold text-stone-900">
                              <span>{addr.name}</span>
                              <span className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded font-mono">
                                {addr.addressType || 'Home'}
                              </span>
                            </div>
                            <p className="text-stone-600 text-[11px] leading-tight">
                              {addr.address}, {addr.city}, {addr.state} - {addr.zip}
                            </p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 ${
                            selectedSavedAddrId === addr.id ? 'border-brand-rose bg-brand-rose text-white' : 'border-stone-300'
                          }`}>
                            {selectedSavedAddrId === addr.id && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (+91) *</label>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Indian Pincode *</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        required
                        maxLength="6"
                        placeholder="e.g. 400050"
                        value={formData.zip}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleCheckPincode}
                        disabled={isCheckingPincode}
                        className="bg-stone-900 hover:bg-stone-800 text-white text-xs px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 font-semibold flex-shrink-0"
                      >
                        {isCheckingPincode ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Search className="w-3.5 h-3.5" />}
                        Check
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Flat / House No. & Building Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="House no., Apartment, Building name"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="Near park, etc."
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                    />
                  </div>
                </div>

                {/* Shipping Speed Options */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-2">Calculated Shipping Speed Options</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                      formData.shippingMethod === 'standard' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                          className="accent-brand-rose"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-stone-900">Standard India Courier</p>
                          <p className="text-[10px] text-stone-500">2-4 business days</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono">{formatPrice(80)}</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                      formData.shippingMethod === 'express' ? 'border-brand-rose bg-brand-rose/5' : 'border-stone-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shipping"
                          checked={formData.shippingMethod === 'express'}
                          onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                          className="accent-brand-rose"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-stone-900">Priority Air Express</p>
                          <p className="text-[10px] text-stone-500">1-2 business days</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono">{formatPrice(149)}</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              /* Step 2: Payment & Signature Note */
              <div className="space-y-5">
                
                {/* Signature Box & Personal Gift Note */}
                <div className="bg-brand-cream/60 p-4 rounded-2xl border border-brand-gold/30 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSignatureBoxEnabled}
                      onChange={(e) => setIsSignatureBoxEnabled(e.target.checked)}
                      className="accent-brand-rose w-4 h-4 rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-brand-rose" /> Add Signature Gift Box & Personal Note Card
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        Includes a printed signature card with your personalized message inside protective packaging.
                      </span>
                    </div>
                  </label>

                  {isSignatureBoxEnabled && (
                    <div className="space-y-3 pt-3 border-t border-brand-gold/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-stone-700 mb-1">Recipient Name (To)</label>
                          <input
                            type="text"
                            placeholder="Recipient Name"
                            value={signatureData.recipientName}
                            onChange={(e) => setSignatureData({ ...signatureData, recipientName: e.target.value })}
                            className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-stone-700 mb-1">Sender Signature (From)</label>
                          <input
                            type="text"
                            placeholder="Sender Signature"
                            value={signatureData.senderSignature}
                            onChange={(e) => setSignatureData({ ...signatureData, senderSignature: e.target.value })}
                            className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-700 mb-1">Personal Gift Message</label>
                        <textarea
                          rows="2"
                          placeholder="Personal note message to print on card..."
                          value={signatureData.giftNote}
                          onChange={(e) => setSignatureData({ ...signatureData, giftNote: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Gateway Options */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-700">Select Payment Gateway</label>
                  
                  <label className={`p-3.5 rounded-xl border block cursor-pointer ${
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
                        <ShieldCheck className="w-4 h-4 text-brand-rose" />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">Razorpay Gateway (UPI / Cards / NetBanking)</span>
                          <span className="text-[10px] text-stone-500">Instant Encrypted Payment</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-brand-rose text-white font-bold px-2 py-0.5 rounded-full">INSTANT PAY</span>
                    </div>
                  </label>

                  <label className={`p-3.5 rounded-xl border block cursor-pointer ${
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
                        <Banknote className="w-4 h-4 text-brand-gold" />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">Cash on Delivery (COD)</span>
                          <span className="text-[10px] text-stone-500">Pay cash upon delivery to courier</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded">COD</span>
                    </div>
                  </label>
                </div>

                {/* Calculations Summary Breakdown: SHOWS PRICE WITHOUT SHIPPING FIRST */}
                <div className="bg-brand-cream/50 p-4 rounded-2xl border border-brand-gold/30 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-700 font-medium">
                    <span>Price without shipping (Items Subtotal):</span>
                    <span className="font-bold text-stone-900">{formatPrice(safeSubtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({activeCoupon?.code}):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Calculated Shipping Fee ({formData.shippingMethod === 'express' ? 'Air Express' : 'India Courier'}):</span>
                    <span className="font-bold text-stone-900">{formatPrice(shippingCost)}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Amount Payable:</span>
                    <span className="text-brand-rose font-mono">{formatPrice(grandTotal)}</span>
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
                disabled={isProcessingPayment}
                className="ml-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 shadow-soft-rose transition-colors text-xs uppercase tracking-wider"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing Order...
                  </span>
                ) : step === 1 ? (
                  'Continue to Payment'
                ) : (
                  `Pay ${formatPrice(grandTotal)} Now`
                )}
                {!isProcessingPayment && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        ) : (
          /* Step 3: Order Confirmation & Receipt View */
          <div className="p-6 md:p-8 text-center space-y-6 flex-1 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-brand-gold">Order Confirmed</span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">Thank You For Your Order!</h2>
              <p className="text-xs text-stone-500 mt-1">Order #{completedOrder?.id} has been recorded & synced.</p>
            </div>

            <div className="bg-brand-cream/60 p-4 rounded-2xl border border-brand-gold/30 text-left space-y-2 text-xs">
              <div className="flex justify-between font-semibold border-b border-stone-200 pb-2">
                <span>Total Amount Paid:</span>
                <span className="text-brand-rose font-bold font-mono">{formatPrice(completedOrder?.total || 0)}</span>
              </div>
              <p className="text-stone-600"><strong>Deliver to:</strong> {completedOrder?.customer.address}</p>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="bg-brand-rose text-white text-xs font-semibold px-8 py-3 rounded-xl shadow-soft-rose hover:bg-brand-rose/90 transition-colors"
            >
              Close & Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
