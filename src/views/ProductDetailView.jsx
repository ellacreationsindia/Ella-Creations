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
  ListPlus
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
    requireAuthForAction
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

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.price <= 0 || product.stock <= 0;
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Tax calculations
  const taxRate = product.taxPercent || 18;
  const basePrice = product.price > 0 ? product.price / (1 + taxRate / 100) : 0;
  const gstAmount = product.price - basePrice;

  // Media items combined
  const mediaList = [
    ...(product.images || []).map(url => ({ type: 'image', url })),
    ...(product.videos || []).map(url => ({ type: 'video', url }))
  ];

  const currentMedia = activeMedia.url ? activeMedia : (mediaList[0] || { type: 'image', url: product.images[0] });

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
          {/* Main Media Display */}
          <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-stone-50 via-brand-cream/30 to-white border border-brand-gold/30 shadow-md relative group p-4 flex items-center justify-center">
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
                alt={product.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
              />
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
                <span className="text-2xl sm:text-3xl font-bold text-brand-rose">{formatPrice(product.price)}</span>
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
              </div>
              <div className="text-[11px] sm:text-xs text-stone-500 flex flex-wrap items-center gap-2 sm:gap-3 pt-1 border-t border-brand-gold/20">
                <span>Inclusive of <strong>{taxRate}% GST Tax</strong> ({formatPrice(gstAmount)})</span>
                <span className="hidden sm:inline">•</span>
                <span>Base Price: {formatPrice(basePrice)}</span>
              </div>
            </div>
          )}

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
            {product.description}
          </p>

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
            <button onClick={() => navigateTo('shop')} className="text-xs font-semibold text-brand-rose hover:underline">
              View All Catalog →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* STICKY BOTTOM ACTION BAR FOR MOBILE DEVICES (< 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md p-3.5 border-t border-brand-gold/30 shadow-2xl flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <span className="block text-[10px] text-stone-500 font-semibold uppercase truncate">{product.title}</span>
          <span className="block text-base font-bold text-brand-rose">{formatPrice(product.price)}</span>
        </div>

        <button
          disabled={isOutOfStock}
          onClick={() => addToCart(product, qty, selectedVariant || 'Standard')}
          className={`font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider transition-colors ${
            isOutOfStock 
              ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
              : 'bg-stone-900 text-white shadow-sm'
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
          className={`font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all ${
            isOutOfStock 
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
              : 'bg-brand-rose text-white shadow-soft-rose'
          }`}
        >
          Buy Now
        </button>
      </div>

    </div>
  );
}
