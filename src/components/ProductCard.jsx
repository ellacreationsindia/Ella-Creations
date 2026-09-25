import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingBag, Sparkles, Ban, Share2, Check } from 'lucide-react';
import { useStore, formatPrice, getProductSlug } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    navigateTo, 
    setQuickViewProduct,
    getProductPricing,
    getProductUrl,
    showToast
  } = useStore();

  const [justShared, setJustShared] = useState(false);

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

  const productPath = `/product/${getProductSlug(product)}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-brand-gold/20 shadow-sm hover:shadow-soft-rose transition-all duration-300 flex flex-col relative h-full">
      
      {/* Badges (Mobile-proportioned, larger on desktop) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 lg:top-4 lg:left-4 z-10 flex flex-col gap-1 pointer-events-none max-w-[70%]">
        {isOutOfStock ? (
          <span className="bg-rose-900 text-white text-[9px] sm:text-[10px] lg:text-xs uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1.5 rounded-full shadow-sm flex items-center gap-1 w-fit">
            <Ban className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" /> OUT OF STOCK
          </span>
        ) : (
          <>
            {pricing.hasPromo ? (
              <span className="bg-gradient-to-r from-rose-700 via-brand-rose to-rose-800 text-white text-[9px] sm:text-[10px] lg:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1.5 rounded-full shadow-soft-rose border border-rose-400/30 flex items-center gap-1 w-fit">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-brand-gold animate-pulse" />
                SALE -{pricing.discountPercent}%
              </span>
            ) : (
              <>
                {product.isNew && (
                  <span className="bg-stone-900 text-white text-[9px] sm:text-[10px] lg:text-xs uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1.5 rounded-full shadow-sm w-fit">
                    NEW
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-brand-rose text-white text-[9px] sm:text-[10px] lg:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1.5 rounded-full shadow-sm w-fit">
                    -{discountPercent}% OFF
                  </span>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Wishlist Button (Enlarged hit target for touch accessibility, larger on desktop) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 lg:top-4 lg:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-brand-rose text-white shadow-md scale-105'
            : 'bg-white/85 backdrop-blur-md text-stone-600 hover:text-brand-rose hover:bg-white shadow-sm'
        }`}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Quick Share Button */}
      <button
        onClick={async (e) => {
          e.stopPropagation();
          const shareUrl = getProductUrl ? getProductUrl(product) : window.location.href;
          if (navigator.share) {
            try {
              await navigator.share({
                title: `${product.title} | Ella Creations`,
                text: `Explore this piece from Ella Creations: ${product.title}`,
                url: shareUrl
              });
              return;
            } catch (err) {
              if (err.name === 'AbortError') return;
            }
          }
          try {
            await navigator.clipboard.writeText(shareUrl);
            setJustShared(true);
            showToast?.('Product link copied to clipboard!', 'success');
            setTimeout(() => setJustShared(false), 2000);
          } catch (err) {
            console.warn(err);
          }
        }}
        className={`absolute top-11 sm:top-13 lg:top-15 right-2.5 sm:right-3 lg:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          justShared
            ? 'bg-stone-900 text-brand-gold shadow-md scale-105'
            : 'bg-white/85 backdrop-blur-md text-stone-600 hover:text-brand-gold hover:bg-white shadow-sm'
        }`}
        title="Share piece"
        aria-label="Share piece"
      >
        {justShared ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold" /> : <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-4.5 lg:h-4.5" />}
      </button>

      {/* Image Container with Uncropped Full View & Hover Secondary Photo Swap */}
      <a 
        href={productPath}
        onClick={(e) => {
          e.preventDefault();
          navigateTo('product', product.id);
        }}
        className="relative aspect-square overflow-hidden bg-gradient-to-b from-stone-50 via-brand-cream/30 to-white p-2.5 sm:p-4 lg:p-6 cursor-pointer group flex items-center justify-center border-b border-stone-100 block"
      >
        {/* Photo Count Indicator (Desktop) */}
        {product.images && product.images.length > 1 && (
          <div className="absolute top-3 right-14 lg:right-16 z-10 bg-stone-900/70 backdrop-blur-md text-brand-gold text-[10px] lg:text-xs font-bold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
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
            className={`absolute inset-0 w-full h-full object-contain object-center p-2.5 sm:p-4 lg:p-6 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out hidden sm:block ${
              isOutOfStock ? 'opacity-60 grayscale' : ''
            }`}
          />
        )}

        {/* Desktop-Only Hover Quick Actions */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-3 lg:gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white text-stone-800 flex items-center justify-center shadow-lg hover:bg-brand-rose hover:text-white transition-all transform hover:scale-110"
            title="Quick View"
            aria-label="Quick View Product"
          >
            <Eye className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {!isOutOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-lg hover:bg-stone-900 transition-all transform hover:scale-110"
              title="Add to Cart"
              aria-label="Add product to cart"
            >
              <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          )}
        </div>
      </a>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 lg:space-y-4">
        <div>
          {/* Category & Stone */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] lg:text-xs text-stone-500 font-medium mb-1 gap-1 truncate">
            <span className="uppercase tracking-wider text-brand-gold font-semibold truncate">{product.category}</span>
            {product.stoneType ? <span className="truncate opacity-75">{product.stoneType}</span> : null}
          </div>

          {/* Title */}
          <h3 
            className="font-serif text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-stone-900 line-clamp-1 lg:line-clamp-2 leading-snug"
            title={product.title}
          >
            <a 
              href={productPath}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('product', product.id);
              }}
              className="hover:text-brand-rose transition-colors"
            >
              {product.title}
            </a>
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 lg:mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 ${
                    i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs lg:text-sm text-stone-500 font-medium">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 lg:pt-3 border-t border-stone-100 flex items-center justify-between gap-1">
          <div className="min-w-0 flex-1">
            {isOutOfStock ? (
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 sm:px-2 py-0.5 rounded inline-block">
                OUT OF STOCK
              </span>
            ) : (
              <div className="flex items-baseline gap-1.5 lg:gap-2 flex-wrap">
                <span className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${pricing.hasPromo ? 'text-brand-rose' : 'text-stone-900'}`}>
                  {formatPrice(pricing.finalPrice)}
                </span>
                {pricing.hasPromo ? (
                  <span className="text-[10px] sm:text-xs lg:text-sm line-through text-stone-400 font-normal">
                    {formatPrice(pricing.originalPrice)}
                  </span>
                ) : (
                  product.comparePrice && (
                    <span className="text-[10px] sm:text-xs lg:text-sm line-through text-stone-400 font-normal">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Action Button: Touch Quick-Add on Mobile, View Details / Add on Desktop */}
          {!isOutOfStock ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl bg-brand-rose/10 hover:bg-brand-rose text-brand-rose hover:text-white transition-all flex items-center gap-1.5 text-[11px] lg:text-xs font-semibold flex-shrink-0 cursor-pointer shadow-xs"
              title="Add to Shopping Bag"
              aria-label={`Add ${product.title} to bag`}
            >
              <ShoppingBag className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              <span className="hidden md:inline">Add to Bag</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('product', product.id)}
              className="text-[11px] lg:text-xs font-semibold text-stone-400 hover:text-stone-700 transition-colors flex items-center gap-0.5 flex-shrink-0 cursor-pointer"
            >
              Details
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
