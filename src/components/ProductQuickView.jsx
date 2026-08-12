import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function ProductQuickView() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    navigateTo 
  } = useStore();

  if (!quickViewProduct) return null;

  const [selectedImage, setSelectedImage] = useState(quickViewProduct.images[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    quickViewProduct.variants && quickViewProduct.variants.length > 0 ? quickViewProduct.variants[0] : null
  );
  const [qty, setQty] = useState(1);

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-brand-gold/30 relative max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="md:w-1/2 bg-brand-cream p-6 flex flex-col justify-between">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-inner mb-4 relative p-4 flex items-center justify-center border border-stone-100">
            <img
              src={selectedImage}
              alt={quickViewProduct.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white p-1 flex items-center justify-center ${
                    selectedImage === img ? 'border-brand-rose shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-brand-gold font-semibold uppercase tracking-wider mb-1">
              <span>{quickViewProduct.category}</span>
              <span>{quickViewProduct.stoneType}</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900">{quickViewProduct.title}</h2>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-700">
                {quickViewProduct.rating} ({quickViewProduct.reviewsCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-bold text-brand-rose">{formatPrice(selectedVariant?.price || quickViewProduct.price)}</span>
              {quickViewProduct.comparePrice && (
                <span className="text-sm line-through text-stone-400">{formatPrice(quickViewProduct.comparePrice)}</span>
              )}
            </div>

            <div className="text-xs text-stone-600 leading-relaxed mt-3 whitespace-pre-wrap">
              {quickViewProduct.description}
            </div>

            {/* Product Variants Selector */}
            {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider">
                  Variant: <span className="text-brand-rose">{selectedVariant?.name || 'Standard'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id || selectedVariant?.name === v.name;
                    return (
                      <button
                        key={v.id || v.name}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-brand-rose bg-brand-rose text-white shadow-sm'
                            : 'border-stone-200 text-stone-700 hover:border-brand-rose'
                        }`}
                      >
                        {v.swatchColor && (
                          <span className="w-3 h-3 rounded-full border border-white/50 inline-block" style={{ backgroundColor: v.swatchColor }} />
                        )}
                        <span>{v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-4">
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider">Quantity:</label>
              <div className="flex items-center border border-stone-300 rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 font-semibold text-sm">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(quickViewProduct, qty, selectedVariant || 'Standard');
                  setQuickViewProduct(null);
                }}
                className="flex-1 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-soft-rose transition-colors text-xs uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted ? 'border-brand-rose bg-brand-rose/10 text-brand-rose' : 'border-stone-300 text-stone-600 hover:border-brand-rose'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                navigateTo('product', quickViewProduct.id);
                setQuickViewProduct(null);
              }}
              className="w-full text-center text-xs font-semibold text-stone-700 hover:text-brand-rose transition-colors py-1 flex items-center justify-center gap-1"
            >
              Go to Full Product Page & Specifications <Sparkles className="w-3 h-3 text-brand-gold" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
