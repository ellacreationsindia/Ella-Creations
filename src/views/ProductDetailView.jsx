import React, { useState } from 'react';
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
  Scale,
  Ruler,
  Gem,
  Tag
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
    setIsCheckoutOpen 
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedFinish, setSelectedFinish] = useState(
    product.finishOptions ? product.finishOptions[0] : 'Standard'
  );
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'details' | 'care'

  // Review Form state
  const [reviewForm, setReviewForm] = useState({
    author: '',
    rating: 5,
    title: '',
    comment: '',
    photo: null
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('shop')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-brand-rose transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
      </button>

      {/* Main Product Layout: Left Gallery, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Zoom Display */}
          <div className="aspect-square rounded-3xl overflow-hidden bg-brand-cream border border-brand-gold/30 shadow-md relative group">
            <img
              src={selectedImage || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-zoom-in"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-stone-900 text-white text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                NEW ARRIVAL
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  (selectedImage || product.images[0]) === img 
                    ? 'border-brand-rose ring-2 ring-brand-rose/30 scale-105 shadow-md' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Specs & Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs text-brand-gold font-semibold uppercase tracking-widest mb-1">
              <span>{product.category} • SKU: {product.sku}</span>
              {product.stock > 0 ? (
                <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full font-bold">Sold Out</span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
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

          {/* Pricing in INR */}
          <div className="bg-brand-cream p-5 rounded-2xl border border-brand-gold/20 flex items-baseline gap-4">
            <span className="text-3xl font-bold text-brand-rose">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-base line-through text-stone-400 font-normal">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {product.comparePrice && (
              <span className="text-xs font-bold text-white bg-stone-900 px-2.5 py-1 rounded-full ml-auto">
                SAVE {formatPrice(product.comparePrice - product.price)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Detailed Jewelry Specifications Grid */}
          <div className="bg-white p-5 rounded-2xl border border-brand-gold/30 shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-gold" /> Master Jewelry Specifications
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-brand-cream/50 p-2.5 rounded-xl">
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Net Weight</span>
                <span className="font-bold text-stone-800">{product.weightGrams || '28.5g'}</span>
              </div>

              <div className="bg-brand-cream/50 p-2.5 rounded-xl">
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Metal Purity</span>
                <span className="font-bold text-stone-800">{product.metalPurity || '22K Gold Plated over Brass'}</span>
              </div>

              <div className="bg-brand-cream/50 p-2.5 rounded-xl">
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Gemstone & Cut</span>
                <span className="font-bold text-stone-800">{product.gemstoneClarity || 'AAA+ Cubic Zirconia / Polki'}</span>
              </div>

              <div className="bg-brand-cream/50 p-2.5 rounded-xl">
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Plating Thickness</span>
                <span className="font-bold text-stone-800">{product.platingThickness || '3 Micron Anti-Tarnish'}</span>
              </div>

              <div className="bg-brand-cream/50 p-2.5 rounded-xl col-span-2">
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Dimensions & Fit</span>
                <span className="font-bold text-stone-800">{product.dimensions || '16 inch choker + 4 inch adjustable drawstring'}</span>
              </div>

              <div className="bg-brand-cream/50 p-2.5 rounded-xl col-span-2">
                <span className="text-stone-400 text-[10px] uppercase font-semibold block">Warranty & Guarantee</span>
                <span className="font-bold text-emerald-700">{product.warrantyInfo || '1-Year Ella Creations Anti-Tarnish Guarantee'}</span>
              </div>
            </div>
          </div>

          {/* Finish Variants */}
          {product.finishOptions && (
            <div>
              <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Select Finish: <span className="text-brand-rose">{selectedFinish}</span>
              </label>
              <div className="flex gap-2">
                {product.finishOptions.map((finish) => (
                  <button
                    key={finish}
                    onClick={() => setSelectedFinish(finish)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedFinish === finish
                        ? 'border-brand-rose bg-brand-rose text-white shadow-soft-rose'
                        : 'border-stone-200 text-stone-700 hover:border-brand-rose bg-white'
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2.5 font-semibold text-sm">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, qty, selectedFinish)}
                className="flex-1 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-soft-rose transition-colors text-xs uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
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
              onClick={() => {
                addToCart(product, qty, selectedFinish);
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-brand-gold hover:bg-brand-gold/90 text-stone-900 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-gold-glow transition-all"
            >
              Buy It Now (Express Checkout)
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <ShieldCheck className="w-5 h-5 text-brand-gold mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-stone-800">100% Anti-Tarnish</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <Truck className="w-5 h-5 text-brand-rose mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-stone-800">Free Velvet Box</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <RotateCcw className="w-5 h-5 text-brand-gold mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-stone-800">Easy Returns</p>
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-gold/30 shadow-sm space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-6 gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Verified Feedback</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">Customer Reviews & Photos</h2>
          </div>
          <div className="flex items-center gap-4 bg-brand-cream p-4 rounded-2xl border border-brand-gold/20">
            <div className="text-center">
              <span className="font-serif text-3xl font-bold text-stone-900">{product.rating}</span>
              <span className="text-xs text-stone-500 block">out of 5 stars</span>
            </div>
            <div className="border-l border-stone-300 pl-4 space-y-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-600 block">{productReviews.length} Total Reviews</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {productReviews.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <p>No reviews yet for this piece. Be the first to leave a review!</p>
              </div>
            ) : (
              productReviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-brand-card rounded-2xl border border-stone-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-stone-900 text-sm">{rev.author}</span>
                      {rev.verified && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`} />
                    ))}
                  </div>

                  <h4 className="font-bold text-sm text-stone-800">{rev.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                  {/* Customer Photo preview */}
                  {rev.photo && (
                    <div className="pt-2">
                      <img src={rev.photo} alt="Customer Photo" className="w-24 h-24 object-cover rounded-xl border border-brand-gold/30 shadow-sm" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <div className="lg:col-span-5 bg-brand-cream p-6 rounded-2xl border border-brand-gold/30 h-fit space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">Write a Customer Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
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
                  placeholder="e.g. Priyanshu Sharma"
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your experience..."
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Review</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tell us about the shine, fit, packaging, and feel of this jewelry..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose bg-white"
                ></textarea>
              </div>

              {/* Photo Upload Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Attach Customer Photo (Optional)</label>
                <label className="flex items-center justify-center gap-2 border border-dashed border-brand-rose/60 bg-white p-3 rounded-lg cursor-pointer hover:bg-brand-rose/5 transition-colors">
                  <Upload className="w-4 h-4 text-brand-rose" />
                  <span className="text-xs text-stone-600">
                    {reviewForm.photo ? 'Photo Selected ✓' : 'Upload photo from device'}
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3 rounded-xl shadow-soft-rose transition-colors text-xs uppercase tracking-wider"
              >
                Submit Verified Review
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Related Jewelry Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">You May Also Love</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">Matching & Related Jewelry</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
