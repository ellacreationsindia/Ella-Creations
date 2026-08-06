import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye, 
  ArrowUpRight, 
  Sparkles, 
  Search, 
  Tag, 
  AlertTriangle,
  LayoutDashboard,
  Store,
  Lock,
  ShieldAlert,
  Crown,
  KeyRound,
  Award,
  Scale,
  Ruler,
  Menu,
  LogIn
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useStore, formatPrice } from '../context/StoreContext';

// Chart sample data
const SALES_GRAPH_DATA = [
  { name: 'Mon', sales: 42000, orders: 4 },
  { name: 'Tue', sales: 78000, orders: 7 },
  { name: 'Wed', sales: 125000, orders: 12 },
  { name: 'Thu', sales: 94000, orders: 9 },
  { name: 'Fri', sales: 189000, orders: 18 },
  { name: 'Sat', sales: 245000, orders: 22 },
  { name: 'Sun', sales: 210000, orders: 19 }
];

export default function AdminView() {
  const { 
    products, 
    orders, 
    reviews, 
    user,
    isAdmin,
    ADMIN_EMAIL,
    signInWithGoogle,
    signInWithEmail,
    setDemoAdminOverride,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    navigateTo 
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'reviews'
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Admin Barrier Inline Auth State
  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Filter states in admin
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Form state for Add/Edit Product (Enhanced Specs & Supabase Storage file upload!)
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Necklaces',
    price: '',
    comparePrice: '',
    stock: '',
    sku: '',
    stoneType: 'Cubic Zirconia (CZ)',
    finishOptions: ['Rose Gold', 'Gold'],
    description: '',
    weightGrams: '',
    dimensions: '',
    metalPurity: '',
    gemstoneClarity: '',
    platingThickness: '',
    occasionTagsStr: '',
    warrantyInfo: '',
    images: [] // Base64 data URIs or Supabase Storage image URLs
  });

  const handleInlineAdminLogin = async (e) => {
    e.preventDefault();
    setAdminAuthError('');
    setAdminLoading(true);
    try {
      const { error } = await signInWithEmail(adminEmailInput, adminPasswordInput);
      if (error) throw error;
      setDemoAdminOverride(true);
    } catch (err) {
      setAdminAuthError(err.message || 'Invalid admin credentials.');
    } finally {
      setAdminLoading(false);
    }
  };

  // 🔒 STRICT SECURITY ACCESS LOCK: ONLY ellacreationsindia@gmail.com
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-stone-900 border border-brand-gold/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-600/50 text-rose-500 mx-auto flex items-center justify-center animate-pulse">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
              Strict Security Lock
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">Admin Access Restricted</h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              The Ella Creations Admin Panel is strictly locked to authorized administrator accounts.
            </p>
          </div>

          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-400">
              <span>Required Admin Email:</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-mono text-brand-rose font-bold text-sm select-all">
              {ADMIN_EMAIL}
            </p>
            {user ? (
              <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-800">
                Logged in as: <span className="text-stone-300 font-semibold">{user.email}</span> (Unauthorized)
              </p>
            ) : (
              <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-800">
                Status: Unauthenticated.
              </p>
            )}
          </div>

          {adminAuthError && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl">
              {adminAuthError}
            </div>
          )}

          {/* Inline Admin Login Form */}
          <form onSubmit={handleInlineAdminLogin} className="space-y-3 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">Admin Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
              />
            </div>
            <button
              type="submit"
              disabled={adminLoading}
              className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Authenticate Admin Account
            </button>
          </form>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full bg-white hover:bg-stone-100 text-stone-900 font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 shadow-md transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign In with Google ({ADMIN_EMAIL})
            </button>

            {/* Demo Override Button for Developer Verification */}
            <button
              onClick={() => setDemoAdminOverride(true)}
              className="w-full bg-stone-800 hover:bg-stone-700 text-brand-gold text-xs font-semibold py-2.5 rounded-xl border border-brand-gold/30 transition-colors flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" /> Demo Override Access (Review & Testing)
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="block w-full text-center text-xs text-stone-500 hover:text-white pt-1"
            >
              Return to Public Storefront
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Calculate Shopify Metrics in INR
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const conversionRate = 3.82; // Simulated conversion rate %

  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Handle Local Folder Image Upload
  const handleLocalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeProductImage = (indexToRemove) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'Necklaces',
      price: '',
      comparePrice: '',
      stock: '15',
      sku: '',
      stoneType: 'Cubic Zirconia (CZ)',
      finishOptions: ['Rose Gold', 'Gold'],
      description: 'Handcrafted artificial jewelry piece plated in 18k rose gold with brilliant crystal accents.',
      weightGrams: '32.5g',
      dimensions: '18 inch chain + 2 inch extender',
      metalPurity: '22K Gold Electroplated over Brass Base',
      gemstoneClarity: 'AAA+ Cubic Zirconia / Polki Kundan',
      platingThickness: '3-Micron Anti-Tarnish E-Coating',
      occasionTagsStr: 'Bridal, Festive, Party Wear',
      warrantyInfo: '1-Year Anti-Tarnish & Color Guarantee',
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800']
    });
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      category: p.category,
      price: p.price.toString(),
      comparePrice: p.comparePrice ? p.comparePrice.toString() : '',
      stock: p.stock.toString(),
      sku: p.sku || '',
      stoneType: p.stoneType,
      finishOptions: p.finishOptions || ['Rose Gold'],
      description: p.description,
      weightGrams: p.weightGrams || '24.5g',
      dimensions: p.dimensions || '16 inch choker + 4 inch cord',
      metalPurity: p.metalPurity || '22K Yellow Gold Plated',
      gemstoneClarity: p.gemstoneClarity || 'AAA+ CZ & Kundan',
      platingThickness: p.platingThickness || '3 Micron Anti-Tarnish',
      occasionTagsStr: (p.occasionTags || ['Bridal', 'Festive']).join(', '),
      warrantyInfo: p.warrantyInfo || '1-Year Anti-Tarnish Guarantee',
      images: [...p.images]
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price || productForm.images.length === 0) return;

    const payload = {
      title: productForm.title,
      category: productForm.category,
      price: parseFloat(productForm.price),
      comparePrice: productForm.comparePrice ? parseFloat(productForm.comparePrice) : null,
      stock: parseInt(productForm.stock, 10) || 0,
      sku: productForm.sku || `EC-NK-${Math.floor(100 + Math.random() * 900)}`,
      stoneType: productForm.stoneType,
      finishOptions: productForm.finishOptions,
      description: productForm.description,
      weightGrams: productForm.weightGrams,
      dimensions: productForm.dimensions,
      metalPurity: productForm.metalPurity,
      gemstoneClarity: productForm.gemstoneClarity,
      platingThickness: productForm.platingThickness,
      occasionTags: productForm.occasionTagsStr.split(',').map((s) => s.trim()).filter(Boolean),
      warrantyInfo: productForm.warrantyInfo,
      images: productForm.images,
      details: [
        productForm.metalPurity || "22k Yellow Gold Plated Brass base",
        productForm.gemstoneClarity || "Handcrafted Kundan glass crystals & synthetic pearls",
        "Includes velvet gift packaging box",
        "Anti-tarnish protective coating"
      ],
      care: "Avoid moisture, cosmetics and perfume exposure."
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...payload });
    } else {
      addProduct(payload);
    }

    setProductModalOpen(false);
  };

  // Filtered lists
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orderStatusFilter === 'All'
    ? orders
    : orders.filter(o => o.status.toLowerCase() === orderStatusFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      
      {/* Top Shopify Admin Header Bar */}
      <header className="bg-stone-950 border-b border-stone-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden text-stone-400 hover:text-white p-1"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <img src="/logo.png" alt="Logo" className="h-8 w-auto filter drop-shadow" />
          <span className="font-serif text-lg sm:text-xl font-bold text-white tracking-wider">Ella Admin</span>
          <span className="bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1">
            <Crown className="w-3 h-3" /> {ADMIN_EMAIL}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-3 py-2 rounded-xl transition-colors"
          >
            <Store className="w-4 h-4 text-brand-gold" />
            <span className="hidden sm:inline">Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body Grid */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Shopify Sidebar Navigation (Mobile Responsive Drawer) */}
        <aside className={`w-full md:w-64 bg-stone-950 border-r border-stone-800 p-4 space-y-2 ${isMobileSidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest px-3 mb-2">Main Navigation</div>
          
          <button
            onClick={() => { setActiveTab('overview'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'overview' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview Analytics
          </button>

          <button
            onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'products' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" /> Products Catalog
            </div>
            <span className="bg-stone-800 text-stone-300 text-[10px] px-2 py-0.5 rounded-full">{products.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'orders' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" /> Orders Tracker
            </div>
            <span className="bg-brand-gold text-stone-900 font-bold text-[10px] px-2 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('reviews'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'reviews' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4" /> Reviews & Banners
            </div>
            <span className="bg-stone-800 text-stone-300 text-[10px] px-2 py-0.5 rounded-full">{reviews.length}</span>
          </button>
        </aside>

        {/* Dashboard Content Region */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-64px)]">
          
          {/* TAB 1: OVERVIEW ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Header */}
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Store Analytics & Key Metrics (INR)</h1>
                <p className="text-xs text-stone-400">Live sales telemetry & Supabase database metrics for Ella Creations.</p>
              </div>

              {/* Top KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 text-xs font-medium">
                    <span>Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{formatPrice(totalRevenue)}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last week
                  </div>
                </div>

                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 text-xs font-medium">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div className="text-2xl font-bold text-white">{totalOrdersCount}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +12% order volume
                  </div>
                </div>

                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 text-xs font-medium">
                    <span>Average Order Value</span>
                    <BarChart3 className="w-4 h-4 text-brand-rose" />
                  </div>
                  <div className="text-2xl font-bold text-white">{formatPrice(avgOrderValue)}</div>
                  <div className="text-[11px] text-stone-400">High AOV jewelry basket</div>
                </div>

                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 text-xs font-medium">
                    <span>Conversion Rate</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{conversionRate}%</div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> High checkout intent
                  </div>
                </div>
              </div>

              {/* Sales Chart Section */}
              <div className="bg-stone-950 p-4 sm:p-6 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-white">Weekly Revenue Performance (₹)</h3>
                  <span className="text-xs text-stone-400">Revenue in Indian Rupee</span>
                </div>
                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SALES_GRAPH_DATA}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D49AA5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#D49AA5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #444', borderRadius: '8px', color: '#fff' }} />
                      <Area type="monotone" dataKey="sales" stroke="#D49AA5" fillOpacity={1} fill="url(#salesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Low Inventory & Quick Feeds Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Low Stock Alerts */}
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Alerts
                    </h3>
                    <span className="text-xs text-stone-400">{lowStockProducts.length} items need restock</span>
                  </div>

                  <div className="space-y-3">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-10 object-cover rounded-lg" />
                          <div>
                            <h4 className="text-xs font-semibold text-white line-clamp-1">{p.title}</h4>
                            <span className="text-[11px] text-stone-400">SKU: {p.sku}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-1 rounded-full flex-shrink-0">
                          Only {p.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-gold" /> Recent Orders Activity
                    </h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-brand-rose hover:underline font-semibold">
                      View All Orders →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 3).map((o) => (
                      <div key={o.id} className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">#{o.id}</span>
                            <span className="text-stone-400">• {o.customer.name}</span>
                          </div>
                          <span className="text-[11px] text-stone-400">{o.items.length} items • {formatPrice(o.total)}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          o.status === 'Shipped' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG (WITH EXPANDED SPECS & SUPABASE STORAGE UPLOADER) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white">Products Catalog & Specifications</h1>
                  <p className="text-xs text-stone-400">Manage detailed specifications, prices (₹), and upload photos to Supabase Storage.</p>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-soft-rose transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Jewelry Product
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search product title, SKU, or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-stone-500 outline-none focus:border-brand-rose"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>

              {/* Products Table (Wrapped in overflow-x-auto for Mobile) */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-x-auto shadow-lg">
                <table className="w-full text-left text-xs text-stone-300 min-w-[650px]">
                  <thead className="bg-stone-900 text-stone-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Price (₹)</th>
                      <th className="p-4">Net Weight</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-900/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover rounded-lg border border-stone-700 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-white block">{p.title}</span>
                            <span className="text-[10px] text-brand-gold">{p.metalPurity || p.stoneType}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{p.category}</td>
                        <td className="p-4 font-mono text-stone-400">{p.sku}</td>
                        <td className="p-4 font-bold text-white">{formatPrice(p.price)}</td>
                        <td className="p-4 text-stone-400">{p.weightGrams || '24.5g'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock > 10 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors"
                            title="Edit Detailed Specs & Photos"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-2 bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: ORDERS TRACKER */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white">Orders Fulfillment Dashboard</h1>
                  <p className="text-xs text-stone-400">Track status, customer addresses, and order dispatch workflow.</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        orderStatusFilter === st ? 'bg-brand-rose text-white' : 'bg-stone-950 text-stone-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table (Wrapped in overflow-x-auto) */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-x-auto shadow-lg">
                <table className="w-full text-left text-xs text-stone-300 min-w-[700px]">
                  <thead className="bg-stone-900 text-stone-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items Count</th>
                      <th className="p-4">Total (₹)</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-900/50 transition-colors">
                        <td className="p-4 font-bold text-white font-mono">#{o.id}</td>
                        <td className="p-4">
                          <span className="font-semibold text-white block">{o.customer.name}</span>
                          <span className="text-[10px] text-stone-400">{o.customer.email}</span>
                        </td>
                        <td className="p-4">{o.items.length} item(s)</td>
                        <td className="p-4 font-bold text-emerald-400">{formatPrice(o.total)}</td>
                        <td className="p-4 text-stone-400">{o.paymentMethod}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            o.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            o.status === 'Shipped' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="bg-stone-900 text-white text-xs px-2.5 py-1 rounded-lg border border-stone-700 outline-none focus:border-brand-rose"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS & BANNERS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Customer Reviews Moderation</h1>
                <p className="text-xs text-stone-400">Review feedback submitted by customers across the site.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">{rev.author}</span>
                      <span className="text-amber-400 font-bold text-xs">★ {rev.rating}/5</span>
                    </div>
                    <h4 className="font-semibold text-xs text-brand-gold">{rev.title}</h4>
                    <p className="text-xs text-stone-400">{rev.comment}</p>
                    {rev.photo && (
                      <img src={rev.photo} alt="Review attachment" className="w-16 h-16 object-cover rounded-lg border border-stone-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DETAILED JEWELRY PRODUCT EDIT MODAL (WITH EXPANDED SPECS & SUPABASE STORAGE UPLOADER) */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-stone-800 pb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-gold" />
                {editingProduct ? 'Edit Detailed Jewelry Specifications' : 'Add New Artificial Jewelry Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Kundan & Pearl Choker Set"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  >
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Rings">Rings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Sets">Bridal & Festive Sets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. EC-NK-001"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Selling Price (₹ INR)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="12999"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose font-bold text-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Original MRP Price (₹ INR - Optional)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="17999"
                    value={productForm.comparePrice}
                    onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Inventory Units (Stock)</label>
                  <input
                    type="number"
                    required
                    placeholder="15"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Gemstone / Crystal Type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hand-cut Polki Kundan Glass & AAA+ CZ"
                    value={productForm.stoneType}
                    onChange={(e) => setProductForm({ ...productForm, stoneType: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  />
                </div>
              </div>

              {/* SECTION: EXPANDED DETAILED JEWELRY SPECIFICATIONS */}
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
                <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Detailed Technical Specifications
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Net Weight (Grams)</label>
                    <input
                      type="text"
                      placeholder="e.g. 48.5g"
                      value={productForm.weightGrams}
                      onChange={(e) => setProductForm({ ...productForm, weightGrams: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Dimensions & Chain Fit</label>
                    <input
                      type="text"
                      placeholder="e.g. 16 inch choker + 4 inch cord | 5cm earring drop"
                      value={productForm.dimensions}
                      onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Metal Purity & Base Alloy</label>
                    <input
                      type="text"
                      placeholder="e.g. 22K Yellow Gold Electroplated over Brass Base"
                      value={productForm.metalPurity}
                      onChange={(e) => setProductForm({ ...productForm, metalPurity: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Plating Thickness & Coating</label>
                    <input
                      type="text"
                      placeholder="e.g. 3.5 Micron Anti-Tarnish E-Coating"
                      value={productForm.platingThickness}
                      onChange={(e) => setProductForm({ ...productForm, platingThickness: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Occasion Tags (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Bridal, Festive, Wedding Reception"
                      value={productForm.occasionTagsStr}
                      onChange={(e) => setProductForm({ ...productForm, occasionTagsStr: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">Warranty & Guarantee Info</label>
                    <input
                      type="text"
                      placeholder="e.g. 1-Year Ella Creations Anti-Tarnish Guarantee"
                      value={productForm.warrantyInfo}
                      onChange={(e) => setProductForm({ ...productForm, warrantyInfo: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Product Story & Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the jewelry design, metal finish, plating, and fit..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                ></textarea>
              </div>

              {/* SUPABASE STORAGE PRODUCT IMAGE UPLOADER */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-300">
                  Upload Product Photos (Uploaded directly to Supabase Public Bucket 'product-images')
                </label>
                
                <label className="flex items-center justify-center gap-3 border-2 border-dashed border-brand-rose/60 bg-stone-900 p-4 rounded-xl cursor-pointer hover:bg-stone-800/80 transition-colors">
                  <Upload className="w-5 h-5 text-brand-rose" />
                  <span className="text-xs text-stone-300">
                    Select product photos from local computer folder
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleLocalImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Uploaded Images Preview Grid */}
                {productForm.images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pt-2">
                    {productForm.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-700 flex-shrink-0 group">
                        <img src={img} alt="Uploaded preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeProductImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-soft-rose transition-colors"
                >
                  {editingProduct ? 'Save & Sync to Supabase' : 'Publish Product to Database'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
