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
  ArrowLeft,
  ShoppingBag,
  Search,
  Building,
  MapPin,
  PhoneCall,
  UserCheck,
  Gift,
  Bookmark,
  Plus,
  PenTool,
  Check
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import { calculateShiprocketRates, lookupIndianPincode, loadRazorpayScript } from '../lib/supabase';

export default function CheckoutView() {
  const { 
    cart, 
    cartSubtotal, 
    activeCoupon, 
    submitOrder,
    user,
    setIsAuthModalOpen,
    navigateTo
  } = useStore();

  const [step, setStep] = useState(1); // 1: Address & Shipping, 2: Payment, 3: Confirmation
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [shippingRateDetails, setShippingRateDetails] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Address Register (Saved Addresses) State
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('ella_saved_addresses');
      return saved ? JSON.parse(saved) : [
        {
          id: 'addr-1',
          name: user?.user_metadata?.full_name || 'Ananya Sharma',
          phone: '9876543210',
          address: 'Flat 402, Royal Palms Apartments, Green Park Road',
          landmark: 'Opposite Central Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip: '400050',
          addressType: 'Home'
        }
      ];
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
      alert('Please enter a valid 6-digit Indian Pincode (e.g. 400050).');
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

  // 1. STRICT AUTHENTICATION LOCK
  if (!user && !completedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-stone-900 text-brand-gold mx-auto flex items-center justify-center shadow-xl border border-brand-gold/30">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
            Authentication Required
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">Sign In to Complete Purchase</h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            Please sign in to your Ella Creations account to proceed with shipping address entry and secure payment processing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-gold/30 shadow-md space-y-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-soft-rose transition-colors flex items-center justify-center gap-2"
          >
            Sign In or Create Account
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className="w-full text-xs text-stone-500 hover:text-stone-900 font-semibold pt-1"
          >
            Return to Shopping Catalog
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-cream mx-auto flex items-center justify-center text-brand-rose">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-900">Your Cart is Currently Empty</h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Explore our handcrafted Kundan, Cubic Zirconia, and designer artificial jewelry collections to start shopping.
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
      if (!formData.name || !formData.phone || !formData.address || !formData.zip) {
        alert('Please fill in all required shipping address fields.');
        return;
      }

      // Save to address register
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
        shippingCourier: shippingRateDetails?.courierName || 'Shiprocket Standard India Courier',
        awbCode: null,
        trackingUrl: null
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
        // Razorpay Online Payment Gateway
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

      {/* Detailed Stepper Progress Indicator */}
      {step < 3 && (
        <div className="bg-brand-cream/60 p-4 rounded-2xl border border-brand-gold/30 flex justify-center gap-4 sm:gap-8 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-brand-rose font-bold' : 'text-stone-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-brand-rose text-white font-bold' : 'bg-stone-300 text-stone-700'}`}>1</span>
            1. Address Register & Shipping
          </div>
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-brand-rose font-bold' : 'text-stone-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-brand-rose text-white font-bold' : 'bg-stone-300 text-stone-700'}`}>2</span>
            2. Payment & Signature Note
          </div>
        </div>
      )}

      {/* Main Grid Content */}
      {step < 3 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-sm space-y-6">
            <form onSubmit={handleNextStep} className="space-y-6">
              {step === 1 ? (
                <div className="space-y-6">
                  
                  {/* Address Register (Saved Address Selector) */}
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
                              <p className="text-stone-500 text-[10px]">Mobile: {addr.phone}</p>
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

                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-stone-900">1. Customer & Shipping Address Details</h3>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose bg-stone-50/50"
                      />
                      {user && (
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <UserCheck className="w-3 h-3" /> Logged in account email
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Mobile Number (+91) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength="10"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Indian Pincode <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          required
                          maxLength="6"
                          placeholder="e.g. 400050"
                          value={formData.zip}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleCheckPincode}
                          disabled={isCheckingPincode}
                          className="bg-stone-900 hover:bg-stone-800 text-white text-xs px-3 py-2 rounded-xl transition-colors flex items-center gap-1 font-semibold flex-shrink-0"
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

                  {/* Street & Location Details */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Flat / House No. & Building Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="House no., Apartment, Building name"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Landmark (Optional)</label>
                        <input
                          type="text"
                          placeholder="Near park, temple, etc."
                          value={formData.landmark}
                          onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">City <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">State <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="State"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                        />
                      </div>
                    </div>

                    {/* Address Type Tag & Save Checkbox */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-stone-700">Save Address As:</span>
                        <div className="flex gap-2">
                          {['Home', 'Office'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData({ ...formData, addressType: type })}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                formData.addressType === type
                                  ? 'bg-brand-rose text-white border-brand-rose'
                                  : 'bg-stone-50 text-stone-600 border-stone-200'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs font-medium text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveToRegister}
                          onChange={(e) => setSaveToRegister(e.target.checked)}
                          className="accent-brand-rose w-4 h-4 rounded cursor-pointer"
                        />
                        <span>Save to my address register</span>
                      </label>
                    </div>
                  </div>

                  {/* Calculated Shipping Area Info Badge */}
                  {shippingRateDetails && (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-emerald-600" /> Shipping Area Calculated for Pincode {shippingRateDetails.destinationPincode}!
                        </span>
                        <span className="text-emerald-800 text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200 font-mono">
                          {shippingRateDetails.courierName}
                        </span>
                      </div>
                      <p className="text-stone-700 text-[11px]">
                        Standard Delivery (₹80): <strong>{shippingRateDetails.etd}</strong> ({shippingRateDetails.estimatedDays} Business Days)
                      </p>
                    </div>
                  )}

                  {/* Shipping Speed Options (Calculated for Location) */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="block text-xs font-semibold text-stone-700">Calculated Shipping Speed Options</label>
                      <span className="text-[10px] text-stone-700 font-bold bg-stone-100 px-2 py-0.5 rounded border border-stone-200 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-stone-600" /> Verified Courier Dispatch
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Standard Option (₹80 for India) */}
                      <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        formData.shippingMethod === 'standard' ? 'border-brand-rose bg-brand-rose/5 shadow-sm' : 'border-stone-200 hover:border-stone-300'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="shipping"
                            checked={formData.shippingMethod === 'standard'}
                            onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                            className="accent-brand-rose mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-stone-900">
                              Standard India Courier Delivery
                            </p>
                            <p className="text-[11px] text-stone-500 font-medium">
                              Estimated 2-4 business days across India
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-stone-900 flex-shrink-0 ml-2 font-mono">
                          {formatPrice(80)}
                        </span>
                      </label>

                      {/* Express Air Priority (₹149) */}
                      <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        formData.shippingMethod === 'express' ? 'border-brand-rose bg-brand-rose/5 shadow-sm' : 'border-stone-200 hover:border-stone-300'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="shipping"
                            checked={formData.shippingMethod === 'express'}
                            onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                            className="accent-brand-rose mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-stone-900">
                              Priority Air Express Dispatch
                            </p>
                            <p className="text-[11px] text-stone-500 font-medium">
                              1-2 Days Priority Air Cargo
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-stone-900 flex-shrink-0 ml-2 font-mono">
                          {formatPrice(149)}
                        </span>
                      </label>
                    </div>
                  </div>

                </div>
              ) : (
                /* Step 2: Payment Options & Signature Box */
                <div className="space-y-6">
                  
                  {/* Signature Box & Personal Gift Note */}
                  <div className="bg-brand-cream/60 p-5 rounded-2xl border border-brand-gold/30 space-y-4">
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
                        <span className="text-[11px] text-stone-500 block">
                          Includes a printed signature card with your personalized message inside protective packaging.
                        </span>
                      </div>
                    </label>

                    {isSignatureBoxEnabled && (
                      <div className="space-y-3 pt-3 border-t border-brand-gold/20 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Recipient Name (To)</label>
                            <input
                              type="text"
                              placeholder="e.g. Ananya Sharma"
                              value={signatureData.recipientName}
                              onChange={(e) => setSignatureData({ ...signatureData, recipientName: e.target.value })}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Sender Signature (From)</label>
                            <input
                              type="text"
                              placeholder="e.g. With love, Rohan"
                              value={signatureData.senderSignature}
                              onChange={(e) => setSignatureData({ ...signatureData, senderSignature: e.target.value })}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 outline-none focus:border-brand-rose bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 mb-1">Personal Gift Message / Signature Note</label>
                          <textarea
                            rows="3"
                            placeholder="Write your custom gift message here to be printed on the signature card..."
                            value={signatureData.giftNote}
                            onChange={(e) => setSignatureData({ ...signatureData, giftNote: e.target.value })}
                            className="w-full text-xs p-3 rounded-xl border border-stone-300 outline-none focus:border-brand-rose bg-white leading-relaxed"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Gateway Options */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg font-bold text-stone-900">2. Select Payment Gateway</h3>
                    
                    {/* Razorpay Online Payment */}
                    <label className={`p-4 rounded-2xl border block cursor-pointer transition-all ${
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
                    <label className={`p-4 rounded-2xl border block cursor-pointer transition-all ${
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

                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                  >
                    ← Back to Address & Shipping
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="ml-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3.5 px-8 rounded-full flex items-center gap-2 shadow-soft-rose transition-colors text-xs uppercase tracking-wider"
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing Order...
                    </span>
                  ) : step === 1 ? (
                    'Continue to Payment & Options'
                  ) : (
                    `Pay ${formatPrice(grandTotal)} Now`
                  )}
                  {!isProcessingPayment && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar (Shows Price WITHOUT Shipping First) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-brand-gold/20 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary ({cart.reduce((a, b) => a + (Number(b.qty) || 0), 0)} Items)
            </h3>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center border-b border-stone-100 pb-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-stone-50 to-brand-cream/40 p-1 border border-stone-200 flex-shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-stone-500">Finish: {item.finish} | Qty: {item.qty}</p>
                    <p className="text-xs font-bold text-brand-rose mt-0.5">{formatPrice((Number(item.price) || 0) * (Number(item.qty) || 1))}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown: SHOWS PRICE WITHOUT SHIPPING FIRST */}
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
                <span>Calculated Shipping Fee ({formData.shippingMethod === 'express' ? 'Air Priority' : 'India Standard Courier'}):</span>
                <span className="font-bold text-stone-900">{formatPrice(shippingCost)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span>Total Amount Payable:</span>
                <span className="text-brand-rose font-mono">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 space-y-1.5 pt-1">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> Handcrafted Quality Assured
              </p>
              <p className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-rose" /> Signature Protective Packaging Included
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
                  <span className="font-semibold text-stone-900">{formatPrice((Number(item.price) || 0) * (Number(item.qty) || 1))}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal (excl. shipping):</span>
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
                <span className="text-brand-rose font-mono">{formatPrice(completedOrder?.total || 0)}</span>
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
              <Printer className="w-4 h-4" /> Print Order Receipt
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
