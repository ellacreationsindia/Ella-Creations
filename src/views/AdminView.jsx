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
  Video, 
  CheckCircle2, 
  Clock, 
  X,
  Grid,
  List,
  Filter, 
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
  LogIn,
  Percent,
  PlusCircle,
  GripVertical,
  MoveLeft,
  MoveRight,
  Star,
  Truck,
  Layers,
  ListPlus,
  Ticket,
  Mail,
  Download,
  BookOpen,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { useStore, formatPrice } from '../context/StoreContext';
import { compressImageDataUrl } from '../lib/supabase';

function SalesAreaChart({ data }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const width = 650;
  const height = 260;

  const safeData = Array.isArray(data) && data.length > 0 ? data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(name => ({ name, sales: 0 }));
  const maxVal = Math.max(...safeData.map((d) => Number(d?.sales) || 0), 1000);
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = safeData.map((d, i) => {
    const x = paddingLeft + (i / Math.max(1, safeData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((Number(d?.sales) || 0) / maxVal) * chartHeight;
    return { x, y, name: d?.name || '', sales: Number(d?.sales) || 0 };
  });

  if (!points || points.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-stone-500 text-xs font-mono">
        No Telemetry Sales Data Available
      </div>
    );
  }

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 overflow-visible">
      {/* Grid Lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
        const y = paddingTop + chartHeight * (1 - ratio);
        const val = Math.round(maxVal * ratio);
        return (
          <g key={idx}>
            <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#27272a" strokeDasharray="3 3" />
            <text x={paddingLeft - 10} y={y + 4} fill="#a1a1aa" fontSize="10" textAnchor="end" fontFamily="monospace">
              ₹{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
            </text>
          </g>
        );
      })}

      {/* Area Gradient */}
      <defs>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D49AA5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D49AA5" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      <path d={areaD} fill="url(#salesGrad)" />
      <path d={pathD} fill="none" stroke="#D49AA5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Interactive Hover Dots */}
      {points.map((pt, idx) => (
        <g key={idx} className="cursor-pointer group" onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)}>
          <circle cx={pt.x} cy={pt.y} r="5" fill="#18181b" stroke="#D49AA5" strokeWidth="2.5" className="transition-transform group-hover:scale-125" />
          <text x={pt.x} y={height - 10} fill="#a1a1aa" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
            {pt.name}
          </text>
        </g>
      ))}

      {/* Hover Tooltip */}
      {hoveredPoint && (
        <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y - 35})`}>
          <rect x="-45" y="-18" width="90" height="24" rx="6" fill="#09090b" stroke="#CFA45C" strokeWidth="1" />
          <text x="0" y="-2" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            {formatPrice(hoveredPoint.sales)}
          </text>
        </g>
      )}
    </svg>
  );
}

export default function AdminView() {
  const { 
    products, 
    orders, 
    reviews, 
    coupons,
    subscribers,
    blogs,
    addBlog,
    updateBlog,
    deleteBlog,
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
    deleteOrder,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    updateOrderShipment,
    deleteSubscriber,
    showToast,
    navigateTo 
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'reviews' | 'coupons' | 'subscribers' | 'blogs'
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  // Blog Management State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogPreviewOpen, setBlogPreviewOpen] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Bridal Trends',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Ella Editorial Concierge',
    readTime: '4 min read',
    status: 'Published'
  });

  // Catalog UI Controls
  const [catalogViewMode, setCatalogViewMode] = useState('grid'); // 'grid' | 'table'
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All');

  // Shiprocket Dispatch Modal State
  const [dispatchOrder, setDispatchOrder] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({
    courierName: 'Shiprocket Air Express (Bluedart)',
    awbCode: '',
    trackingUrl: ''
  });

  // Coupon Generator Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercent: '15',
    minSpend: '0',
    description: '',
    active: true
  });

  // Admin Barrier Inline Auth State
  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Filter states in admin
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Drag and drop state for showcase images & files
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [draggedImageIdx, setDraggedImageIdx] = useState(null);
  const [dragOverImageIdx, setDragOverImageIdx] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Product Form State with Variants, Custom Sections, Video Support, and Tax Rate
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Necklaces',
    price: '',
    comparePrice: '',
    taxPercent: '18',
    stock: '',
    sku: '',
    stoneType: '',
    description: '',
    occasionTagsStr: '',
    images: [],
    videos: [],
    variants: [], // Array of { id, name, sku, price, stock, swatchColor }
    customSections: [] // Array of { title, items: [{ label, value }] }
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

  // Calculate REAL Legitimate Telemetry from database ONLY
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  const totalOrdersCount = (orders || []).length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Build Real Sales Chart from DB Orders
  const realSalesByDay = (orders || []).reduce((acc, order) => {
    if (!order) return acc;
    const dateVal = order.date || order.created_at;
    const dateObj = dateVal ? new Date(dateVal) : null;
    const day = (dateObj && !isNaN(dateObj.getTime())) ? dateObj.toLocaleDateString('en-US', { weekday: 'short' }) : 'Mon';
    acc[day] = (acc[day] || 0) + (Number(order.total) || 0);
    return acc;
  }, {});

  const REAL_SALES_GRAPH_DATA = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    name: day,
    sales: realSalesByDay[day] || 0
  }));

  const lowStockProducts = (products || []).filter((p) => p && Number(p.stock) <= 5);

  // Handle Photo & Video Uploads
  const handleLocalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      const compressedUrl = await compressImageDataUrl(file, 1200, 0.82);
      if (compressedUrl) {
        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, compressedUrl]
        }));
      }
    }
  };

  const handleLocalVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({
          ...prev,
          videos: [...prev.videos, reader.result]
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

  // Drag & Drop File Upload Handlers
  const handleDropFiles = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    for (const file of files) {
      const compressedUrl = await compressImageDataUrl(file, 1200, 0.82);
      if (compressedUrl) {
        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, compressedUrl]
        }));
      }
    }
  };

  const handleDragOverFiles = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(true);
  };

  const handleDragLeaveFiles = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(false);
  };

  // Drag & Drop Showcase Image Reordering Handlers
  const handleImageDragStart = (e, index) => {
    setDraggedImageIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e, index) => {
    e.preventDefault();
    if (draggedImageIdx === null || draggedImageIdx === index) return;
    setDragOverImageIdx(index);
  };

  const handleImageDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedImageIdx === null || draggedImageIdx === targetIndex) return;

    setProductForm((prev) => {
      const newImages = [...prev.images];
      const [draggedImg] = newImages.splice(draggedImageIdx, 1);
      newImages.splice(targetIndex, 0, draggedImg);
      return { ...prev, images: newImages };
    });

    setDraggedImageIdx(null);
    setDragOverImageIdx(null);
  };

  const moveProductImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= productForm.images.length) return;
    setProductForm((prev) => {
      const newImages = [...prev.images];
      const [movedImg] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImg);
      return { ...prev, images: newImages };
    });
  };

  const setImageAsCover = (index) => {
    moveProductImage(index, 0);
  };

  const removeProductVideo = (indexToRemove) => {
    setProductForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Product Variants Builder Helpers
  const addVariantField = () => {
    setProductForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: 'Rose Gold',
          sku: `${prev.sku || 'SKU'}-${prev.variants.length + 1}`,
          price: Number(prev.price || 0),
          stock: Number(prev.stock || 10),
          swatchColor: '#B76E79'
        }
      ]
    }));
  };

  const updateVariantField = (index, field, value) => {
    setProductForm((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const removeVariantField = (index) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  // Custom Sections & Specifications Builder Helpers
  const addCustomSection = () => {
    setProductForm((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        {
          title: 'Section Name',
          items: [{ label: 'Attribute', value: 'Specification Details' }]
        }
      ]
    }));
  };

  const updateCustomSectionTitle = (secIdx, title) => {
    setProductForm((prev) => {
      const updated = [...prev.customSections];
      updated[secIdx].title = title;
      return { ...prev, customSections: updated };
    });
  };

  const removeCustomSection = (secIdx) => {
    setProductForm((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((_, idx) => idx !== secIdx)
    }));
  };

  const addCustomSectionItem = (secIdx) => {
    setProductForm((prev) => {
      const updated = [...prev.customSections];
      updated[secIdx].items.push({ label: '', value: '' });
      return { ...prev, customSections: updated };
    });
  };

  const updateCustomSectionItem = (secIdx, itemIdx, field, val) => {
    setProductForm((prev) => {
      const updated = [...prev.customSections];
      updated[secIdx].items[itemIdx][field] = val;
      return { ...prev, customSections: updated };
    });
  };

  const removeCustomSectionItem = (secIdx, itemIdx) => {
    setProductForm((prev) => {
      const updated = [...prev.customSections];
      updated[secIdx].items = updated[secIdx].items.filter((_, i) => i !== itemIdx);
      return { ...prev, customSections: updated };
    });
  };

  // Coupon Generator Handler
  const handleGenerateCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountPercent) return;
    await addCoupon(couponForm);
    setCouponForm({
      code: '',
      discountPercent: '15',
      minSpend: '0',
      description: '',
      active: true
    });
  };

  // Shiprocket Order Dispatch Handler
  const handleOpenDispatchModal = (order) => {
    const defaultAwb = order.awb_code && !order.awb_code.startsWith('AWB-') ? order.awb_code : '';
    setDispatchOrder(order);
    setDispatchForm({
      courierName: order.shipping_courier || 'Shiprocket Air Express (Bluedart)',
      awbCode: defaultAwb,
      trackingUrl: defaultAwb ? `https://shiprocket.co/tracking/${defaultAwb}` : ''
    });
  };

  const handleSaveDispatch = async (e) => {
    e.preventDefault();
    if (!dispatchOrder) return;
    const cleanAwb = (dispatchForm.awbCode || '').trim();
    const finalUrl = cleanAwb ? `https://shiprocket.co/tracking/${cleanAwb}` : null;
    await updateOrderShipment(
      dispatchOrder.id,
      dispatchForm.courierName,
      cleanAwb || null,
      finalUrl
    );
    setDispatchOrder(null);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'Necklaces',
      price: '',
      comparePrice: '',
      taxPercent: '18',
      stock: '10',
      sku: `EC-${Math.floor(1000 + Math.random() * 9000)}`,
      stoneType: '',
      description: '',
      occasionTagsStr: '',
      images: [],
      videos: [],
      variants: [],
      customSections: [
        {
          title: 'Specifications & Materials',
          items: [
            { label: 'Base Metal', value: 'Brass Base Alloy' },
            { label: 'Plating', value: '22K Gold Electroplated' }
          ]
        }
      ]
    });
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    const existingImages = Array.isArray(p.images) && p.images.length > 0
      ? [...p.images]
      : (p.image ? [p.image] : (p.coverImage ? [p.coverImage] : []));

    setProductForm({
      title: p.title || '',
      category: p.category || 'Necklaces',
      price: p.price !== undefined && p.price !== null ? p.price.toString() : '0',
      comparePrice: p.comparePrice ? p.comparePrice.toString() : '',
      taxPercent: (p.taxPercent || 18).toString(),
      stock: p.stock !== undefined && p.stock !== null ? p.stock.toString() : '10',
      sku: p.sku || '',
      stoneType: p.stoneType || '',
      description: p.description || '',
      occasionTagsStr: (p.occasionTags || []).join(', '),
      images: existingImages,
      videos: [...(p.videos || [])],
      variants: Array.isArray(p.variants) ? [...p.variants] : (p.finishOptions ? p.finishOptions.map((opt, i) => ({ id: `v-${i}`, name: opt, price: p.price, stock: p.stock, sku: `${p.sku}-${i}` })) : []),
      customSections: p.customSections || p.customSpecs || []
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!productForm.title || !productForm.title.trim()) {
      showToast('Please enter a product title.', 'error');
      return;
    }
    if (productForm.price === '' || productForm.price === null || productForm.price === undefined || isNaN(parseFloat(productForm.price))) {
      showToast('Please enter a valid selling price (e.g. 12999 or 0).', 'error');
      return;
    }
    if (isPublishing) return;

    setIsPublishing(true);

    try {
      let finalImages = [...(productForm.images || [])];
      if (finalImages.length === 0 && editingProduct) {
        if (editingProduct.image) finalImages.push(editingProduct.image);
        if (editingProduct.coverImage) finalImages.push(editingProduct.coverImage);
      }
      if (finalImages.length === 0) {
        finalImages.push('/logo.png');
      }

      const payload = {
        title: productForm.title.trim(),
        category: productForm.category || 'Necklaces',
        price: parseFloat(productForm.price || 0),
        comparePrice: productForm.comparePrice ? parseFloat(productForm.comparePrice) : null,
        taxPercent: parseFloat(productForm.taxPercent || 18),
        stock: parseInt(productForm.stock, 10) >= 0 ? parseInt(productForm.stock, 10) : 10,
        sku: productForm.sku || (editingProduct?.sku ? editingProduct.sku : `EC-${Math.floor(1000 + Math.random() * 9000)}`),
        stoneType: productForm.stoneType || '',
        description: productForm.description || '',
        occasionTags: productForm.occasionTagsStr ? productForm.occasionTagsStr.split(',').map((s) => s.trim()).filter(Boolean) : [],
        images: finalImages,
        videos: productForm.videos || [],
        variants: Array.isArray(productForm.variants) ? productForm.variants : [],
        customSections: Array.isArray(productForm.customSections) ? productForm.customSections : [],
        details: editingProduct?.details || [
          "Handcrafted luxury design",
          "Includes protective gift packaging"
        ],
        care: editingProduct?.care || "Avoid direct contact with moisture, perfumes and hairspray."
      };

      if (editingProduct) {
        await updateProduct({ ...editingProduct, ...payload });
      } else {
        await addProduct(payload);
      }

      setProductModalOpen(false);
    } catch (err) {
      console.error('Error publishing product:', err);
      showToast('Failed saving product: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Filtered Product Catalog with Category & Stock Status Controls
  const filteredProducts = (products || []).filter(p => {
    if (!p) return false;
    
    // Search query filter
    const searchLower = (productSearch || '').toLowerCase();
    const matchesSearch = !searchLower || (
      (p.title || '').toLowerCase().includes(searchLower) ||
      (p.category || '').toLowerCase().includes(searchLower) ||
      (p.sku || '').toLowerCase().includes(searchLower) ||
      (p.stoneType || '').toLowerCase().includes(searchLower)
    );

    // Category filter
    const matchesCategory = productCategoryFilter === 'All' || (p.category || '').toLowerCase() === productCategoryFilter.toLowerCase();

    // Stock filter
    let matchesStock = true;
    if (productStockFilter === 'In Stock') {
      matchesStock = Number(p.price) > 0 && Number(p.stock) > 0;
    } else if (productStockFilter === 'Low Stock') {
      matchesStock = Number(p.stock) > 0 && Number(p.stock) <= 5;
    } else if (productStockFilter === 'Out of Stock') {
      matchesStock = Number(p.price) <= 0 || Number(p.stock) <= 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Catalog Telemetry Metrics
  const totalCatalogCount = (products || []).length;
  const inStockCatalogCount = (products || []).filter(p => p && Number(p.price) > 0 && Number(p.stock) > 0).length;
  const lowOrOutStockCatalogCount = (products || []).filter(p => p && (Number(p.price) <= 0 || Number(p.stock) <= 5)).length;
  const totalInventoryValue = (products || []).reduce((sum, p) => sum + (Number(p?.price) || 0) * (Number(p?.stock) || 0), 0);

  const filteredOrders = (orders || []).filter(o => {
    if (!o) return false;
    if (orderStatusFilter === 'All') return true;
    return (o.status || '').toLowerCase() === (orderStatusFilter || '').toLowerCase();
  });

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      
      {/* Top Shopify Admin Header Bar with Enlarged Logo */}
      <header className="bg-stone-950 border-b border-stone-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden text-stone-400 hover:text-white p-1"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <img src="/logo.png" alt="Logo" className="h-12 w-auto filter drop-shadow" />
          <span className="font-serif text-lg sm:text-2xl font-bold text-white tracking-wider">Ella Admin</span>
          <span className="bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" /> Real Database Telemetry
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-3.5 py-2 rounded-xl transition-colors"
          >
            <Store className="w-4 h-4 text-brand-gold" />
            <span className="hidden sm:inline">Storefront View</span>
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
            <LayoutDashboard className="w-4 h-4" /> Real Analytics Dashboard
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
              <Sparkles className="w-4 h-4" /> Reviews Moderation
            </div>
            <span className="bg-stone-800 text-stone-300 text-[10px] px-2 py-0.5 rounded-full">{reviews.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('coupons'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'coupons' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Ticket className="w-4 h-4 text-brand-gold" /> Coupons Generator
            </div>
            <span className="bg-brand-gold text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded-full">{coupons.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('subscribers'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'subscribers' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-400" /> VIP Subscribers
            </div>
            <span className="bg-emerald-950 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-800">{subscribers?.length || 0}</span>
          </button>

          <button
            onClick={() => { setActiveTab('blogs'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'blogs' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-400 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-brand-gold" /> Blog Journal
            </div>
            <span className="bg-brand-gold text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded-full">{blogs?.length || 0}</span>
          </button>
        </aside>

        {/* Dashboard Content Region */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-64px)]">
          
          {/* TAB 1: REAL OVERVIEW ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Header */}
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Live Store Telemetry & Real Sales</h1>
                <p className="text-xs text-stone-400">Authentic order totals and real revenue calculated directly from the database.</p>
              </div>

              {/* Real KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 text-xs font-medium">
                    <span>Total Real Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">{formatPrice(totalRevenue)}</div>
                  <div className="text-[11px] text-stone-500">Live order earnings in INR</div>
                </div>

                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 text-xs font-medium">
                    <span>Total Real Orders</span>
                    <ShoppingBag className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div className="text-3xl font-bold text-white">{totalOrdersCount}</div>
                  <div className="text-[11px] text-stone-500">Completed checkout orders</div>
                </div>

                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 text-xs font-medium">
                    <span>Average Order Value</span>
                    <BarChart3 className="w-4 h-4 text-brand-rose" />
                  </div>
                  <div className="text-3xl font-bold text-white">{formatPrice(avgOrderValue)}</div>
                  <div className="text-[11px] text-stone-500">Calculated basket average</div>
                </div>
              </div>

              {/* Real Sales Chart Section */}
              <div className="bg-stone-950 p-4 sm:p-6 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-white">Authentic Weekly Revenue (₹)</h3>
                  <span className="text-xs text-stone-400">Live database revenue</span>
                </div>
                <div className="w-full pt-2">
                  <SalesAreaChart data={REAL_SALES_GRAPH_DATA} />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG (HIGH-END FARFETCH / SHOPIFY PLUS MANAGEMENT SUITE) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded-full border border-brand-gold/30">
                      Live Catalog Management
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Package className="w-6 h-6 text-brand-rose" /> Jewelry Product Catalog
                  </h1>
                  <p className="text-xs text-stone-400">Manage authentic inventory, upload high-res showcase photos & product videos, and set key-value custom specifications.</p>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-soft-rose transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" /> Add New Jewelry Product
                </button>
              </div>

              {/* KPI Summary Cards Grid for Catalog */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1">
                  <div className="text-stone-400 text-[11px] font-medium flex items-center justify-between">
                    <span>Total Products</span>
                    <Package className="w-3.5 h-3.5 text-stone-500" />
                  </div>
                  <div className="text-2xl font-bold text-white font-serif">{totalCatalogCount}</div>
                  <div className="text-[10px] text-stone-500">Live products in DB</div>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1">
                  <div className="text-stone-400 text-[11px] font-medium flex items-center justify-between">
                    <span>Active In-Stock</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 font-serif">{inStockCatalogCount}</div>
                  <div className="text-[10px] text-stone-500">Ready for order</div>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1">
                  <div className="text-stone-400 text-[11px] font-medium flex items-center justify-between">
                    <span>Low / Out Stock</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-amber-400 font-serif">{lowOrOutStockCatalogCount}</div>
                  <div className="text-[10px] text-stone-500">Needs restock or unpriced</div>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1">
                  <div className="text-stone-400 text-[11px] font-medium flex items-center justify-between">
                    <span>Inventory Value</span>
                    <DollarSign className="w-3.5 h-3.5 text-brand-gold" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-brand-gold font-serif">{formatPrice(totalInventoryValue)}</div>
                  <div className="text-[10px] text-stone-500">Total catalog worth</div>
                </div>
              </div>

              {/* Filter Toolbar & Search Control */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search title, SKU, stone type, category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full text-xs bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-8 py-2.5 text-white placeholder:text-stone-500 outline-none focus:border-brand-rose transition-colors"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch('')}
                        className="absolute right-3 top-3 text-stone-500 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Stock Filter & View Switcher */}
                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* Stock Status Selector */}
                    <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-xl text-xs">
                      {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setProductStockFilter(st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            productStockFilter === st
                              ? 'bg-stone-800 text-white shadow'
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Grid vs Table Layout Toggle */}
                    <div className="flex items-center bg-stone-900 border border-stone-800 p-1 rounded-xl">
                      <button
                        onClick={() => setCatalogViewMode('grid')}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          catalogViewMode === 'grid' ? 'bg-brand-rose text-white shadow' : 'text-stone-400 hover:text-white'
                        }`}
                        title="Showcase Cards Grid View"
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCatalogViewMode('table')}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          catalogViewMode === 'table' ? 'bg-brand-rose text-white shadow' : 'text-stone-400 hover:text-white'
                        }`}
                        title="Data Table View"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>

                {/* Category Pills Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs no-scrollbar">
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pr-1 flex items-center gap-1 flex-shrink-0">
                    <Filter className="w-3 h-3 text-stone-400" /> Category:
                  </span>
                  {['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Bangles', 'Bridal Sets', 'Pendants'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                        productCategoryFilter === cat
                          ? 'bg-brand-gold text-stone-950 font-bold'
                          : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>

              {/* Result Summary Bar */}
              <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                <span>
                  Showing <strong className="text-white font-semibold">{filteredProducts.length}</strong> of <strong className="text-stone-300">{products.length}</strong> catalog items
                </span>
                {(productSearch || productCategoryFilter !== 'All' || productStockFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setProductSearch('');
                      setProductCategoryFilter('All');
                      setProductStockFilter('All');
                    }}
                    className="text-brand-rose hover:underline text-[11px] font-semibold"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Catalog Rendering: Empty State vs Grid View vs Table View */}
              {filteredProducts.length === 0 ? (
                <div className="bg-stone-950 p-12 text-center rounded-2xl border border-stone-800 space-y-4">
                  <Package className="w-12 h-12 text-stone-600 mx-auto animate-bounce" />
                  <h3 className="font-serif text-lg font-bold text-white">No products match your current filter</h3>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Try adjusting your search criteria or category selection, or add a brand new jewelry product to your store catalog.
                  </p>
                  <button
                    onClick={handleOpenAddModal}
                    className="bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Jewelry Product
                  </button>
                </div>
              ) : catalogViewMode === 'grid' ? (
                
                /* LAYOUT 1: SHOWCASE CARDS GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((p) => {
                    const isOutOfStock = Number(p.price) <= 0 || Number(p.stock) <= 0;
                    const isLowStock = !isOutOfStock && Number(p.stock) <= 5;
                    const primaryImage = (Array.isArray(p.images) && p.images[0]) || '/logo.png';
                    const videoCount = Array.isArray(p.videos) ? p.videos.length : 0;
                    const photoCount = Array.isArray(p.images) ? p.images.length : 0;

                    return (
                      <div 
                        key={p.id || p.sku || Math.random()}
                        className="bg-stone-950 border border-stone-800 hover:border-brand-gold/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col group"
                      >
                        {/* Top Media Container */}
                        <div className="relative aspect-square bg-stone-900 overflow-hidden">
                          <img
                            src={primaryImage}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
                            <span className="bg-stone-950/80 backdrop-blur-md text-stone-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-stone-700/60">
                              {p.category || 'Jewelry'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] backdrop-blur-md border ${
                              isOutOfStock 
                                ? 'bg-rose-950/90 text-rose-300 border-rose-800' 
                                : isLowStock 
                                ? 'bg-amber-950/90 text-amber-300 border-amber-800' 
                                : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
                            }`}>
                              {isOutOfStock ? 'OUT OF STOCK' : isLowStock ? `LOW (${p.stock})` : `${p.stock} Units`}
                            </span>
                          </div>

                          {/* Bottom Asset Counters (Photos & Videos) */}
                          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-10">
                            <span className="bg-black/70 backdrop-blur-md text-stone-300 text-[9px] font-semibold px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                              🖼️ {photoCount} Photo{photoCount !== 1 ? 's' : ''}
                            </span>
                            {videoCount > 0 && (
                              <span className="bg-purple-950/90 backdrop-blur-md text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-purple-800 flex items-center gap-1 animate-pulse">
                                <Video className="w-3 h-3 text-purple-400" /> {videoCount} Video
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                              <span className="font-mono">{p.sku || 'NO-SKU'}</span>
                              <span className="text-brand-gold font-semibold truncate max-w-[120px]">
                                {p.stoneType || 'CZ Crystals'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-white text-sm line-clamp-2 leading-snug group-hover:text-brand-rose transition-colors">
                              {p.title}
                            </h3>
                          </div>

                          {/* Pricing Row */}
                          <div className="space-y-1 pt-2 border-t border-stone-800/80">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-bold text-white text-base">
                                {isOutOfStock ? (
                                  <span className="text-rose-500 text-xs font-semibold">Unpriced / Out of Stock</span>
                                ) : (
                                  formatPrice(p.price)
                                )}
                              </span>
                              {p.comparePrice && Number(p.comparePrice) > Number(p.price) && (
                                <span className="text-xs text-stone-500 line-through">
                                  {formatPrice(p.comparePrice)}
                                </span>
                              )}
                              <span className="text-[10px] text-stone-500 font-mono ml-auto">
                                {p.taxPercent || 18}% GST
                              </span>
                            </div>

                            {/* Custom Specs Indicator Pill */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              <span className="text-[9px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded-md border border-stone-800">
                                {p.metalPurity || '22K Gold Plated'}
                              </span>
                              {Array.isArray(p.customSpecs) && p.customSpecs.length > 0 && (
                                <span className="text-[9px] bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-md border border-brand-gold/30 font-semibold">
                                  {p.customSpecs.length} Custom Specs
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Footer Buttons */}
                          <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white font-semibold text-xs py-2 px-3 rounded-xl border border-stone-800 transition-colors flex items-center justify-center gap-1.5"
                              title="Edit Details, Videos & Specifications"
                            >
                              <Edit className="w-3.5 h-3.5 text-brand-gold" /> Edit
                            </button>

                            <button
                              onClick={() => navigateTo('product', p.id)}
                              className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xl border border-stone-800 transition-colors"
                              title="Preview on Storefront"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-2 bg-rose-950/80 hover:bg-rose-900 text-rose-400 hover:text-rose-200 rounded-xl border border-rose-900 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              ) : (

                /* LAYOUT 2: STRUCTURED DATA TABLE VIEW */
                <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-x-auto shadow-lg">
                  <table className="w-full text-left text-xs text-stone-300 min-w-[750px]">
                    <thead className="bg-stone-900 text-stone-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Product & Media</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Price (₹)</th>
                        <th className="p-4">Tax Rate</th>
                        <th className="p-4">Inventory Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {filteredProducts.map((p) => {
                        const isOutOfStock = Number(p.price) <= 0 || Number(p.stock) <= 0;
                        const isLowStock = !isOutOfStock && Number(p.stock) <= 5;
                        const videoCount = Array.isArray(p.videos) ? p.videos.length : 0;
                        const photoCount = Array.isArray(p.images) ? p.images.length : 0;

                        return (
                          <tr key={p.id || p.sku || Math.random()} className="hover:bg-stone-900/50 transition-colors group">
                            <td className="p-4 flex items-center gap-3">
                              <img
                                src={(Array.isArray(p.images) && p.images[0]) || '/logo.png'}
                                alt={p.title || 'Product'}
                                className="w-12 h-12 object-cover rounded-xl border border-stone-800 flex-shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-white block group-hover:text-brand-rose transition-colors">{p.title || 'Untitled Product'}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] text-brand-gold">{p.stoneType || 'CZ Crystals'}</span>
                                  <span className="text-[9px] text-stone-500">• {photoCount} Photos</span>
                                  {videoCount > 0 && (
                                    <span className="text-[9px] font-bold bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">
                                      🎬 {videoCount} Video
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-medium text-stone-300">{p.category || 'Jewelry'}</td>
                            <td className="p-4 font-mono text-stone-400 text-[11px]">{p.sku || 'N/A'}</td>
                            <td className="p-4 font-bold text-white">
                              {isOutOfStock ? (
                                <span className="text-rose-500 text-xs">Unpriced</span>
                              ) : (
                                formatPrice(p.price)
                              )}
                            </td>
                            <td className="p-4 text-stone-400">{p.taxPercent || 18}% GST</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-block ${
                                isOutOfStock
                                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                  : isLowStock
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              }`}>
                                {isOutOfStock ? 'OUT OF STOCK' : isLowStock ? `LOW (${p.stock})` : `${p.stock} units`}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg border border-stone-800 transition-colors"
                                title="Edit Product, Videos & Custom Specs"
                              >
                                <Edit className="w-4 h-4 text-brand-gold" />
                              </button>
                              <button
                                onClick={() => navigateTo('product', p.id)}
                                className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg border border-stone-800 transition-colors"
                                title="Preview on Storefront"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-2 bg-rose-950 hover:bg-rose-900 text-rose-300 hover:text-white rounded-lg border border-rose-900 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              )}

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

              {/* Orders Table */}
              {filteredOrders.length === 0 ? (
                <div className="bg-stone-950 p-12 text-center rounded-2xl border border-stone-800 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-white">No customer orders placed yet</h3>
                  <p className="text-xs text-stone-400">When customers place orders on your website, they will appear live right here!</p>
                </div>
              ) : (
                <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-x-auto shadow-lg">
                  <table className="w-full text-left text-xs text-stone-300 min-w-[850px]">
                    <thead className="bg-stone-900 text-stone-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total (₹)</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Shiprocket Logistics</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {filteredOrders.map((o) => {
                        const itemCount = Array.isArray(o.items)
                          ? o.items.length
                          : (typeof o.items === 'string' ? (() => { try { const p = JSON.parse(o.items); return Array.isArray(p) ? p.length : 0; } catch(e) { return 0; } })() : 0);
                        return (
                        <tr key={o.id} className="hover:bg-stone-900/50 transition-colors">
                          <td className="p-4 font-bold text-white font-mono">#{o.id}</td>
                          <td className="p-4">
                            <span className="font-semibold text-white block">{o.customer?.name || 'Customer'}</span>
                            <span className="text-[10px] text-stone-400 block">{o.customer?.email || 'No email'}</span>
                            <span className="text-[10px] text-stone-500 font-mono">PIN: {o.shipping_pincode || o.customer?.zip || 'N/A'}</span>
                          </td>
                          <td className="p-4">{itemCount} item(s)</td>
                          <td className="p-4 font-bold text-emerald-400">{formatPrice(o.total)}</td>
                          <td className="p-4">
                            <span className="text-stone-300 font-semibold block">{o.payment_method || o.paymentMethod || 'Prepaid'}</span>
                            {o.payment_id && <span className="text-[9px] text-stone-500 font-mono block">ID: {o.payment_id}</span>}
                          </td>
                          <td className="p-4">
                            {o.awb_code ? (
                              <div className="space-y-0.5 text-[11px]">
                                <span className="text-brand-gold font-bold block">{o.shipping_courier || 'Shiprocket Express'}</span>
                                <span className="text-stone-400 font-mono block">AWB: {o.awb_code}</span>
                                {o.tracking_url && (
                                  <a href={o.tracking_url} target="_blank" rel="noreferrer" className="text-brand-rose underline text-[10px]">Track Shipment</a>
                                )}
                              </div>
                            ) : (
                              <span className="text-stone-500 text-[11px] italic">Not Dispatched</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              o.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              o.status === 'Shipped' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                              'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {o.status || 'Processing'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenDispatchModal(o)}
                              className="px-2.5 py-1 bg-brand-gold/20 hover:bg-brand-gold/30 border border-brand-gold/40 text-brand-gold font-bold text-[10px] rounded-lg transition-colors inline-flex items-center gap-1"
                              title="Dispatch via Shiprocket / AWB"
                            >
                              <Truck className="w-3 h-3" /> Shiprocket AWB
                            </button>
                            <select
                              value={o.status || 'Processing'}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                              className="bg-stone-900 text-white text-xs px-2 py-1 rounded-lg border border-stone-700 outline-none focus:border-brand-rose"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => {
                                if (confirm(`Delete order #${o.id}?`)) deleteOrder(o.id);
                              }}
                              className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors inline-flex items-center"
                              title="Delete Order Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white">Customer Reviews Moderation</h1>
                <p className="text-xs text-stone-400">Review feedback submitted by verified buyers across the store.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.author}</span>
                        {rev.verified && (
                          <span className="bg-emerald-950 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
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

          {/* TAB 5: COUPONS GENERATOR */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <Ticket className="w-6 h-6 text-brand-gold" /> Admin Coupon Code Generator
                </h1>
                <p className="text-xs text-stone-400">Create, activate, and manage discount coupons for customer checkout.</p>
              </div>

              {/* Add Coupon Form */}
              <form onSubmit={handleGenerateCoupon} className="bg-stone-950 p-5 rounded-2xl border border-brand-gold/30 space-y-4 shadow-xl">
                <h3 className="font-serif text-sm font-bold text-brand-gold uppercase tracking-wider">Generate New Discount Coupon</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FESTIVE25"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono uppercase font-bold outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Discount Percentage (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      placeholder="15"
                      value={couponForm.discountPercent}
                      onChange={(e) => setCouponForm({ ...couponForm, discountPercent: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-bold text-brand-rose outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Minimum Order Spend (₹ INR)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="2000 (0 for no limit)"
                      value={couponForm.minSpend}
                      onChange={(e) => setCouponForm({ ...couponForm, minSpend: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Short Description</label>
                    <input
                      type="text"
                      placeholder="e.g. 15% off festive celebration"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-soft-rose transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Generate & Publish Coupon
                  </button>
                </div>
              </form>

              {/* Coupons List Table */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-x-auto shadow-lg">
                <table className="w-full text-left text-xs text-stone-300 min-w-[650px]">
                  <thead className="bg-stone-900 text-stone-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Min Spend</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {coupons.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-stone-500">
                          No active coupons generated yet. Use the generator above to create store coupons!
                        </td>
                      </tr>
                    ) : (
                      coupons.map((c) => (
                        <tr key={c.code} className="hover:bg-stone-900/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-brand-gold text-sm">{c.code}</td>
                          <td className="p-4 font-bold text-white">{c.discountPercent}% OFF</td>
                          <td className="p-4 text-stone-300">{c.minSpend > 0 ? formatPrice(c.minSpend) : 'No Minimum'}</td>
                          <td className="p-4 text-stone-400">{c.description || 'Special Discount'}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              c.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-stone-800 text-stone-400'
                            }`}>
                              {c.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => toggleCouponStatus(c.code, c.active)}
                              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-semibold rounded-lg transition-colors"
                            >
                              {c.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete coupon "${c.code}"?`)) deleteCoupon(c.code);
                              }}
                              className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: VIP SPARKLE CLUB SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Mail className="w-6 h-6 text-emerald-400" /> VIP Sparkle Club Subscribers
                  </h1>
                  <p className="text-xs text-stone-400">Live newsletter subscriber list synced with Supabase database.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + ["Email,Source,Joined Date", ...(subscribers || []).map(s => `"${s.email}","${s.source}","${s.createdAt}"`)].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `ella_subscribers_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" /> Export CSV List
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search subscriber by email address..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white outline-none focus:border-brand-rose"
                />
              </div>

              {/* Subscribers Table */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-x-auto shadow-lg">
                <table className="w-full text-left text-xs text-stone-300 min-w-[650px]">
                  <thead className="bg-stone-900 text-stone-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Subscriber Email</th>
                      <th className="p-4">Opt-in Channel / Source</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {(!subscribers || subscribers.length === 0) ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-stone-500">
                          No VIP Sparkle Club subscribers recorded yet.
                        </td>
                      </tr>
                    ) : (
                      (subscribers || [])
                        .filter(s => s && (s.email || '').toLowerCase().includes((subscriberSearch || '').toLowerCase()))
                        .map((s) => (
                          <tr key={s.id || s.email} className="hover:bg-stone-900/50 transition-colors">
                            <td className="p-4 font-mono font-bold text-white">{s.email}</td>
                            <td className="p-4">
                              <span className="bg-stone-900 text-brand-gold text-[10px] font-semibold px-2.5 py-1 rounded-full border border-stone-800">
                                {s.source || 'VIP Sparkle Club'}
                              </span>
                            </td>
                            <td className="p-4 text-stone-400">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(`Remove subscriber "${s.email}"?`)) deleteSubscriber(s.email);
                                }}
                                className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors"
                                title="Remove Subscriber"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: BLOG JOURNAL MANAGEMENT */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-brand-gold" /> Blog Journal & Styling Articles
                  </h1>
                  <p className="text-xs text-stone-400">Write, format, and publish personalized blogs with photos and media for your website visitors.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingBlog(null);
                    setBlogForm({
                      title: '',
                      category: 'Bridal Trends',
                      excerpt: '',
                      content: '',
                      coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
                      author: 'Ella Editorial Concierge',
                      readTime: '4 min read',
                      status: 'Published'
                    });
                    setBlogModalOpen(true);
                  }}
                  className="bg-brand-rose hover:bg-brand-rose/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft-rose transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Write New Article
                </button>
              </div>

              {/* Blogs Directory Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(blogs || []).map((blog) => (
                  <div key={blog.id} className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden space-y-4 flex flex-col justify-between p-5 hover:border-brand-gold/40 transition-all">
                    <div className="space-y-3">
                      {blog.coverImage && (
                        <div className="aspect-video rounded-xl overflow-hidden bg-stone-900">
                          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-[10px] text-stone-400">
                        <span className="bg-brand-gold/20 text-brand-gold font-bold px-2 py-0.5 rounded-md border border-brand-gold/30 uppercase">
                          {blog.category}
                        </span>
                        <span className="font-mono text-emerald-400 font-semibold">{blog.status}</span>
                      </div>

                      <h3 className="font-serif text-base font-bold text-white leading-snug line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-xs text-stone-400 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-500">{blog.readTime || '4 min read'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigateTo('blog-detail', blog.id);
                          }}
                          className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg transition-colors"
                          title="Preview Article on Website"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingBlog(blog);
                            setBlogForm(blog);
                            setBlogModalOpen(true);
                          }}
                          className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-lg transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete article "${blog.title}"?`)) deleteBlog(blog.id);
                          }}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ADMIN BLOG ARTICLE EDITOR MODAL */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-stone-800 pb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-gold" />
                {editingBlog ? 'Edit Journal Article' : 'Write & Publish New Blog Article'}
              </h3>
              <button onClick={() => setBlogModalOpen(false)} className="text-stone-400 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingBlog) {
                  updateBlog({ ...editingBlog, ...blogForm });
                } else {
                  addBlog(blogForm);
                }
                setBlogModalOpen(false);
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Ultimate Guide to Styling Kundan Jewelry for Indian Weddings"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-semibold outline-none focus:border-brand-rose"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  >
                    <option value="Bridal Trends">Bridal Trends</option>
                    <option value="Styling Guide">Styling Guide</option>
                    <option value="Jewelry Care">Jewelry Care</option>
                    <option value="Behind The Craft">Behind The Craft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    placeholder="4 min read"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={blogForm.coverImage}
                  onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Short Excerpt / Teaser Summary *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Brief 2-line summary describing the blog post..."
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Full Article Content (Supports formatting, line breaks, bullet points & image URLs) *
                </label>
                <textarea
                  rows="12"
                  required
                  placeholder="Write your article here... Formatted line breaks, paragraphs, ### headings, bullet points (-) will be preserved exactly as typed."
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono leading-relaxed outline-none focus:border-brand-rose"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-soft-rose transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {editingBlog ? 'Update Article' : 'Publish to Ella Journal'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* EDIT DETAIL JEWELRY SPECIFICATION MODAL (WITH VIDEOS, TAX BRACKET & CUSTOM KEYS) */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-stone-800 pb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-gold" />
                {editingProduct ? 'Edit Detailed Jewelry Specifications & Videos' : 'Add New Artificial Jewelry Product'}
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
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Selling Price (₹ INR - Set 0 for Out of Stock)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="12999 (Enter 0 for Out of Stock)"
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
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    GST Tax Bracket (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="18"
                    value={productForm.taxPercent}
                    onChange={(e) => setProductForm({ ...productForm, taxPercent: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose font-semibold text-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Inventory Units (Stock)</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Gemstone / Crystal Type <span className="text-stone-500 font-normal">(Optional - Leave blank if none)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hand-cut Polki Kundan Glass & AAA+ CZ (Optional)"
                    value={productForm.stoneType}
                    onChange={(e) => setProductForm({ ...productForm, stoneType: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                  />
                </div>
              </div>

              {/* SECTION 1: DYNAMIC PRODUCT VARIANTS BUILDER */}
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Product Variants Manager
                    </h4>
                    <p className="text-[11px] text-stone-400">Add different colors, finishes (e.g. Rose Gold, Yellow Gold, Silver), or sizes for this item.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantField}
                    className="bg-brand-rose/20 hover:bg-brand-rose/30 text-brand-rose font-bold text-xs px-3 py-1.5 rounded-xl border border-brand-rose/30 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Variant
                  </button>
                </div>

                {productForm.variants.length === 0 ? (
                  <div className="p-4 bg-stone-950 rounded-xl text-center text-xs text-stone-500 border border-stone-800">
                    No custom variants added yet. Click "Add Variant" above to define variant choices for this product.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productForm.variants.map((v, idx) => (
                      <div key={v.id || idx} className="p-3 bg-stone-950 rounded-xl border border-stone-800 grid grid-cols-1 sm:grid-cols-6 gap-2.5 items-center">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-stone-400 font-semibold mb-0.5">Variant Name / Finish</label>
                          <input
                            type="text"
                            placeholder="e.g. Rose Gold"
                            value={v.name}
                            onChange={(e) => updateVariantField(idx, 'name', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-stone-400 font-semibold mb-0.5">SKU</label>
                          <input
                            type="text"
                            placeholder="EC-VAR-1"
                            value={v.sku}
                            onChange={(e) => updateVariantField(idx, 'sku', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white font-mono outline-none focus:border-brand-rose"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-stone-400 font-semibold mb-0.5">Price (₹)</label>
                          <input
                            type="number"
                            placeholder="4999"
                            value={v.price}
                            onChange={(e) => updateVariantField(idx, 'price', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white font-bold outline-none focus:border-brand-rose"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-stone-400 font-semibold mb-0.5">Stock</label>
                          <input
                            type="number"
                            placeholder="10"
                            value={v.stock}
                            onChange={(e) => updateVariantField(idx, 'stock', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <label className="block text-[10px] text-stone-400 font-semibold mb-0.5">Swatch</label>
                            <input
                              type="color"
                              value={v.swatchColor || '#B76E79'}
                              onChange={(e) => updateVariantField(idx, 'swatchColor', e.target.value)}
                              className="w-8 h-7 rounded bg-transparent cursor-pointer border border-stone-700"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeVariantField(idx)}
                            className="p-1.5 text-rose-400 hover:text-rose-200"
                            title="Remove Variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 2: DYNAMIC CUSTOM PRODUCT SECTIONS BUILDER */}
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                      <ListPlus className="w-3.5 h-3.5" /> Custom Product Sections & Specifications
                    </h4>
                    <p className="text-[11px] text-stone-400">Create custom section titles and spec items specifically for this product.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addCustomSection}
                    className="bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold font-bold text-xs px-3 py-1.5 rounded-xl border border-brand-gold/30 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Section
                  </button>
                </div>

                {productForm.customSections.length === 0 ? (
                  <div className="p-4 bg-stone-950 rounded-xl text-center text-xs text-stone-500 border border-stone-800">
                    No custom sections added. Click "Add Section" above to add product details cards.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {productForm.customSections.map((sec, secIdx) => (
                      <div key={secIdx} className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            placeholder="Section Title (e.g. Materials & Craftsmanship)"
                            value={sec.title}
                            onChange={(e) => updateCustomSectionTitle(secIdx, e.target.value)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-brand-gold outline-none focus:border-brand-rose flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomSection(secIdx)}
                            className="p-1 text-rose-400 hover:text-rose-200 text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove Section
                          </button>
                        </div>

                        <div className="space-y-2 pl-2 border-l-2 border-brand-gold/30">
                          {sec.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Label (e.g. Base Metal)"
                                value={item.label}
                                onChange={(e) => updateCustomSectionItem(secIdx, itemIdx, 'label', e.target.value)}
                                className="w-1/3 text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 outline-none focus:border-brand-rose"
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g. 22K Gold Plated Brass)"
                                value={item.value}
                                onChange={(e) => updateCustomSectionItem(secIdx, itemIdx, 'value', e.target.value)}
                                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                              />
                              <button
                                type="button"
                                onClick={() => removeCustomSectionItem(secIdx, itemIdx)}
                                className="p-1 text-stone-500 hover:text-rose-400"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => addCustomSectionItem(secIdx)}
                            className="text-[11px] text-brand-gold font-semibold hover:underline flex items-center gap-1 pt-1"
                          >
                            <PlusCircle className="w-3 h-3" /> Add Item to {sec.title || 'Section'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Product Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the jewelry design, metal finish, plating, and fit..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                ></textarea>
              </div>

              {/* MEDIA UPLOAD SECTION: PHOTOS & PRODUCT VIDEOS */}
              <div className="space-y-4 pt-2 border-t border-stone-800">
                
                {/* Photo Uploader with Drag and Drop & Showcase Reordering */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-300">
                    Product Showcase Photos (Uploaded to Supabase Storage)
                  </label>
                  
                  <div
                    onDragOver={handleDragOverFiles}
                    onDragLeave={handleDragLeaveFiles}
                    onDrop={handleDropFiles}
                    className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                      isDraggingFiles 
                        ? 'border-brand-gold bg-brand-gold/15 scale-[1.01]' 
                        : 'border-brand-rose/60 bg-stone-900 hover:bg-stone-800/80'
                    }`}
                  >
                    <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                      <Upload className={`w-7 h-7 ${isDraggingFiles ? 'text-brand-gold animate-bounce' : 'text-brand-rose'}`} />
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-white">
                          {isDraggingFiles ? 'Release to drop photos into showcase!' : 'Drag & Drop product photos directly here'}
                        </p>
                        <p className="text-[11px] text-stone-400">or click to browse files from device folder (JPG, PNG, WebP)</p>
                      </div>
                      <input type="file" accept="image/*" multiple onChange={handleLocalImageUpload} className="hidden" />
                    </label>
                  </div>

                  {productForm.images.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                        <span>Showcase Image Order ({productForm.images.length})</span>
                        <span className="text-brand-gold text-[10px] font-bold">✨ Drag cards to reorder showcase</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {productForm.images.map((img, idx) => (
                          <div
                            key={idx}
                            draggable
                            onDragStart={(e) => handleImageDragStart(e, idx)}
                            onDragOver={(e) => handleImageDragOver(e, idx)}
                            onDrop={(e) => handleImageDrop(e, idx)}
                            onDragEnd={() => { setDraggedImageIdx(null); setDragOverImageIdx(null); }}
                            className={`relative group bg-stone-900 border rounded-xl overflow-hidden transition-all duration-200 ${
                              idx === 0 ? 'border-brand-gold ring-2 ring-brand-gold/40' : 'border-stone-800'
                            } ${
                              draggedImageIdx === idx ? 'opacity-40 scale-95' : ''
                            } ${
                              dragOverImageIdx === idx ? 'border-brand-rose ring-2 ring-brand-rose/60 scale-105' : ''
                            }`}
                          >
                            {/* Badge indicator */}
                            <div className="absolute top-1.5 left-1.5 z-10">
                              {idx === 0 ? (
                                <span className="bg-brand-gold text-stone-950 font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                  <Star className="w-2.5 h-2.5 fill-stone-950" /> COVER #1
                                </span>
                              ) : (
                                <span className="bg-stone-950/80 text-stone-300 font-bold text-[9px] px-1.5 py-0.5 rounded-full border border-stone-700">
                                  #{idx + 1}
                                </span>
                              )}
                            </div>

                            {/* Drag Handle Icon */}
                            <div className="absolute top-1.5 right-1.5 z-10 cursor-grab active:cursor-grabbing bg-stone-950/80 text-stone-300 p-1 rounded-full hover:bg-stone-800 border border-stone-700" title="Drag to reorder">
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>

                            {/* Image Thumbnail */}
                            <div className="aspect-square w-full bg-stone-950 overflow-hidden">
                              <img src={img} alt={`Showcase ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>

                            {/* Action Control Buttons */}
                            <div className="p-1.5 bg-stone-950/90 border-t border-stone-800 flex items-center justify-between gap-1">
                              {/* Move Left */}
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveProductImage(idx, idx - 1)}
                                title="Move Left"
                                className="p-1 text-stone-400 hover:text-white disabled:opacity-30 disabled:hover:text-stone-400 rounded transition-colors"
                              >
                                <MoveLeft className="w-3.5 h-3.5" />
                              </button>

                              {/* Set as Cover */}
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => setImageAsCover(idx)}
                                  title="Set as Main Cover Image"
                                  className="p-1 text-brand-gold hover:text-amber-300 rounded transition-colors flex items-center gap-0.5 text-[10px] font-bold"
                                >
                                  <Star className="w-3 h-3" />
                                </button>
                              )}

                              {/* Move Right */}
                              <button
                                type="button"
                                disabled={idx === productForm.images.length - 1}
                                onClick={() => moveProductImage(idx, idx + 1)}
                                title="Move Right"
                                className="p-1 text-stone-400 hover:text-white disabled:opacity-30 disabled:hover:text-stone-400 rounded transition-colors"
                              >
                                <MoveRight className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => removeProductImage(idx)}
                                title="Remove Image"
                                className="p-1 text-rose-400 hover:text-rose-200 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Video Uploader */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-300">
                    Product Showcase Videos (MP4 / WebM Upload)
                  </label>
                  
                  <label className="flex items-center justify-center gap-3 border-2 border-dashed border-purple-500/60 bg-stone-900 p-4 rounded-xl cursor-pointer hover:bg-stone-800/80 transition-colors">
                    <Video className="w-5 h-5 text-purple-400" />
                    <span className="text-xs text-stone-300">
                      Upload video files from local device
                    </span>
                    <input type="file" accept="video/*" multiple onChange={handleLocalVideoUpload} className="hidden" />
                  </label>

                  {productForm.videos.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pt-2">
                      {productForm.videos.map((vid, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-purple-500/50 bg-stone-900 flex-shrink-0 group">
                          <video src={vid} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeProductVideo(idx)}
                            className="absolute top-1 right-1 bg-rose-600 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-stone-400 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={handleSaveProduct}
                  className="bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-soft-rose transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isPublishing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Publishing & Uploading to Supabase...
                    </>
                  ) : (
                    editingProduct ? 'Save & Sync to Database' : 'Publish Product to Catalog'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* SHIPROCKET LOGISTICS DISPATCH & AWB GENERATOR MODAL */}
      {dispatchOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-100 relative">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-gold" /> Shiprocket Order Dispatch #{dispatchOrder.id}
              </h3>
              <button onClick={() => setDispatchOrder(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">Select Courier Partner</label>
                <select
                  value={dispatchForm.courierName}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, courierName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                >
                  <option value="Shiprocket Air Express (Bluedart)">Shiprocket Air Express (Bluedart)</option>
                  <option value="Shiprocket Standard Surface (Delhivery)">Shiprocket Standard Surface (Delhivery)</option>
                  <option value="Shiprocket Express (DTDC)">Shiprocket Express (DTDC)</option>
                  <option value="Shiprocket Priority (Xpressbees)">Shiprocket Priority (Xpressbees)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">Generated Air Waybill Number (AWB Code)</label>
                <input
                  type="text"
                  required
                  placeholder="AWB-198273645"
                  value={dispatchForm.awbCode}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, awbCode: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-mono font-bold outline-none focus:border-brand-rose"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">Live Shipment Tracking Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://shiprocket.co/tracking/123456"
                  value={dispatchForm.trackingUrl}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, trackingUrl: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white outline-none focus:border-brand-rose"
                />
              </div>

              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
                <span className="font-semibold text-stone-300 block">Customer Shipping Address:</span>
                <p>{dispatchOrder.customer?.name} ({dispatchOrder.customer?.phone})</p>
                <p>{dispatchOrder.customer?.address}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchOrder(null)}
                  className="px-3 py-2 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold px-5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4" /> Confirm & Mark Shipped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
