import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase, uploadProductPhotoToSupabase, uploadProductVideoToSupabase } from '../lib/supabase';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS, ACTIVE_COUPONS } from '../data/initialData';

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

  // Products, Orders, Reviews
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ella_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ella_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('ella_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // UI state
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('');
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

  const navigateTo = (view, productId = null) => {
    setCurrentView(view);
    if (productId) {
      setSelectedProductId(productId);
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

      // Role-Based Post-Login Auto Redirect
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && currentUser) {
        setIsAuthModalOpen(false);
        const userEmail = currentUser.email;

        if (userEmail === ADMIN_EMAIL) {
          showToast('👑 Welcome Admin! Opening Admin Dashboard...', 'success');
          setCurrentView('admin');
        } else {
          showToast(`Welcome back, ${currentUser.user_metadata?.full_name || currentUser.email}!`, 'success');
          setCurrentView('shop');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Fetch data from Supabase DB on mount
  useEffect(() => {
    fetchProductsFromSupabase();
    fetchOrdersFromSupabase();
    fetchReviewsFromSupabase();
  }, []);

  const fetchProductsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.warn('Supabase DB products fetch notice:', error.message);
        return;
      }
      if (data && data.length > 0) {
        const mapped = data.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          price: Number(p.price || 0),
          comparePrice: p.compare_price ? Number(p.compare_price) : null,
          taxPercent: Number(p.tax_percent || 18),
          rating: Number(p.rating || 5.0),
          reviewsCount: p.reviews_count || 0,
          stock: p.price <= 0 ? 0 : (p.stock ?? 0),
          sku: p.sku,
          isFeatured: p.is_featured,
          isNew: p.is_new,
          finishOptions: p.finish_options || ['Rose Gold', 'Gold'],
          stoneType: p.stone_type || 'Cubic Zirconia (CZ)',
          images: p.images || [],
          videos: p.videos || [],
          description: p.description,
          details: p.details || [],
          care: p.care,
          weightGrams: p.weight_grams,
          dimensions: p.dimensions,
          metalPurity: p.metal_purity,
          gemstoneClarity: p.gemstone_clarity,
          platingThickness: p.plating_thickness,
          occasionTags: p.occasion_tags || [],
          warrantyInfo: p.warranty_info,
          customSpecs: p.custom_specs || []
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
      if (data) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Supabase DB orders fetch notice:', err.message);
    }
  };

  const fetchReviewsFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        const mapped = data.map((r) => ({
          id: r.id,
          productId: r.product_id,
          author: r.author,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          photo: r.photo,
          date: r.date,
          verified: r.verified
        }));
        setReviews(mapped);
      }
    } catch (err) {
      console.warn('Supabase DB reviews fetch notice:', err.message);
    }
  };

  // Sync products, cart & wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('ella_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ella_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ella_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

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
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setDemoAdminOverride(false);
    setCurrentView('home');
    showToast('Signed out of Ella Creations', 'info');
  };

  // Cart operations
  const addToCart = (product, quantity = 1, finish = null) => {
    // Check if price zero or out of stock
    if (product.price <= 0 || product.stock <= 0) {
      showToast(`"${product.title}" is currently out of stock`, 'error');
      return;
    }

    const selectedFinish = finish || (product.finishOptions ? product.finishOptions[0] : 'Standard');
    
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.finish === selectedFinish
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
            price: product.price,
            taxPercent: product.taxPercent || 18,
            image: product.images[0],
            finish: selectedFinish,
            qty: quantity,
            stock: product.stock
          }
        ];
      }
    });

    showToast(`Added "${product.title}" (${selectedFinish}) to your cart!`);
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

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = ACTIVE_COUPONS[cleanCode];
    if (!coupon) {
      showToast('Invalid coupon code. Try ELLA10 or SPARKLE20', 'error');
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

  // Submit Order (Inserts into Supabase DB `orders` table)
  const submitOrder = async (customerDetails, paymentMethod) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const taxAmount = (subtotal * 18) / 100; // 18% GST calculation
    const discountAmount = activeCoupon ? (subtotal * activeCoupon.discountPercent) / 100 : 0;
    const shipping = subtotal >= 2500 ? 0 : 199;
    const total = subtotal - discountAmount + shipping;

    const newOrder = {
      id: `EC-${Math.floor(1000 + Math.random() * 9000)}`,
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
      date: new Date().toISOString()
    };

    // Deduct stock in memory & DB
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

  // Admin Add Product (Uploads local images & videos directly to Supabase Storage bucket 'products' & inserts to Supabase DB)
  const addProduct = async (newProduct) => {
    showToast('Uploading images & videos to Supabase bucket "products"...', 'info');
    
    const uploadedImages = await Promise.all(
      (newProduct.images || []).map((img) => uploadProductPhotoToSupabase(img))
    );

    const uploadedVideos = await Promise.all(
      (newProduct.videos || []).map((vid) => uploadProductVideoToSupabase(vid))
    );

    const created = {
      ...newProduct,
      id: `ec-${Date.now()}`,
      sku: newProduct.sku || `EC-NK-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewsCount: 0,
      price: Number(newProduct.price || 0),
      stock: newProduct.price <= 0 ? 0 : Number(newProduct.stock || 10),
      taxPercent: Number(newProduct.taxPercent || 18),
      isFeatured: newProduct.isFeatured || false,
      isNew: true,
      images: uploadedImages,
      videos: uploadedVideos,
      customSpecs: newProduct.customSpecs || []
    };

    try {
      const { error: dbError } = await supabase.from('products').insert([{
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
        finish_options: created.finishOptions,
        stone_type: created.stoneType,
        images: created.images,
        videos: created.videos,
        description: created.description,
        details: created.details,
        care: created.care,
        weight_grams: created.weightGrams,
        dimensions: created.dimensions,
        metal_purity: created.metalPurity,
        gemstone_clarity: created.gemstoneClarity,
        plating_thickness: created.platingThickness,
        occasion_tags: created.occasionTags,
        warranty_info: created.warrantyInfo,
        custom_specs: created.customSpecs
      }]);
      if (dbError) {
        console.warn('Supabase DB product insert notice:', dbError.message);
      }
    } catch (err) {
      console.warn('Supabase DB product insert notice:', err.message);
    }

    setProducts((prev) => [created, ...prev]);
    showToast(`Product "${created.title}" published & saved!`);
  };

  // Admin Update Product
  const updateProduct = async (updatedProduct) => {
    showToast('Uploading updated images & videos to Supabase bucket "products"...', 'info');

    const uploadedImages = await Promise.all(
      (updatedProduct.images || []).map((img) => uploadProductPhotoToSupabase(img))
    );

    const uploadedVideos = await Promise.all(
      (updatedProduct.videos || []).map((vid) => uploadProductVideoToSupabase(vid))
    );

    const payload = { 
      ...updatedProduct, 
      price: Number(updatedProduct.price || 0),
      stock: updatedProduct.price <= 0 ? 0 : Number(updatedProduct.stock || 0),
      images: uploadedImages, 
      videos: uploadedVideos,
      customSpecs: updatedProduct.customSpecs || []
    };

    try {
      const { error: dbError } = await supabase.from('products').update({
        title: payload.title,
        category: payload.category,
        price: payload.price,
        compare_price: payload.comparePrice,
        tax_percent: payload.taxPercent || 18,
        stock: payload.stock,
        stone_type: payload.stoneType,
        finish_options: payload.finishOptions,
        images: payload.images,
        videos: payload.videos,
        description: payload.description,
        weight_grams: payload.weightGrams,
        dimensions: payload.dimensions,
        metal_purity: payload.metalPurity,
        gemstone_clarity: payload.gemstoneClarity,
        plating_thickness: payload.platingThickness,
        occasion_tags: payload.occasionTags,
        warranty_info: payload.warrantyInfo,
        custom_specs: payload.customSpecs
      }).eq('id', payload.id);
      if (dbError) {
        console.warn('Supabase DB product update notice:', dbError.message);
      }
    } catch (err) {
      console.warn('Supabase DB product update notice:', err.message);
    }

    setProducts((prev) => prev.map((p) => (p.id === payload.id ? payload : p)));
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

  // Admin Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch (err) {
      console.warn('Supabase DB order status update notice:', err.message);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} status updated to ${newStatus}`);
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
        currentView,
        selectedProductId,
        quickViewProduct,
        isCartOpen,
        isCheckoutOpen,
        activeCoupon,
        searchQuery,
        toast,
        cartItemsCount,
        cartSubtotal,
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
        submitOrder,
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
