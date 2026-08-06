import React from 'react';
import { Star, Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    navigateTo, 
    setQuickViewProduct 
  } = useStore();

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-brand-gold/20 shadow-sm hover:shadow-soft-rose transition-all duration-300 flex flex-col relative">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNew && (
          <span className="bg-stone-900 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-sm">
            NEW
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-brand-rose text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-brand-rose text-white shadow-md scale-110'
            : 'bg-white/80 backdrop-blur-md text-stone-600 hover:text-brand-rose hover:bg-white'
        }`}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <div 
        onClick={() => navigateTo('product', product.id)}
        className="relative aspect-square overflow-hidden bg-brand-cream cursor-pointer group"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-10 h-10 rounded-full bg-white text-stone-800 flex items-center justify-center shadow-lg hover:bg-brand-rose hover:text-white transition-all transform hover:scale-110"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-lg hover:bg-stone-900 transition-all transform hover:scale-110"
            title="Add to Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Stone */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium mb-1">
            <span className="uppercase tracking-wider text-brand-gold font-semibold">{product.category}</span>
            <span>{product.stoneType}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => navigateTo('product', product.id)}
            className="font-serif text-base font-semibold text-stone-900 line-clamp-1 hover:text-brand-rose cursor-pointer transition-colors"
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-600 font-medium">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-stone-900">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-xs line-through text-stone-400 font-normal">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] font-semibold text-amber-600 block">Only {product.stock} left!</span>
            )}
          </div>

          <button
            onClick={() => navigateTo('product', product.id)}
            className="text-xs font-semibold text-brand-rose hover:text-stone-900 transition-colors flex items-center gap-1 group/btn"
          >
            View Details
            <Sparkles className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
