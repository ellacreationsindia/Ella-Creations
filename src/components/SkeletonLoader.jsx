import React from 'react';
import { Sparkles, Crown } from 'lucide-react';

/**
 * Luxury Royal Throbber
 * High-performance, GPU-accelerated animated jewelry throbber with gold & rose gold accents.
 */
export function Throbber({ size = 'md', text = null, className = '' }) {
  const sizeMap = {
    sm: { container: 'w-8 h-8', outer: 'w-8 h-8', inner: 'w-5 h-5', icon: 'w-3 h-3', textSize: 'text-[10px]' },
    md: { container: 'w-14 h-14', outer: 'w-14 h-14', inner: 'w-9 h-9', icon: 'w-5 h-5', textSize: 'text-xs' },
    lg: { container: 'w-20 h-20', outer: 'w-20 h-20', inner: 'w-12 h-12', icon: 'w-7 h-7', textSize: 'text-sm' }
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div 
      role="status" 
      aria-live="polite" 
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className={`relative ${s.container} flex items-center justify-center`}>
        {/* Outer Rotating Gold Ring */}
        <div 
          className={`absolute inset-0 rounded-full border-2 border-transparent border-t-brand-gold border-r-brand-gold/60 animate-spin`}
          style={{ animationDuration: '1.2s' }}
        />
        
        {/* Middle Counter-rotating Rose Ring */}
        <div 
          className={`absolute ${s.inner} rounded-full border-2 border-transparent border-b-brand-rose border-l-brand-rose/60 animate-spin`}
          style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
        />

        {/* Center Pulsing Sparkle Emblem */}
        <div className="relative z-10 animate-pulse text-brand-gold flex items-center justify-center">
          <Sparkles className={`${s.icon} drop-shadow-[0_0_8px_rgba(207,164,92,0.6)]`} />
        </div>

        {/* Ambient Halo Glow */}
        <div className="absolute inset-0 rounded-full bg-brand-gold/10 filter blur-md animate-pulse pointer-events-none" />
      </div>

      {text && (
        <div className="flex items-center gap-1.5 text-stone-600 font-serif tracking-wider uppercase">
          <span className={`${s.textSize} font-medium tracking-widest`}>{text}</span>
        </div>
      )}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

/**
 * ProductCardSkeleton
 * Shimmering luxury placeholder replicating the exact dimensions of ProductCard.
 */
export function ProductCardSkeleton() {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-brand-gold/20 shadow-sm flex flex-col p-3 space-y-3 relative select-none animate-pulse"
      aria-hidden="true"
    >
      {/* Product Image Box */}
      <div className="aspect-square w-full rounded-xl skeleton-shimmer relative overflow-hidden" />

      {/* Category & Badge Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 w-16 rounded-full skeleton-shimmer" />
        <div className="h-3 w-10 rounded-full skeleton-shimmer" />
      </div>

      {/* Product Title */}
      <div className="space-y-1.5">
        <div className="h-4 w-5/6 rounded-md skeleton-shimmer" />
        <div className="h-3.5 w-1/2 rounded-md skeleton-shimmer" />
      </div>

      {/* Star Ratings */}
      <div className="flex items-center gap-1 pt-0.5">
        <div className="h-3 w-20 rounded-md skeleton-shimmer" />
        <div className="h-3 w-6 rounded-md skeleton-shimmer" />
      </div>

      {/* Price & CTA Button Row */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <div className="space-y-1">
          <div className="h-5 w-16 rounded-md skeleton-shimmer" />
          <div className="h-3 w-10 rounded-md skeleton-shimmer" />
        </div>
        <div className="h-8 w-20 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}

/**
 * ProductGridSkeleton
 * Multi-card responsive product showcase grid.
 */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * ProductDetailSkeleton
 * High-fidelity placeholder for the single product view.
 */
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 animate-pulse" aria-hidden="true">
      {/* Breadcrumb shimmer */}
      <div className="h-4 w-48 rounded-md skeleton-shimmer" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Gallery Shimmer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] sm:aspect-square w-full rounded-3xl skeleton-shimmer shadow-sm" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="w-20 h-20 rounded-2xl skeleton-shimmer flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-28 rounded-full skeleton-shimmer" />
            <div className="h-8 w-4/5 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-32 rounded-md skeleton-shimmer" />
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-gold/20 space-y-3">
            <div className="h-7 w-36 rounded-lg skeleton-shimmer" />
            <div className="h-3.5 w-48 rounded-md skeleton-shimmer" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded-md skeleton-shimmer" />
            <div className="h-4 w-5/6 rounded-md skeleton-shimmer" />
            <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
          </div>

          <div className="pt-4 space-y-3">
            <div className="h-12 w-full rounded-2xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-2xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PageViewSkeleton
 * Full-page view transition skeleton featuring centered Royal Throbber.
 */
export function PageViewSkeleton({ title = 'Ella Creations Luxury Curations' }) {
  return (
    <div 
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 sm:py-24 space-y-6 text-center select-none"
      role="status"
    >
      <Throbber size="lg" text="Handcrafting Luxury..." />
      <div className="space-y-2 max-w-sm mx-auto">
        <h2 className="font-serif text-lg font-bold text-stone-800 tracking-wide">{title}</h2>
        <p className="text-xs text-stone-500 font-sans">Retrieving handcrafted pieces from our vault...</p>
      </div>
    </div>
  );
}

export default {
  Throbber,
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductDetailSkeleton,
  PageViewSkeleton
};
