import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Printer, 
  RotateCcw, 
  User, 
  Mail, 
  Phone, 
  Bookmark, 
  Heart, 
  ShoppingBag, 
  ChevronRight, 
  Lock, 
  ShieldCheck,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function AccountView() {
  const { 
    user, 
    orders, 
    products, 
    wishlist, 
    addToCart, 
    toggleWishlist, 
    navigateTo, 
    setIsAuthModalOpen,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'wishlist'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'processing' | 'shipped' | 'delivered'
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Address Register State
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('ella_saved_addresses');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    name: user?.user_metadata?.full_name || '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    addressType: 'Home'
  });

  // Strict Authentication Guard
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-900 text-brand-gold mx-auto flex items-center justify-center shadow-xl border border-brand-gold/30">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
            Account Required
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">Sign In to View Orders</h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            Please sign in to your Ella Creations account to view your order history, track live shipments, and manage saved addresses.
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

  // Filter User's Orders by User ID or Matching Email
  const userOrders = orders.filter((o) => {
    if (!o) return false;
    const matchUserId = o.user_id && o.user_id === user.id;
    const matchEmail = (o.customer?.email || '').toLowerCase() === (user.email || '').toLowerCase();
    return matchUserId || matchEmail;
  });

  const filteredOrders = userOrders.filter((o) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'processing') return (o.status || '').toLowerCase() === 'processing';
    if (statusFilter === 'shipped') return (o.status || '').toLowerCase() === 'shipped';
    if (statusFilter === 'delivered') return (o.status || '').toLowerCase() === 'delivered';
    return true;
  });

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Add Address Handler
  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddrForm.name || !newAddrForm.phone || !newAddrForm.address || !newAddrForm.zip) {
      showToast('Please fill in all required address fields.', 'error');
      return;
    }
    const newAddr = {
      id: `addr-${Date.now()}`,
      ...newAddrForm
    };
    const updated = [newAddr, ...savedAddresses];
    setSavedAddresses(updated);
    try {
      localStorage.setItem('ella_saved_addresses', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving address:', e);
    }
    setIsAddingAddress(false);
    setNewAddrForm({
      name: user?.user_metadata?.full_name || '',
      phone: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      zip: '',
      addressType: 'Home'
    });
    showToast('New shipping address added to register!');
  };

  const handleDeleteAddress = (id) => {
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
    try {
      localStorage.setItem('ella_saved_addresses', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed updating address register:', e);
    }
    showToast('Address removed from register', 'info');
  };

  // Reorder Handler
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    let count = 0;
    order.items.forEach((item) => {
      const prod = products.find(p => p.id === item.id);
      if (prod) {
        addToCart(prod, item.qty || 1, item.finish || null);
        count++;
      }
    });
    if (count > 0) {
      showToast(`Added ${count} item(s) from Order #${order.id} back into your cart!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* USER PROFILE HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-brand-rose to-brand-gold p-1 shadow-lg flex-shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-2xl font-bold">
                  {(user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {user.user_metadata?.full_name || 'Valued Customer'}
                </h1>
                <span className="bg-brand-gold/20 text-brand-gold text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-brand-gold/30 uppercase tracking-wider">
                  Verified Account
                </span>
              </div>
              <p className="text-xs text-stone-300 flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-stone-400" /> {user.email}
              </p>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="text-lg font-bold text-brand-gold block font-mono">{userOrders.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-300 font-semibold">Total Orders</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="text-lg font-bold text-emerald-400 block font-mono">
                {userOrders.filter(o => o.status === 'Shipped' || o.status === 'Processing').length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-300 font-semibold">In Transit</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="text-lg font-bold text-brand-rose block font-mono">{wishlist.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-stone-300 font-semibold">Wishlist</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACCOUNT NAVIGATION TABS */}
      <div className="flex border-b border-stone-200 gap-4 sm:gap-8 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'border-brand-rose text-brand-rose' : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" /> Order History & Live Tracking ({userOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'addresses' ? 'border-brand-rose text-brand-rose' : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Bookmark className="w-4 h-4" /> Saved Addresses ({savedAddresses.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'wishlist' ? 'border-brand-rose text-brand-rose' : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
        </button>
      </div>

      {/* TAB 1: ORDER HISTORY & LIVE SHIPMENT TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Status Filter Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-3 rounded-2xl border border-stone-200 shadow-sm text-xs font-semibold">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[11px] px-2">Filter Orders:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'processing', label: 'Processing' },
                { key: 'shipped', label: 'Shipped / Dispatched' },
                { key: 'delivered', label: 'Delivered' }
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    statusFilter === f.key
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-brand-gold/20 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-cream text-brand-rose mx-auto flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">No Orders Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {statusFilter !== 'all' 
                  ? `No orders matching filter "${statusFilter}".` 
                  : "You haven't placed any jewelry orders with this account yet."}
              </p>
              <button
                onClick={() => navigateTo('shop')}
                className="bg-brand-rose text-white text-xs font-semibold px-6 py-2.5 rounded-full shadow-soft-rose hover:bg-brand-rose/90 transition-colors"
              >
                Start Shopping Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const isShipped = order.status === 'Shipped';
                const isDelivered = order.status === 'Delivered';

                return (
                  <div 
                    key={order.id}
                    className="bg-white rounded-3xl border border-brand-gold/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Order Header Summary Bar */}
                    <div className="bg-brand-cream/60 p-4 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-serif text-lg font-bold text-stone-900">Order #{order.id}</span>
                          <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider border ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isShipped
                              ? 'bg-sky-100 text-sky-800 border-sky-300 animate-pulse'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            {order.status || 'Processing'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Placed on {new Date(order.created_at || order.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">Total Amount</span>
                          <span className="font-serif text-lg font-bold text-brand-rose font-mono">{formatPrice(order.total || 0)}</span>
                        </div>

                        {order.tracking_url && (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-brand-rose text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-soft-rose hover:bg-brand-rose/90 transition-colors flex items-center gap-1.5"
                          >
                            <Truck className="w-4 h-4" /> Track Live <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* LIVE SHIPMENT STATUS TRACKER BAR */}
                    <div className="p-4 sm:p-6 border-b border-stone-100 bg-stone-50/50">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
                          <span className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-brand-rose" /> Courier Dispatch Status:
                          </span>
                          <span className="font-mono text-[11px] text-stone-900 bg-white px-2.5 py-0.5 rounded border border-stone-200">
                            {order.shipping_courier || 'Shiprocket Express Partner'}
                          </span>
                        </div>

                        {/* Progress Stepper Bar */}
                        <div className="relative pt-2">
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-stone-200">
                            <div 
                              style={{ 
                                width: isDelivered ? '100%' : isShipped ? '66%' : '33%' 
                              }} 
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                                isDelivered ? 'bg-emerald-500' : isShipped ? 'bg-sky-500' : 'bg-brand-gold'
                              }`}
                            />
                          </div>

                          <div className="flex justify-between text-[11px] font-semibold text-stone-500 pt-2">
                            <span className="text-emerald-700">1. Order Placed & Confirmed</span>
                            <span className={isShipped || isDelivered ? 'text-sky-700 font-bold' : ''}>2. Shipped & Dispatched</span>
                            <span className={isDelivered ? 'text-emerald-700 font-bold' : ''}>3. Delivered to Doorstep</span>
                          </div>
                        </div>

                        {/* AWB & Live Details */}
                        {order.awb_code && (
                          <div className="bg-white p-3 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between text-xs gap-2">
                            <span className="text-stone-600 font-medium">
                              AWB Tracking Code: <strong className="font-mono text-stone-900">{order.awb_code}</strong>
                            </span>
                            {order.tracking_url && (
                              <a 
                                href={order.tracking_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-brand-rose hover:underline font-bold text-[11px] flex items-center gap-1"
                              >
                                View Shiprocket Live Updates <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ITEMS LIST IN ORDER */}
                    <div className="p-4 sm:p-6 space-y-4">
                      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        Items Included in Order ({order.items?.length || 0})
                      </h4>

                      <div className="grid grid-cols-1 gap-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80">
                            <div className="w-16 h-16 rounded-xl bg-white p-1 border border-stone-200 flex-shrink-0 flex items-center justify-center">
                              <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-stone-900 truncate">{item.title}</h5>
                              <p className="text-[11px] text-stone-500">Finish/Variant: <strong>{item.finish || 'Standard'}</strong></p>
                              <p className="text-xs font-bold text-brand-rose font-mono mt-0.5">
                                {item.qty}x {formatPrice(item.price)}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                const prod = products.find(p => p.id === item.id);
                                if (prod) navigateTo('product', prod.id);
                              }}
                              className="text-xs font-semibold text-stone-500 hover:text-stone-900 border border-stone-200 bg-white px-3 py-1.5 rounded-xl transition-colors hidden sm:block"
                            >
                              Buy Again
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address & Actions Footer */}
                      <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-xs text-stone-600 space-y-0.5">
                          <span className="font-bold text-stone-900 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-rose" /> Delivery Address:
                          </span>
                          <p className="text-[11px] text-stone-500 truncate max-w-md">
                            {order.customer?.address || 'Standard Registered Address'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" /> Invoice
                          </button>

                          <button
                            onClick={() => handleReorder(order)}
                            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm ml-auto sm:ml-0"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reorder All
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SAVED ADDRESS REGISTER */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Address Book Register</h3>
              <p className="text-xs text-stone-500">Manage your default and saved delivery addresses for 1-click checkout.</p>
            </div>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="bg-brand-rose text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-soft-rose hover:bg-brand-rose/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> {isAddingAddress ? 'Cancel' : 'Add New Address'}
            </button>
          </div>

          {/* Add Address Form Modal */}
          {isAddingAddress && (
            <form onSubmit={handleSaveNewAddress} className="bg-white p-6 rounded-3xl border border-brand-gold/30 shadow-md space-y-4 animate-fadeIn">
              <h4 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">Add New Delivery Address</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAddrForm.name}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (+91) *</label>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="10-digit mobile"
                    value={newAddrForm.phone}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Flat / House No. & Building *</label>
                  <input
                    type="text"
                    required
                    placeholder="Building name, flat number, street name"
                    value={newAddrForm.address}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, address: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="Near park, temple, etc."
                    value={newAddrForm.landmark}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, landmark: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddrForm.city}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newAddrForm.state}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    placeholder="6-digit pincode"
                    value={newAddrForm.zip}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, zip: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <div className="flex gap-2">
                  {['Home', 'Office'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddrForm({ ...newAddrForm, addressType: type })}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                        newAddrForm.addressType === type ? 'bg-brand-rose text-white border-brand-rose' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-brand-rose text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-soft-rose"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Address Cards Grid */}
          {savedAddresses.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-stone-200 text-center space-y-3">
              <p className="text-xs text-stone-500">No saved addresses found in your register.</p>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="text-xs text-brand-rose font-bold hover:underline"
              >
                + Add your first delivery address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div key={addr.id} className="bg-white p-5 rounded-2xl border border-brand-gold/30 shadow-sm relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{addr.name}</span>
                    <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      {addr.addressType || 'Home'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {addr.address}{addr.landmark ? `, Near ${addr.landmark}` : ''}, {addr.city}, {addr.state} - {addr.zip}
                  </p>
                  <p className="text-xs text-stone-500 font-mono">Mobile: {addr.phone}</p>
                  
                  <div className="pt-2 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 3: SAVED WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="font-serif text-xl font-bold text-stone-900">Your Saved Wishlist</h3>
            <p className="text-xs text-stone-500">Jewelry items you saved for special occasions and future purchases.</p>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500">Your wishlist is empty. Tap the heart icon on any jewelry piece to save it here.</p>
              <button
                onClick={() => navigateTo('shop')}
                className="bg-brand-rose text-white text-xs font-semibold px-6 py-2 rounded-full shadow-soft-rose"
              >
                Explore Jewelry Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square rounded-xl bg-stone-50 overflow-hidden relative">
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-500 shadow-md"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-stone-900 truncate">{product.title}</h4>
                    <p className="text-xs font-bold text-brand-rose font-mono">{formatPrice(product.price)}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-brand-rose text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 shadow-soft-rose"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
