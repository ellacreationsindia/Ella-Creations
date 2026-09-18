import React from 'react';
import { Star, Heart, Eye, ShoppingBag, Sparkles, Ban } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    navigateTo, 
    setQuickViewProduct,
    getProductPricing
  } = useStore();

  const pricing = getProductPricing ? getProductPricing(product) : {
    hasPromo: false,
    originalPrice: product.price,
    finalPrice: product.price,
    discountPercent: 0,
    comparePrice: product.comparePrice
  };

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = pricing.finalPrice <= 0 || product.stock <= 0;
  
  const discountPercent = product.comparePrice && product.comparePrice > product.price 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-brand-gold/20 shadow-sm hover:shadow-soft-rose transition-all duration-300 flex flex-col relative h-full">
      
      {/* Badges (Mobile-proportioned) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 pointer-events-none max-w-[70%]">
        {isOutOfStock ? (
          <span className="bg-rose-900 text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm flex items-center gap-1 w-fit">
            <Ban className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> OUT OF STOCK
          </span>
        ) : (
          <>
            {pricing.hasPromo ? (
              <span className="bg-gradient-to-r from-rose-700 via-brand-rose to-rose-800 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-soft-rose border border-rose-400/30 flex items-center gap-1 w-fit">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-gold animate-pulse" />
                SALE -{pricing.discountPercent}%
              </span>
            ) : (
              <>
                {product.isNew && (
                  <span className="bg-stone-900 text-white text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm w-fit">
                    NEW
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-brand-rose text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm w-fit">
                    -{discountPercent}% OFF
                  </span>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Wishlist Button (Enlarged hit target for touch accessibility) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-brand-rose text-white shadow-md scale-105'
            : 'bg-white/85 backdrop-blur-md text-stone-600 hover:text-brand-rose hover:bg-white shadow-sm'
        }`}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container with Uncropped Full View & Hover Secondary Photo Swap */}
      <div 
        onClick={() => navigateTo('product', product.id)}
        className="relative aspect-square overflow-hidden bg-gradient-to-b from-stone-50 via-brand-cream/30 to-white p-2.5 sm:p-4 cursor-pointer group flex items-center justify-center border-b border-stone-100"
      >
        {/* Photo Count Indicator (Desktop) */}
        {product.images && product.images.length > 1 && (
          <div className="absolute top-3 right-14 z-10 bg-stone-900/70 backdrop-blur-md text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            {product.images.length} Views
          </div>
        )}

        {/* Primary Image (Uncropped) */}
        <img
          src={product.images?.[0] || '/logo.png'}
          alt={`${product.title} - Handcrafted ${product.category} by Ella Creations`}
          loading="lazy"
          className={`w-full h-full object-contain object-center transition-all duration-500 ease-in-out ${
            product.images && product.images.length > 1 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
          } ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
        />

        {/* Secondary Hover Image (Uncropped, Desktop) */}
        {product.images && product.images.length > 1 && (
          <img
            src={product.images[1]}
            alt={`${product.title} - ${product.category} detailed view | Ella Creations`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-contain object-center p-2.5 sm:p-4 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out hidden sm:block ${
              isOutOfStock ? 'opacity-60 grayscale' : ''
            }`}
          />
        )}

        {/* Desktop-Only Hover Quick Actions */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-10 h-10 rounded-full bg-white text-stone-800 flex items-center justify-center shadow-lg hover:bg-brand-rose hover:text-white transition-all transform hover:scale-110"
            title="Quick View"
            aria-label="Quick View Product"
          >
            <Eye className="w-5 h-5" />
          </button>

          {!isOutOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-lg hover:bg-stone-900 transition-all transform hover:scale-110"
              title="Add to Cart"
              aria-label="Add product to cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Category & Stone */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 font-medium mb-1 gap-1 truncate">
            <span className="uppercase tracking-wider text-brand-gold font-semibold truncate">{product.category}</span>
            {product.stoneType ? <span className="truncate opacity-75">{product.stoneType}</span> : null}
          </div>

          {/* Title */}
          <h3 
            onClick={() => navigateTo('product', product.id)}
            className="font-serif text-xs sm:text-sm md:text-base font-semibold text-stone-900 line-clamp-1 hover:text-brand-rose cursor-pointer transition-colors leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
          <div className="min-w-0 flex-1">
            {isOutOfStock ? (
              <span className="text-[10px] sm:text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 sm:px-2 py-0.5 rounded inline-block">
                OUT OF STOCK
              </span>
            ) : (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className={`text-xs sm:text-sm md:text-base font-bold ${pricing.hasPromo ? 'text-brand-rose' : 'text-stone-900'}`}>
                  {formatPrice(pricing.finalPrice)}
                </span>
                {pricing.hasPromo ? (
                  <span className="text-[10px] sm:text-xs line-through text-stone-400 font-normal">
                    {formatPrice(pricing.originalPrice)}
                  </span>
                ) : (
                  product.comparePrice && (
                    <span className="text-[10px] sm:text-xs line-through text-stone-400 font-normal">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Action Button: Touch Quick-Add on Mobile, View Details on Desktop */}
          {!isOutOfStock ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-brand-rose/10 hover:bg-brand-rose text-brand-rose hover:text-white transition-all flex items-center gap-1 text-[11px] font-semibold flex-shrink-0"
              title="Add to Shopping Bag"
              aria-label={`Add ${product.title} to bag`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Add</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('product', product.id)}
              className="text-[11px] font-semibold text-stone-400 hover:text-stone-700 transition-colors flex items-center gap-0.5 flex-shrink-0"
            >
              Details
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
