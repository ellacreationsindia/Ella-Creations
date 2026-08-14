import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase, uploadProductPhotoToSupabase, uploadProductVideoToSupabase, syncOrderToShiprocket } from '../lib/supabase';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS, ACTIVE_COUPONS, INITIAL_BLOGS } from '../data/initialData';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const formatPrice = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

const ADMIN_EMAIL = 'ellacreationsindia@gmail.com';

export const StoreProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState(false);
  const [demoAdminOverride, setDemoAdminOverride] = useState(false);

  // Products, Orders, Reviews, Coupons
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ella_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing saved products:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ella_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed parsing saved cart:', e);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('ella_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed parsing saved wishlist:', e);
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ella_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing saved orders:', e);
      }
    }
    return INITIAL_ORDERS;
  });
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('ella_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed parsing saved coupons:', e);
      return [];
    }
  });
  const [subscribers, setSubscribers] = useState(() => {
    const saved = localStorage.getItem('ella_subscribers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing saved subscribers:', e);
      }
    }
    return [
      { id: 'sub-1', email: 'ananya.sharma@example.com', source: 'VIP Sparkle Club Footer', createdAt: new Date().toISOString() },
      { id: 'sub-2', email: 'priya.kapoor@example.com', source: 'Hero Drop Banner', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ];
  });

  const [blogs, setBlogs] = useState(() => {
    try {
      const saved = localStorage.getItem('ella_blogs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed parsing saved blogs:', e);
    }
    return INITIAL_BLOGS;
  });
  const [selectedBlogId, setSelectedBlogId] = useState('');

  // UI state
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const navigateTo = (view, itemId = null, category = null) => {
    setCurrentView(view);
    if (view === 'blog-detail' && itemId) {
      setSelectedBlogId(itemId);
    } else if (itemId) {
      setSelectedProductId(itemId);
    }
    if (category) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Automatic OAuth Catch & Forwarding
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const hasAuthHash = window.location.hash.includes('access_token') || window.location.search.includes('code=');
      
      // If landed on localhost with OAuth token while coming from Vercel
      if (isLocalhost && hasAuthHash && document.referrer.includes('vercel.app')) {
        window.location.href = 'https://ella-creations.vercel.app/' + window.location.hash + window.location.search;
      }
    }
  }, []);

  // 2. Supabase Auth Listener with Role-Based Redirection Logic
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // Role-Based Post-Login Auto Redirect (only once on explicit user login action, not on tab switches)
      if (event === 'SIGNED_IN' && currentUser && !sessionStorage.getItem('ella_auth_handled')) {
        sessionStorage.setItem('ella_auth_handled', 'true');
        setIsAuthModalOpen(false);
        const userEmail = currentUser.email;

        if (userEmail === ADMIN_EMAIL) {
          showToast('👑 Welcome Admin! Opening Admin Panel...', 'success');
          setCurrentView('admin');
        } else {
          showToast(`Welcome back, ${currentUser.user_metadata?.full_name || currentUser.email}!`, 'success');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync blogs to localStorage
  useEffect(() => {
    localStorage.setItem('ella_blogs', JSON.stringify(blogs));
  }, [blogs]);

  // 3. Fetch data from Supabase DB on mount
  useEffect(() => {
    fetchProductsFromSupabase();
    fetchOrdersFromSupabase();
    fetchReviewsFromSupabase();
    fetchCouponsFromSupabase();
    fetchBlogsFromSupabase();
  }, []);

  const fetchProductsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.warn('Supabase DB products fetch notice:', error.message);
        return;
      }
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p) => ({
          id: p.id,
          title: p.title || 'Untitled Product',
          category: p.category || 'Jewelry',
          price: Number(p.price || 0),
          comparePrice: p.compare_price ? Number(p.compare_price) : null,
          taxPercent: Number(p.tax_percent ?? 0),
          rating: Number(p.rating || 5.0),
          reviewsCount: p.reviews_count || 0,
          stock: p.price <= 0 ? 0 : Number(p.stock ?? 0),
          sku: p.sku || `EC-${p.id}`,
          isFeatured: Boolean(p.is_featured),
          isNew: Boolean(p.is_new),
          variants: Array.isArray(p.variants) && p.variants.length > 0
            ? p.variants
            : (Array.isArray(p.finish_options)
                ? p.finish_options.map((opt, i) => (typeof opt === 'object' && opt !== null ? opt : { id: `v-${i}`, name: opt, price: p.price, stock: p.stock, sku: `${p.sku}-${i}` }))
                : []),
          stoneType: p.stone_type || '',
          images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? [p.images] : []),
          videos: Array.isArray(p.videos) ? p.videos : [],
          description: p.description || '',
          details: Array.isArray(p.details) ? p.details : [],
          care: p.care || '',
          weightGrams: p.weight_grams || '',
          dimensions: p.dimensions || '',
          metalPurity: p.metal_purity || '',
          gemstoneClarity: p.gemstone_clarity || '',
          platingThickness: p.plating_thickness || '',
          occasionTags: Array.isArray(p.occasion_tags) ? p.occasion_tags : [],
          warrantyInfo: p.warranty_info || '',
          customSections: Array.isArray(p.custom_sections) && p.custom_sections.length > 0
            ? p.custom_sections
            : (Array.isArray(p.custom_specs) ? p.custom_specs : [])
        }));
        setProducts(mapped);
        if (mapped.length > 0 && !selectedProductId) {
          setSelectedProductId(mapped[0].id);
        }
      }
    } catch (err) {
      console.warn('Supabase DB products fetch notice:', err.message);
    }
  };

  const fetchOrdersFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && Array.isArray(data)) {
        const mappedOrders = data.map(o => {
          let customerObj = o.customer;
          if (typeof customerObj === 'string') {
            try { customerObj = JSON.parse(customerObj); } catch(e) { customerObj = { name: o.customer }; }
          }
          let itemsArr = o.items;
          if (typeof itemsArr === 'string') {
            try { const p = JSON.parse(itemsArr); itemsArr = Array.isArray(p) ? p : []; } catch(e) { itemsArr = []; }
          }
          return {
            ...o,
            id: o.id,
            total: Number(o.total || 0),
            status: o.status || 'Processing',
            customer: customerObj || {},
            items: Array.isArray(itemsArr) ? itemsArr : [],
            payment_method: o.payment_method || o.paymentMethod || 'Prepaid',
            created_at: o.created_at || o.date || new Date().toISOString()
          };
        });
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.warn('Supabase DB orders fetch notice:', err.message);
    }
  };

  const fetchReviewsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && Array.isArray(data)) {
        const mapped = data.map((r) => ({
          id: r.id,
          productId: r.product_id,
          author: r.author || 'Customer',
          rating: Number(r.rating || 5),
          title: r.title || '',
          comment: r.comment || '',
          photo: r.photo || null,
          date: r.date || r.created_at || new Date().toISOString(),
          verified: r.verified !== false
        }));
        setReviews(mapped);
      }
    } catch (err) {
      console.warn('Supabase DB reviews fetch notice:', err.message);
    }
  };

  const fetchCouponsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase DB coupons fetch notice:', error.message);
        return;
      }
      if (data && Array.isArray(data)) {
        const mapped = data.map(c => ({
          code: c.code || '',
          discountPercent: Number(c.discount_percent || 0),
          minSpend: Number(c.min_spend || 0),
          description: c.description || '',
          active: c.active !== false
        })).filter(c => Boolean(c.code));
        setCoupons(mapped);
      }
    } catch (err) {
      console.warn('Supabase DB coupons fetch notice:', err.message);
    }
  };

  const fetchSubscribersFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      if (error) return;
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(s => ({
          id: s.id,
          email: s.email || '',
          source: s.source || 'VIP Sparkle Club',
          createdAt: s.created_at || new Date().toISOString()
        })).filter(s => Boolean(s.email));
        setSubscribers(mapped);
      }
    } catch (err) {
      console.warn('Supabase DB subscribers fetch notice:', err.message);
    }
  };

  const fetchBlogsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase DB blogs fetch notice:', error.message);
        return;
      }
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((b) => ({
          id: b.id,
          title: b.title || 'Untitled Article',
          slug: b.slug || '',
          excerpt: b.excerpt || '',
          content: b.content || '',
          category: b.category || 'Styling Guide',
          author: b.author || 'Ella Editorial',
          readTime: b.read_time || b.readTime || '4 min read',
          coverImage: b.cover_image || b.coverImage || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
          publishedAt: b.published_at || b.created_at || new Date().toISOString(),
          status: b.status || 'Published'
        }));
        setBlogs(mapped);
      }
    } catch (err) {
      console.warn('Supabase DB blogs fetch notice:', err.message);
    }
  };

  const addBlog = async (blogData) => {
    const newBlog = {
      id: `blog-${Math.floor(1000 + Math.random() * 9000)}`,
      publishedAt: new Date().toISOString(),
      status: 'Published',
      readTime: '4 min read',
      author: 'Ella Editorial Concierge',
      ...blogData
    };
    setBlogs((prev) => [newBlog, ...prev]);

    try {
      await supabase.from('blogs').insert([{
        id: newBlog.id,
        title: newBlog.title,
        slug: newBlog.slug || newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: newBlog.excerpt,
        content: newBlog.content,
        category: newBlog.category,
        author: newBlog.author,
        read_time: newBlog.readTime,
        cover_image: newBlog.coverImage,
        status: newBlog.status
      }]);
    } catch (err) {
      console.warn('Supabase DB blog insert notice:', err.message);
    }

    showToast('✨ Article published to Ella Journal!', 'success');
    return newBlog;
  };

  const updateBlog = async (updatedBlog) => {
    setBlogs((prev) => prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));

    try {
      await supabase.from('blogs').upsert([{
        id: updatedBlog.id,
        title: updatedBlog.title,
        slug: updatedBlog.slug,
        excerpt: updatedBlog.excerpt,
        content: updatedBlog.content,
        category: updatedBlog.category,
        author: updatedBlog.author,
        read_time: updatedBlog.readTime,
        cover_image: updatedBlog.coverImage,
        status: updatedBlog.status
      }]);
    } catch (err) {
      console.warn('Supabase DB blog update notice:', err.message);
    }

    showToast('Blog article updated successfully!');
  };

  const deleteBlog = async (blogId) => {
    setBlogs((prev) => prev.filter((b) => b.id !== blogId));

    try {
      await supabase.from('blogs').delete().eq('id', blogId);
    } catch (err) {
      console.warn('Supabase DB blog delete notice:', err.message);
    }

    showToast('Blog article removed from journal', 'info');
  };

  // Sync products, cart, wishlist, coupons, orders, subscribers to localStorage
  useEffect(() => {
    localStorage.setItem('ella_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ella_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ella_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ella_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('ella_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ella_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  // Check Admin Privilege: Restricted exclusively to ellacreationsindia@gmail.com
  const isAdmin = (user && user.email === ADMIN_EMAIL) || demoAdminOverride;

  // Supabase Auth Actions
  const signInWithGoogle = async () => {
    try {
      // Pass target origin dynamically
      const redirectUrl = window.location.origin;

      const res = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (res.error) {
        showToast('Google Auth error: ' + res.error.message, 'error');
      }
      return res;
    } catch (err) {
      showToast('Google Auth error: ' + err.message, 'error');
      return { error: err };
    }
  };

  const signInWithEmail = async (email, password) => {
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (!res.error) {
      if (email === ADMIN_EMAIL) {
        showToast('👑 Welcome Admin! Opening Admin Panel...', 'success');
        setCurrentView('admin');
      } else {
        showToast('Welcome back to Ella Creations!');
        setCurrentView('shop');
      }
    } else {
      showToast(res.error.message, 'error');
    }
    return res;
  };

  const signUpWithEmail = async (email, password, fullName) => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (!res.error) {
      showToast('Account created successfully!');
      setCurrentView('shop');
    } else {
      showToast(res.error.message, 'error');
    }
    return res;
  };

  const signOutUser = async () => {
    sessionStorage.removeItem('ella_auth_handled');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setDemoAdminOverride(false);
    setCurrentView('home');
    showToast('Signed out of Ella Creations', 'info');
  };

  // Cart operations (Variant Aware)
  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    // Determine target variant or fallback to product baseline
    const variantObj = typeof selectedVariant === 'object' && selectedVariant !== null
      ? selectedVariant
      : (product.variants && product.variants.length > 0
          ? product.variants.find(v => v.name === selectedVariant) || product.variants[0]
          : { id: 'default', name: selectedVariant || 'Standard', price: product.price, stock: product.stock, sku: product.sku });

    const itemPrice = Number(variantObj?.price ?? product.price);
    const itemStock = Number(variantObj?.stock ?? product.stock);
    const variantName = variantObj?.name || 'Standard';

    if (itemPrice <= 0 || itemStock <= 0) {
      showToast(`"${product.title}" (${variantName}) is currently out of stock`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && (item.variantId === variantObj?.id || item.finish === variantName)
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].qty += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            title: product.title,
            price: itemPrice,
            taxPercent: product.taxPercent || 18,
            image: variantObj?.image || product.images[0],
            finish: variantName,
            variantId: variantObj?.id || 'default',
            variantSku: variantObj?.sku || product.sku,
            qty: quantity,
            stock: itemStock
          }
        ];
      }
    });

    showToast(`Added "${product.title}" (${variantName}) to your cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (index, newQty) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].qty = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  // Dynamic Admin Coupon Management & Application
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);
    if (!coupon) {
      showToast('Invalid coupon code. Please check and try again.', 'error');
      return false;
    }
    if (!coupon.active) {
      showToast('This coupon code is currently inactive or expired.', 'error');
      return false;
    }
    const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (coupon.minSpend && cartSubtotal < coupon.minSpend) {
      showToast(`Coupon requires a minimum spend of ${formatPrice(coupon.minSpend)}`, 'error');
      return false;
    }
    setActiveCoupon(coupon);
    showToast(`Coupon "${coupon.code}" applied! Saved ${coupon.discountPercent}%`);
    return true;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = async (newCouponData) => {
    const formatted = {
      code: newCouponData.code.trim().toUpperCase(),
      discount_percent: Number(newCouponData.discountPercent),
      min_spend: Number(newCouponData.minSpend || 0),
      description: newCouponData.description || `${newCouponData.discountPercent}% Discount Coupon`,
      active: newCouponData.active !== false
    };

    try {
      const { error } = await supabase.from('coupons').insert([formatted]);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase coupon insert notice:', err.message);
    }

    const stateCoupon = {
      code: formatted.code,
      discountPercent: formatted.discount_percent,
      minSpend: formatted.min_spend,
      description: formatted.description,
      active: formatted.active
    };

    setCoupons(prev => [stateCoupon, ...prev.filter(c => c.code !== stateCoupon.code)]);
    showToast(`Coupon "${stateCoupon.code}" created successfully!`);
  };

  const deleteCoupon = async (code) => {
    try {
      await supabase.from('coupons').delete().eq('code', code);
    } catch (err) {
      console.warn('Supabase coupon delete notice:', err.message);
    }
    setCoupons(prev => prev.filter(c => c.code !== code));
    if (activeCoupon?.code === code) {
      setActiveCoupon(null);
    }
    showToast(`Coupon "${code}" deleted`, 'info');
  };

  const toggleCouponStatus = async (code, currentActive) => {
    const updatedActive = !currentActive;
    try {
      await supabase.from('coupons').update({ active: updatedActive }).eq('code', code);
    } catch (err) {
      console.warn('Supabase coupon update notice:', err.message);
    }
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: updatedActive } : c));
    showToast(`Coupon "${code}" is now ${updatedActive ? 'Active' : 'Inactive'}`);
  };

  // Submit Order (With Razorpay Payment ID & Shiprocket Logistics details)
  const submitOrder = async (customerDetails, paymentMethod, paymentId = null, logisticsDetails = {}) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const taxAmount = 0;
    const discountAmount = activeCoupon ? (subtotal * activeCoupon.discountPercent) / 100 : 0;
    const shipping = logisticsDetails.shippingCost !== undefined ? logisticsDetails.shippingCost : 99;
    const total = subtotal - discountAmount + shipping;

    const newOrder = {
      id: `EC-${Math.floor(10000 + Math.random() * 90000)}`,
      user_id: user?.id || null,
      customer: customerDetails,
      items: [...cart],
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax_amount: parseFloat(taxAmount.toFixed(2)),
      discount: parseFloat(discountAmount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'Processing',
      payment_method: paymentMethod,
      payment_id: paymentId || `PAY-${Date.now()}`,
      shipping_pincode: logisticsDetails.pincode || customerDetails.zip || '',
      shipping_courier: logisticsDetails.courierName || 'Shiprocket Standard',
      awb_code: logisticsDetails.awbCode || `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`,
      tracking_url: logisticsDetails.trackingUrl || `https://shiprocket.co/tracking/${Math.floor(100000000 + Math.random() * 900000000)}`,
      date: new Date().toISOString()
    };

    // Deduct stock in memory
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const itemInCart = cart.find((c) => c.id === p.id);
        if (itemInCart) {
          const rem = Math.max(0, p.stock - itemInCart.qty);
          return { ...p, stock: rem };
        }
        return p;
      })
    );

    // Sync to Supabase DB
    try {
      await supabase.from('orders').insert([newOrder]);
    } catch (err) {
      console.warn('Supabase DB order insert notice:', err.message);
    }

    // Sync in real-time to Shiprocket Account
    try {
      syncOrderToShiprocket(newOrder);
    } catch (sErr) {
      console.warn('Shiprocket API sync notice:', sErr.message);
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D49AA5', '#CFA45C', '#F2C4C7', '#FFF6EE']
    });

    return newOrder;
  };

  // Update Order Shipment / Shiprocket AWB Dispatch
  const updateOrderShipment = async (orderId, courierName, awbCode, trackingUrl) => {
    const patch = {
      status: 'Shipped',
      shipping_courier: courierName,
      awb_code: awbCode,
      tracking_url: trackingUrl
    };

    try {
      await supabase.from('orders').update(patch).eq('id', orderId);
    } catch (err) {
      console.warn('Supabase order shipment update notice:', err.message);
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...patch } : o));
    showToast(`Order #${orderId} dispatched via ${courierName}! AWB: ${awbCode}`);
  };

  // Update Order Status (Processing -> Shipped -> Delivered -> Cancelled)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch (err) {
      console.warn('Supabase DB order status update notice:', err.message);
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} status updated to ${newStatus}`);
  };

  // Delete Order
  const deleteOrder = async (orderId) => {
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (err) {
      console.warn('Supabase DB order delete notice:', err.message);
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} deleted`);
  };

  // VIP Sparkle Club Newsletter Subscription
  const subscribeNewsletter = async (email, source = 'VIP Sparkle Club Footer') => {
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return false;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (subscribers.some(s => s.email.toLowerCase() === cleanEmail)) {
      showToast('You are already subscribed to the VIP Sparkle Club! ✨', 'info');
      return true;
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      source,
      createdAt: new Date().toISOString()
    };

    try {
      await supabase.from('newsletter_subscribers').insert([{
        email: cleanEmail,
        source: source
      }]);
    } catch (err) {
      console.warn('Supabase subscriber insert notice:', err.message);
    }

    setSubscribers(prev => [newSub, ...prev]);
    
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#8B263E', '#FAF4EE']
    });

    showToast('✨ Welcome to VIP Sparkle Club! Exclusive drops & 10% code sent to your email.');
    return true;
  };

  // Delete Subscriber (Admin control)
  const deleteSubscriber = async (email) => {
    try {
      await supabase.from('newsletter_subscribers').delete().eq('email', email);
    } catch (err) {
      console.warn('Supabase subscriber delete notice:', err.message);
    }
    setSubscribers(prev => prev.filter(s => s.email !== email));
    showToast(`Subscriber ${email} removed`);
  };

  // Helper: Verify if user has purchased this product in any past completed/processing order
  const hasUserPurchasedProduct = (userId, userEmail, productId) => {
    if (!productId) return false;
    return orders.some(order => {
      if (order.status === 'Cancelled') return false;
      const isUserMatch = (userId && order.user_id === userId) || (userEmail && order.customer?.email?.toLowerCase() === userEmail.toLowerCase());
      if (!isUserMatch) return false;
      return Array.isArray(order.items) && order.items.some(item => item.id === productId);
    });
  };

  // Helper: Require User Sign-In for Purchase Actions
  const requireAuthForAction = (actionCallback, message = 'Please sign in or create an account to proceed.') => {
    if (!user) {
      showToast(message, 'info');
      setIsAuthModalOpen(true);
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  // Admin Add Product (Uploads local images & videos directly to Supabase Storage bucket 'products' & inserts to Supabase DB)
  const addProduct = async (newProduct) => {
    showToast('Uploading images & videos to Supabase bucket "products"...', 'info');
    
    const uploadedImages = await Promise.all(
      (newProduct.images || []).filter(Boolean).map((img) => uploadProductPhotoToSupabase(img))
    );

    const uploadedVideos = await Promise.all(
      (newProduct.videos || []).filter(Boolean).map((vid) => uploadProductVideoToSupabase(vid))
    );

    const created = {
      ...newProduct,
      id: newProduct.id || `ec-${Date.now()}`,
      sku: newProduct.sku || `EC-NK-${Math.floor(100 + Math.random() * 900)}`,
      rating: newProduct.rating ?? 5.0,
      reviewsCount: newProduct.reviewsCount ?? 0,
      price: Number(newProduct.price || 0),
      stock: newProduct.price <= 0 ? 0 : (newProduct.stock !== undefined && newProduct.stock !== null ? Number(newProduct.stock) : 10),
      taxPercent: Number(newProduct.taxPercent ?? 0),
      isFeatured: Boolean(newProduct.isFeatured),
      isNew: newProduct.isNew !== undefined ? Boolean(newProduct.isNew) : true,
      images: uploadedImages,
      videos: uploadedVideos,
      variants: newProduct.variants || [],
      customSections: newProduct.customSections || newProduct.customSpecs || []
    };

    try {
      const { error: dbError } = await supabase.from('products').upsert([{
        id: created.id,
        title: created.title,
        category: created.category,
        price: created.price,
        compare_price: created.comparePrice,
        tax_percent: created.taxPercent,
        rating: created.rating,
        reviews_count: created.reviewsCount,
        stock: created.stock,
        sku: created.sku,
        is_featured: created.isFeatured,
        is_new: created.isNew,
        finish_options: created.variants || [],
        stone_type: created.stoneType || '',
        images: created.images,
        videos: created.videos,
        description: created.description || '',
        details: created.details || [],
        care: created.care || '',
        weight_grams: created.weightGrams || '',
        dimensions: created.dimensions || '',
        metal_purity: created.metalPurity || '',
        gemstone_clarity: created.gemstoneClarity || '',
        plating_thickness: created.platingThickness || '',
        occasion_tags: created.occasionTags || [],
        warranty_info: created.warrantyInfo || '',
        custom_specs: created.customSections || []
      }], { onConflict: 'id' });

      if (dbError) {
        console.error('Supabase DB product insert error:', dbError.message);
        showToast('Database error saving product: ' + dbError.message, 'error');
      }
    } catch (err) {
      console.error('Supabase DB product insert error:', err.message);
      showToast('Database error: ' + err.message, 'error');
    }

    setProducts((prev) => [created, ...prev.filter(p => p.id !== created.id)]);
    showToast(`Product "${created.title}" published & saved!`);
  };

  // Admin Update Product
  const updateProduct = async (updatedProduct) => {
    showToast('Uploading updated images & videos to Supabase bucket "products"...', 'info');

    const uploadedImages = await Promise.all(
      (updatedProduct.images || []).filter(Boolean).map((img) => uploadProductPhotoToSupabase(img))
    );

    const uploadedVideos = await Promise.all(
      (updatedProduct.videos || []).filter(Boolean).map((vid) => uploadProductVideoToSupabase(vid))
    );

    const numPrice = Number(updatedProduct.price || 0);
    const parsedStock = updatedProduct.stock !== undefined && updatedProduct.stock !== null ? Number(updatedProduct.stock) : 0;

    const payload = { 
      ...updatedProduct, 
      id: updatedProduct.id,
      sku: updatedProduct.sku || `EC-${updatedProduct.id}`,
      rating: updatedProduct.rating ?? 5.0,
      reviewsCount: updatedProduct.reviewsCount ?? 0,
      isFeatured: Boolean(updatedProduct.isFeatured),
      isNew: Boolean(updatedProduct.isNew),
      price: numPrice,
      stock: numPrice <= 0 ? 0 : (parsedStock >= 0 ? parsedStock : 0),
      images: uploadedImages, 
      videos: uploadedVideos,
      variants: updatedProduct.variants || [],
      customSections: updatedProduct.customSections || updatedProduct.customSpecs || []
    };

    try {
      const { error: dbError } = await supabase.from('products').upsert([{
        id: payload.id,
        title: payload.title,
        category: payload.category,
        price: payload.price,
        compare_price: payload.comparePrice,
        tax_percent: payload.taxPercent ?? 0,
        rating: payload.rating,
        reviews_count: payload.reviewsCount,
        stock: payload.stock,
        sku: payload.sku,
        is_featured: payload.isFeatured,
        is_new: payload.isNew,
        finish_options: payload.variants || [],
        stone_type: payload.stoneType || '',
        images: payload.images,
        videos: payload.videos,
        description: payload.description || '',
        details: payload.details || [],
        care: payload.care || '',
        weight_grams: payload.weightGrams || '',
        dimensions: payload.dimensions || '',
        metal_purity: payload.metalPurity || '',
        gemstone_clarity: payload.gemstoneClarity || '',
        plating_thickness: payload.platingThickness || '',
        occasion_tags: payload.occasionTags || [],
        warranty_info: payload.warrantyInfo || '',
        custom_specs: payload.customSections || []
      }], { onConflict: 'id' });

      if (dbError) {
        console.error('Supabase DB product update error:', dbError.message);
        showToast('Database error updating product: ' + dbError.message, 'error');
      }
    } catch (err) {
      console.error('Supabase DB product update error:', err.message);
      showToast('Database error: ' + err.message, 'error');
    }

    setProducts((prev) => prev.map((p) => (String(p.id) === String(payload.id) ? payload : p)));
    showToast(`Product "${payload.title}" updated successfully!`);
  };

  // Admin Delete Product
  const deleteProduct = async (productId) => {
    try {
      const { error: dbError } = await supabase.from('products').delete().eq('id', productId);
      if (dbError) {
        console.warn('Supabase DB product delete notice:', dbError.message);
      }
    } catch (err) {
      console.warn('Supabase DB product delete notice:', err.message);
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted from database', 'info');
  };

  // Add Review
  const addReview = async (reviewData) => {
    let photoUrl = reviewData.photo;
    if (photoUrl && photoUrl.startsWith('data:')) {
      photoUrl = await uploadProductPhotoToSupabase(photoUrl);
    }

    const newRev = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      photo: photoUrl,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    try {
      await supabase.from('reviews').insert([{
        id: newRev.id,
        product_id: newRev.productId,
        author: newRev.author,
        rating: newRev.rating,
        title: newRev.title,
        comment: newRev.comment,
        photo: newRev.photo,
        date: newRev.date,
        verified: newRev.verified
      }]);
    } catch (err) {
      console.warn('Supabase DB review insert notice:', err.message);
    }

    setReviews((prev) => [newRev, ...prev]);

    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === reviewData.productId) {
          const productRevs = [newRev, ...reviews.filter((r) => r.productId === p.id)];
          const avg = productRevs.reduce((acc, curr) => acc + curr.rating, 0) / productRevs.length;
          return {
            ...p,
            rating: parseFloat(avg.toFixed(1)),
            reviewsCount: productRevs.length
          };
        }
        return p;
      })
    );

    showToast('Thank you! Your product review has been published.');
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        user,
        session,
        isAdmin,
        ADMIN_EMAIL,
        isAuthModalOpen,
        isSecretAdminModalOpen,
        demoAdminOverride,
        products,
        cart,
        wishlist,
        orders,
        reviews,
        coupons,
        subscribers,
        currentView,
        selectedProductId,
        selectedCategory,
        quickViewProduct,
        isCartOpen,
        isCheckoutOpen,
        activeCoupon,
        searchQuery,
        toast,
        cartItemsCount,
        cartSubtotal,
        setSelectedCategory,
        setIsAuthModalOpen,
        setIsSecretAdminModalOpen,
        setDemoAdminOverride,
        setSearchQuery,
        setQuickViewProduct,
        setIsCartOpen,
        setIsCheckoutOpen,
        navigateTo,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        toggleCouponStatus,
        submitOrder,
        updateOrderShipment,
        deleteOrder,
        subscribeNewsletter,
        deleteSubscriber,
        hasUserPurchasedProduct,
        requireAuthForAction,
        blogs,
        selectedBlogId,
        setSelectedBlogId,
        addBlog,
        updateBlog,
        deleteBlog,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addReview,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
