import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Award,
  Video,
  Ban,
  Tag,
  Lock,
  Layers,
  ListPlus,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  MapPin,
  Clock,
  Eye
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailView() {
  const { 
    products, 
    selectedProductId, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    reviews, 
    addReview, 
    navigateTo, 
    setIsCheckoutOpen,
    user,
    hasUserPurchasedProduct,
    requireAuthForAction,
    getProductPricing,
    getProductUrl,
    recordProductView,
    recentlyViewed
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeMedia, setActiveMedia] = useState({ type: 'image', url: product?.images?.[0] || '' });
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setActiveMedia({ type: 'image', url: product.images?.[0] || '' });
      setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : null);
      setQty(1);
    }
  }, [selectedProductId, product]);

  // Review Form state
  const [reviewForm, setReviewForm] = useState({
    author: '',
    rating: 5,
    title: '',
    comment: '',
    photo: null
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Share & Pincode Checker State
  const [copiedLink, setCopiedLink] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Record this product in recently viewed
  useEffect(() => {
    if (product?.id && recordProductView) {
      recordProductView(product.id);
    }
  }, [product?.id, recordProductView]);

  // Product Share URL (SEO-friendly slug)
  const productShareUrl = getProductUrl ? getProductUrl(product) : (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.warn('Failed copying link to clipboard', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} | Ella Creations Luxury Artificial Jewelry`,
          text: `Take a look at this exquisite handcrafted jewelry piece: ${product.title}`,
          url: productShareUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    const clean = (pincode || '').trim();
    if (!/^\d{6}$/.test(clean)) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
      return;
    }
    const today = new Date();
    const dMin = new Date(today);
    dMin.setDate(today.getDate() + 3);
    const dMax = new Date(today);
    dMax.setDate(today.getDate() + 5);
    const options = { month: 'short', day: 'numeric', weekday: 'short' };
    const dateStr = `${dMin.toLocaleDateString('en-IN', options)} - ${dMax.toLocaleDateString('en-IN', options)}`;
    setPincodeStatus({
      checked: true,
      valid: true,
      pincode: clean,
      deliveryDate: dateStr,
      message: `Delivery available to ${clean}! Estimated arrival ${dateStr}. Free express insured courier with signature receipt.`
    });
  };

  // Mobile Touch Swipe & Zoom Modal State
  const [touchStartX, setTouchStartX] = useState(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Lock background scroll when zoom modal is open
  useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isZoomOpen]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-800">No Product Selected</h2>
        <button onClick={() => navigateTo('shop')} className="bg-brand-rose text-white text-xs font-semibold px-6 py-2.5 rounded-full">
          Browse Shop Catalog
        </button>
      </div>
    );
  }

  const pricing = getProductPricing ? getProductPricing(product, selectedVariant) : {
    hasPromo: false,
    originalPrice: Number(selectedVariant?.price ?? product.price ?? 0),
    finalPrice: Number(selectedVariant?.price ?? product.price ?? 0),
    discountPercent: 0,
    savings: 0,
    comparePrice: product.comparePrice
  };

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = pricing.finalPrice <= 0 || product.stock <= 0;
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recentlyViewedProducts = (recentlyViewed || [])
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  // Tax calculations
  const taxRate = product.taxPercent !== undefined && product.taxPercent !== null ? product.taxPercent : 0;

  // Media items combined
  const mediaList = [
    ...(product.images || []).map(url => ({ type: 'image', url })),
    ...(product.videos || []).map(url => ({ type: 'video', url }))
  ];

  const currentMedia = activeMedia.url ? activeMedia : (mediaList[0] || { type: 'image', url: product.images[0] });

  const currentMediaIndex = mediaList.findIndex(m => m.url === currentMedia.url);
  const handleSwipeNext = () => {
    if (mediaList.length > 1) {
      const nextIdx = (currentMediaIndex + 1) % mediaList.length;
      setActiveMedia(mediaList[nextIdx]);
    }
  };
  const handleSwipePrev = () => {
    if (mediaList.length > 1) {
      const prevIdx = (currentMediaIndex - 1 + mediaList.length) % mediaList.length;
      setActiveMedia(mediaList[prevIdx]);
    }
  };
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleSwipeNext();
      } else {
        handleSwipePrev();
      }
    }
    setTouchStartX(null);
  };

  // Handle Photo Upload in Review Form
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewForm((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.title || !reviewForm.comment) return;

    setIsSubmittingReview(true);
    addReview({
      productId: product.id,
      author: reviewForm.author,
      rating: Number(reviewForm.rating),
      title: reviewForm.title,
      comment: reviewForm.comment,
      photo: reviewForm.photo
    });

    setReviewForm({
      author: '',
      rating: 5,
      title: '',
      comment: '',
      photo: null
    });
    setIsSubmittingReview(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-16 pb-24 lg:pb-16">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('shop')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-brand-rose transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
      </button>

      {/* Main Product Layout: Left Gallery & Video Player, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Media Gallery & Interactive Video Player */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Media Display with Touch Swipe & Zoom Trigger */}
          <div 
            className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-stone-50 via-brand-cream/30 to-white border border-brand-gold/30 shadow-md relative group p-4 flex items-center justify-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentMedia.type === 'video' ? (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                loop
                muted
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={currentMedia.url || product.images[0]}
                alt={`${product.title} - Handcrafted ${product.category} in India | Ella Creations`}
                title={`${product.title} - Handcrafted Artificial Jewelry`}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                onClick={() => {
                  setIsZoomOpen(true);
                  setZoomScale(1);
                }}
              />
            )}

            {/* Tap to Zoom indicator button */}
            {currentMedia.type !== 'video' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomOpen(true);
                  setZoomScale(1);
                }}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-stone-700 shadow-md flex items-center justify-center hover:bg-brand-rose hover:text-white transition-colors cursor-pointer"
                title="Enlarge and inspect jewelry details"
                aria-label="Enlarge image"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            )}

            {/* Mobile swipe counter pill */}
            {mediaList.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-md">
                <span>{(currentMediaIndex >= 0 ? currentMediaIndex : 0) + 1} / {mediaList.length}</span>
              </div>
            )}

            {isOutOfStock ? (
              <span className="absolute top-4 left-4 bg-rose-900 text-white text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5" /> OUT OF STOCK
              </span>
            ) : product.isNew && (
              <span className="absolute top-4 left-4 bg-stone-900 text-white text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                NEW ARRIVAL
              </span>
            )}
          </div>

          {/* Media Thumbnails (Photos & Product Videos) */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {mediaList.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMedia(item)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 relative bg-white p-1 flex items-center justify-center ${
                  currentMedia.url === item.url 
                    ? 'border-brand-rose ring-2 ring-brand-rose/30 scale-105 shadow-md' 
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-stone-900 flex flex-col items-center justify-center text-white rounded-lg">
                    <Video className="w-5 h-5 sm:w-6 sm:h-6 text-brand-rose animate-pulse" />
                    <span className="text-[8px] sm:text-[9px] font-bold mt-1">VIDEO</span>
                  </div>
                ) : (
                  <img src={item.url} alt={`Media ${idx + 1}`} className="w-full h-full object-contain" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Specs & Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs text-brand-gold font-semibold uppercase tracking-widest mb-1">
              <span>{product.category} • SKU: {product.sku}</span>
              {!isOutOfStock ? (
                <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full font-bold">OUT OF STOCK</span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating Jump */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-700">
                {product.rating} ({product.reviewsCount} customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing & 18% GST Tax Breakdown in INR */}
          {isOutOfStock ? (
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 text-rose-800 space-y-1">
              <span className="font-serif text-lg font-bold flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-600" /> Out of Stock / Unpriced Item
              </span>
              <p className="text-xs text-rose-600">This jewelry piece is currently not available for immediate checkout.</p>
            </div>
          ) : (
            <div className="bg-brand-cream p-4 sm:p-5 rounded-2xl border border-brand-gold/20 space-y-2">
              <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-brand-rose">
                  {formatPrice(pricing.finalPrice)}
                </span>
                
                {pricing.hasPromo ? (
                  <>
                    <span className="text-sm sm:text-base line-through text-stone-400 font-normal">
                      {formatPrice(pricing.originalPrice)}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r from-rose-700 to-brand-rose px-3 py-1 rounded-full ml-auto shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand-gold" />
                      FESTIVE SALE -{pricing.discountPercent}% OFF (SAVE {formatPrice(pricing.savings)})
                    </span>
                  </>
                ) : (
                  <>
                    {product.comparePrice && (
                      <span className="text-sm sm:text-base line-through text-stone-400 font-normal">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                    {product.comparePrice && (
                      <span className="text-[10px] sm:text-xs font-bold text-white bg-stone-900 px-2.5 py-1 rounded-full ml-auto">
                        SAVE {formatPrice(product.comparePrice - product.price)}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Product Description with Preserved Formatting */}
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal whitespace-pre-wrap">
            {product.description}
          </div>

          {/* Custom Sections & Specifications per product */}
          {product.customSections && product.customSections.length > 0 && (
            <div className="space-y-4">
              {product.customSections.map((sec, secIdx) => (
                <div key={secIdx} className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-gold/30 shadow-sm space-y-3">
                  <h4 className="font-serif text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-gold" /> {sec.title}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                    {sec.items && sec.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-brand-cream/50 p-2.5 rounded-xl border border-brand-gold/10">
                        <span className="text-stone-400 text-[10px] uppercase font-semibold block">{item.label}</span>
                        <span className="font-bold text-stone-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Select Variant: <span className="text-brand-rose">{selectedVariant?.name || 'Standard'}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id || selectedVariant?.name === variant.name;
                  return (
                    <button
                      key={variant.id || variant.name}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-brand-rose bg-brand-rose text-white shadow-soft-rose scale-105'
                          : 'border-stone-200 text-stone-700 hover:border-brand-rose bg-white'
                      }`}
                    >
                      {variant.swatchColor && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-inner inline-block"
                          style={{ backgroundColor: variant.swatchColor }}
                        />
                      )}
                      <span>{variant.name}</span>
                      {variant.price && variant.price !== product.price && (
                        <span className="text-[10px] opacity-90">({formatPrice(variant.price)})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white">
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-bold disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-3 py-2 font-semibold text-sm">{qty}</span>
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, qty, selectedVariant || 'Standard')}
                className={`flex-1 font-semibold py-3.5 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-colors ${
                  isOutOfStock 
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
                    : 'bg-brand-rose hover:bg-brand-rose/90 text-white shadow-soft-rose'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> {isOutOfStock ? 'OUT OF STOCK' : 'Add to Bag'}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isWishlisted ? 'border-brand-rose bg-brand-rose/10 text-brand-rose' : 'border-stone-300 text-stone-600 hover:border-brand-rose'
                }`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              disabled={isOutOfStock}
              onClick={() => {
                requireAuthForAction(() => {
                  addToCart(product, qty, selectedVariant || 'Standard');
                  navigateTo('checkout');
                }, 'Please sign in or create an account to buy this product.');
              }}
              className={`w-full font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all ${
                isOutOfStock 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-brand-gold hover:bg-brand-gold/90 text-stone-900 shadow-gold-glow'
              }`}
            >
              Buy It Now (Express Checkout)
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-stone-200 text-center">
            <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-100">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold mx-auto mb-1" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-stone-800">Handcrafted Quality</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-100">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-rose mx-auto mb-1" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-stone-800">Insured Dispatch</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-stone-50 rounded-xl border border-stone-100">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600 mx-auto mb-1" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-stone-800">No Return Policy</p>
            </div>
          </div>

          {/* Delivery & Pincode Checker Widget */}
          <div className="p-4 sm:p-5 bg-stone-50/80 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-rose" /> Delivery & Pincode Check
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Pan-India Free Express
              </span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-brand-rose text-stone-900 tracking-wider"
                />
              </div>
              <button
                type="submit"
                className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Check
              </button>
            </form>

            {pincodeStatus && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                pincodeStatus.valid ? 'bg-emerald-50/90 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {pincodeStatus.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <p className="font-medium leading-relaxed">{pincodeStatus.message}</p>
                  {pincodeStatus.valid && (
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                      <Clock className="w-3.5 h-3.5" /> Dispatched in 24 hours in velvet gift box.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social Share & Copy Link Bar */}
          <div className="p-4 bg-brand-cream/50 rounded-2xl border border-brand-gold/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-brand-gold" /> Share This Piece
              </span>
              <span className="text-[10px] text-stone-500">Customized Link</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* WhatsApp 1-Click Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Check out this exquisite handcrafted jewelry piece from Ella Creations:\n${product.title}\n${productShareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                title="Share via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              {/* Copy Shareable Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  copiedLink
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-brand-rose'
                }`}
                title="Copy customized product link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Native device share for mobile */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full text-center text-[11px] text-stone-500 hover:text-brand-rose font-medium py-1 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3 h-3" /> More Sharing Options (Instagram, Message, Email)
            </button>
          </div>

          {/* WhatsApp Bridal & Styling Concierge */}
          <div className="p-3.5 bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-2xl border border-brand-gold/30 flex items-center justify-between gap-3 shadow-sm">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-brand-gold flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" /> Bridal Stylist Assistance
              </p>
              <p className="text-[11px] text-stone-300 leading-tight">Need matching earrings, sizing or styling help?</p>
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(
                `Hello Ella Creations team! I am interested in "${product.title}" (${productShareUrl}) and would like styling guidance.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-rose hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl uppercase tracking-wider shrink-0 transition-colors shadow-sm inline-flex items-center gap-1"
            >
              Chat Stylist
            </a>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-12 border border-brand-gold/30 shadow-sm space-y-8 sm:space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-6 gap-4 sm:gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Verified Feedback</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">Customer Reviews & Photos</h2>
          </div>
          <div className="flex items-center gap-4 bg-brand-cream p-4 rounded-2xl border border-brand-gold/20 self-start md:self-auto">
            <div className="text-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">{product.rating}</span>
              <span className="text-[10px] sm:text-xs text-stone-500 block">out of 5 stars</span>
            </div>
            <div className="border-l border-stone-300 pl-4 space-y-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-600 block">{productReviews.length} Total Reviews</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Reviews List (Full width for non-purchasers, 7 columns for purchasers) */}
          <div className={`${hasUserPurchasedProduct(user?.id, user?.email, product.id) ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4 sm:space-y-6`}>
            {productReviews.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <p className="text-xs sm:text-sm">No reviews yet for this piece. Verified buyers can share their feedback!</p>
              </div>
            ) : (
              productReviews.map((rev) => (
                <div key={rev.id} className="p-4 sm:p-5 bg-brand-card rounded-2xl border border-stone-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-stone-900 text-xs sm:text-sm">{rev.author}</span>
                      {rev.verified && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`}
                      />
                    ))}
                  </div>

                  <h4 className="font-serif font-bold text-stone-800 text-xs sm:text-sm">{rev.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">{rev.comment}</p>

                  {rev.photo && (
                    <div className="pt-1">
                      <img src={rev.photo} alt="Customer attachment" className="w-20 h-20 object-cover rounded-xl border border-stone-200" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Review Submission Form - STRICTLY VISIBLE ONLY FOR VERIFIED PURCHASERS */}
          {hasUserPurchasedProduct(user?.id, user?.email, product.id) && (
            <div className="lg:col-span-5 bg-brand-cream/60 p-6 rounded-3xl border border-brand-gold/30 space-y-4">
              <div className="border-b border-brand-gold/20 pb-3">
                <h3 className="font-serif text-lg font-bold text-stone-900">Share Your Experience</h3>
                <p className="text-xs text-stone-500">Post your feedback & photos as a verified buyer.</p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Order Confirmed! You can submit a review.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 text-amber-400 focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-current' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={reviewForm.author}
                    onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stunning Kundan finish!"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Review Details</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe the sparkle, weight, fit, and craftsmanship..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full text-xs p-3.5 rounded-xl bg-white border border-stone-300 outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Upload Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-rose file:text-white hover:file:bg-brand-rose/90"
                  />
                  {reviewForm.photo && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={reviewForm.photo} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                      <span className="text-[10px] text-emerald-600 font-bold">Photo Attached!</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow-soft-rose transition-colors"
                >
                  {isSubmittingReview ? 'Submitting Review...' : 'Publish Verified Review'}
                </button>
              </form>
            </div>
          )}

        </div>
      </section>

      {/* Related Jewelry Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">You May Also Admire</h3>
            <button onClick={() => navigateTo('shop')} className="text-xs font-semibold text-brand-rose hover:underline cursor-pointer">
              View All Catalog →
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Jewelry Section */}
      {recentlyViewedProducts.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-brand-gold/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-rose" />
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Recently Viewed by You</h3>
                <p className="text-xs text-stone-500">Pick up right where you left off</p>
              </div>
            </div>
            <button onClick={() => navigateTo('shop')} className="text-xs font-semibold text-stone-600 hover:text-brand-rose cursor-pointer">
              Browse More →
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* STICKY BOTTOM ACTION BAR FOR MOBILE DEVICES (< 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md p-3 sm:p-4 border-t border-brand-gold/30 shadow-2xl flex items-center gap-2.5 safe-pb">
        <div className="flex-1 min-w-0 pr-1">
          <span className="block text-[10px] text-stone-500 font-semibold uppercase truncate">{product.title}</span>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-bold text-brand-rose">{formatPrice(pricing.finalPrice)}</span>
            {pricing.hasPromo && (
              <span className="text-[10px] line-through text-stone-400">{formatPrice(pricing.originalPrice)}</span>
            )}
          </div>
        </div>

        <button
          disabled={isOutOfStock}
          onClick={() => addToCart(product, qty, selectedVariant || 'Standard')}
          className={`min-h-[44px] font-semibold py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
            isOutOfStock 
              ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
              : 'bg-stone-900 text-white shadow-sm active:scale-95'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Add
        </button>

        <button
          disabled={isOutOfStock}
          onClick={() => {
            requireAuthForAction(() => {
              addToCart(product, qty, selectedVariant || 'Standard');
              navigateTo('checkout');
            }, 'Please sign in or create an account to buy this product.');
          }}
          className={`min-h-[44px] font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            isOutOfStock 
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
              : 'bg-brand-rose hover:bg-brand-rose/90 text-white shadow-soft-rose active:scale-95'
          }`}
        >
          Buy Now
        </button>
      </div>

      {/* FULL-SCREEN JEWELRY ZOOM & LIGHTBOX MODAL */}
      {isZoomOpen && currentMedia.type !== 'video' && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white safe-pt">
            <div className="space-y-0.5 max-w-[65%] truncate">
              <p className="text-[10px] font-semibold text-brand-gold uppercase tracking-wider">{product.category}</p>
              <h3 className="font-serif text-sm font-bold text-stone-200 truncate">{product.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.min(prev + 0.5, 3))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.max(prev - 0.5, 1))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors ml-1"
                title="Close Image Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Zoomable Image with Swipe & Tap Zoom */}
          <div 
            className="flex-1 flex items-center justify-center overflow-hidden relative my-2 sm:my-4 touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {mediaList.length > 1 && (
              <button
                type="button"
                onClick={handleSwipePrev}
                className="absolute left-2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={currentMedia.url || product.images[0]}
              alt={product.title}
              style={{ transform: `scale(${zoomScale})` }}
              className="max-w-full max-h-[75vh] object-contain transition-transform duration-200 cursor-zoom-in"
              onClick={() => setZoomScale((prev) => (prev > 1 ? 1 : 2))}
            />

            {mediaList.length > 1 && (
              <button
                type="button"
                onClick={handleSwipeNext}
                className="absolute right-2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Footer indicator & swipe instructions */}
          <div className="text-center safe-pb text-stone-400 text-xs py-1">
            <span>Tap image to zoom ({zoomScale}x) • Swipe left/right • {currentMediaIndex + 1} of {mediaList.length}</span>
          </div>
        </div>
      )}

    </div>
  );
}
