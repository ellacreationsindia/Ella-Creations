import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Grid, List, Search, Sparkles, RefreshCw, X, Check, Tag, Eye, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import { isProductInCampaign } from '../utils/pricing';
import ProductCard from '../components/ProductCard';

export default function ShopView() {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory,
    activePromotions = [],
    activePopupCampaign,
    recentlyViewed
  } = useStore();

  // Detailed & Relevant Jewelry Filters
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedPolish, setSelectedPolish] = useState('All');
  const [selectedStone, setSelectedStone] = useState('All');
  const [priceBucket, setPriceBucket] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [shopSearch, setShopSearch] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lock background scroll when mobile filter sheet is open
  React.useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  const MIN_LIMIT = 0;
  const MAX_LIMIT = 50000;
  const STEP = 500;

  // Filter products
  let filtered = products.filter((p) => {
    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'All') {
      if (selectedCategory === 'Sale') {
        const isPromoItem = activePromotions.some(promo => isProductInCampaign(p.id, promo));
        if (!isPromoItem) return false;
      } else {
        const normSel = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normCat = (p.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const normTitle = (p.title || '').toLowerCase();
        
        if (normSel === 'necklace') {
          const match = normCat.includes('neck') || normTitle.includes('necklace') || normTitle.includes('choker') || normTitle.includes('haar');
          if (!match) return false;
        } else if (normSel === 'pendantset') {
          const match = normCat.includes('pendant') || normTitle.includes('pendant') || (normCat.includes('set') && !normTitle.includes('bridal'));
          if (!match) return false;
        } else if (normSel === 'rings') {
          const match = normCat.includes('ring') || normTitle.includes('ring');
          if (!match) return false;
        } else if (normSel === 'earring') {
          const match = normCat.includes('ear') || normTitle.includes('earring') || normTitle.includes('jhumka') || normTitle.includes('drop');
          if (!match) return false;
        } else if (normSel === 'bridalsets') {
          const match = normCat.includes('bridal') || normTitle.includes('bridal') || (normCat.includes('set') && normTitle.includes('set'));
          if (!match) return false;
        } else if (normSel.includes('bracelet') || normSel.includes('bangle')) {
          const match = normCat.includes('bracelet') || normCat.includes('bangle') || normTitle.includes('bracelet') || normTitle.includes('bangle') || normTitle.includes('cuff');
          if (!match) return false;
        } else if (normSel === 'others') {
          const isStandard = 
            normCat.includes('neck') || normTitle.includes('necklace') || normTitle.includes('choker') ||
            normCat.includes('ring') || normTitle.includes('ring') ||
            normCat.includes('ear') || normTitle.includes('earring') || normTitle.includes('jhumka') ||
            normCat.includes('bridal') || normTitle.includes('bridal') ||
            normCat.includes('bracelet') || normCat.includes('bangle');
          if (isStandard && normCat !== 'others') return false;
        } else {
          const isDirectMatch = normCat.includes(normSel) || normSel.includes(normCat) || normTitle.includes(normSel);
          if (!isDirectMatch) return false;
        }
      }
    }

    // 2. Occasion Filter
    if (selectedOccasion !== 'All') {
      const pTags = Array.isArray(p.occasionTags) ? p.occasionTags.join(' ').toLowerCase() : '';
      const pText = `${pTags} ${p.title} ${p.description || ''}`.toLowerCase();
      if (selectedOccasion === 'Bridal & Wedding') {
        if (!pText.includes('bridal') && !pText.includes('wedding') && !pText.includes('dulhan') && !pText.includes('shaadi')) return false;
      } else if (selectedOccasion === 'Festive & Sangeet') {
        if (!pText.includes('festiv') && !pText.includes('sangeet') && !pText.includes('diwali') && !pText.includes('traditional') && !pText.includes('ethnic')) return false;
      } else if (selectedOccasion === 'Cocktail & Party') {
        if (!pText.includes('cocktail') && !pText.includes('party') && !pText.includes('reception') && !pText.includes('evening') && !pText.includes('glam')) return false;
      } else if (selectedOccasion === 'Daily Wear') {
        if (!pText.includes('daily') && !pText.includes('minimal') && !pText.includes('subtle') && !pText.includes('office') && !pText.includes('everyday')) return false;
      } else if (selectedOccasion === 'Gifting') {
        if (!pText.includes('gift') && p.price > 4000) return false;
      }
    }

    // 3. Metal Polish / Finish Filter
    if (selectedPolish !== 'All') {
      const varNames = (p.variants || []).map(v => (v.name || '').toLowerCase()).join(' ');
      const pText = `${varNames} ${p.title} ${p.description || ''}`.toLowerCase();
      if (selectedPolish === 'Gold Polish') {
        if (!pText.includes('gold') || pText.includes('rose gold') || pText.includes('antique gold')) return false;
      } else if (selectedPolish === 'Rose Gold') {
        if (!pText.includes('rose gold') && !pText.includes('rose')) return false;
      } else if (selectedPolish === 'Antique Gold') {
        if (!pText.includes('antique') && !pText.includes('matte gold') && !pText.includes('temple')) return false;
      } else if (selectedPolish === 'Silver / Rhodium') {
        if (!pText.includes('silver') && !pText.includes('rhodium') && !pText.includes('white gold') && !pText.includes('platinum')) return false;
      }
    }

    // 4. Stone & Craft Filter
    if (selectedStone !== 'All') {
      const pText = `${p.stoneType || ''} ${p.title} ${p.description || ''}`.toLowerCase();
      if (selectedStone === 'Kundan & Polki') {
        if (!pText.includes('kundan') && !pText.includes('polki') && !pText.includes('jadau')) return false;
      } else if (selectedStone === 'Cubic Zirconia (CZ)') {
        if (!pText.includes('cz') && !pText.includes('cubic') && !pText.includes('zirconia') && !pText.includes('crystal') && !pText.includes('ad')) return false;
      } else if (selectedStone === 'Pearl') {
        if (!pText.includes('pearl') && !pText.includes('moti')) return false;
      } else if (selectedStone === 'Uncut Stone') {
        if (!pText.includes('uncut') && !pText.includes('raw') && !pText.includes('polki')) return false;
      }
    }

    // 5. Quick Price Bucket Filter
    if (priceBucket !== 'All') {
      if (priceBucket === 'under-1500' && p.price >= 1500) return false;
      if (priceBucket === '1500-3000' && (p.price < 1500 || p.price > 3000)) return false;
      if (priceBucket === '3000-6000' && (p.price < 3000 || p.price > 6000)) return false;
      if (priceBucket === '6000-above' && p.price < 6000) return false;
    }

    // 6. Dual Price Slider Filter
    if (p.price < minPrice || p.price > maxPrice) return false;

    // 7. Stock status
    if (inStockOnly && (p.price <= 0 || p.stock <= 0)) return false;

    // 8. Search query
    if (shopSearch.trim()) {
      const q = shopSearch.toLowerCase();
      const match = (p.title || '').toLowerCase().includes(q) || 
                    (p.category || '').toLowerCase().includes(q) || 
                    (p.stoneType || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Sort products
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'discount') {
    filtered.sort((a, b) => {
      const discA = a.comparePrice && a.comparePrice > a.price ? (a.comparePrice - a.price) : 0;
      const discB = b.comparePrice && b.comparePrice > b.price ? (b.comparePrice - b.price) : 0;
      return discB - discA;
    });
  }

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedOccasion('All');
    setSelectedPolish('All');
    setSelectedStone('All');
    setPriceBucket('All');
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setInStockOnly(false);
    setShopSearch('');
    setSortBy('featured');
  };

  const activeFilterCount = 
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedOccasion !== 'All' ? 1 : 0) +
    (selectedPolish !== 'All' ? 1 : 0) +
    (selectedStone !== 'All' ? 1 : 0) +
    (priceBucket !== 'All' ? 1 : 0) +
    (minPrice > MIN_LIMIT || maxPrice < MAX_LIMIT ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (shopSearch.trim() ? 1 : 0);

  const categories = activePromotions.length > 0 
    ? ['All', 'Sale', 'Necklace', 'Pendant Set', 'Rings', 'Earring', 'Bridal Sets', 'Bracelets/Bangles', 'Others'] 
    : ['All', 'Necklace', 'Pendant Set', 'Rings', 'Earring', 'Bridal Sets', 'Bracelets/Bangles', 'Others'];

  const occasions = ['All', 'Bridal & Wedding', 'Festive & Sangeet', 'Cocktail & Party', 'Daily Wear', 'Gifting'];
  const polishes = ['All', 'Gold Polish', 'Rose Gold', 'Antique Gold', 'Silver / Rhodium'];
  const stones = ['All', 'Kundan & Polki', 'Cubic Zirconia (CZ)', 'Pearl', 'Uncut Stone'];
  const priceBuckets = [
    { id: 'All', label: 'All Prices' },
    { id: 'under-1500', label: 'Under ₹1,500' },
    { id: '1500-3000', label: '₹1,500 - ₹3,000' },
    { id: '3000-6000', label: '₹3,000 - ₹6,000' },
    { id: '6000-above', label: '₹6,000 & Above' }
  ];

  // Recently Viewed
  const recentlyViewedProducts = (recentlyViewed || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  // Single Track Dual-Thumb Percentages
  const minPercent = Math.max(0, Math.min(100, ((minPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100));

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Search inside shop */}
      <div>
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">Search Jewelry</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, stone or craft..."
            value={shopSearch}
            onChange={(e) => setShopSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-brand-rose bg-white text-stone-800"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">Category</label>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSaleCat = cat === 'Sale';
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); }}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? (isSaleCat ? 'bg-gradient-to-r from-rose-700 to-brand-rose text-white shadow-soft-rose font-bold' : 'bg-brand-rose text-white shadow-sm font-bold')
                    : (isSaleCat ? 'text-brand-rose bg-rose-50 hover:bg-rose-100 font-bold border border-rose-200' : 'text-stone-700 hover:bg-brand-cream')
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isSaleCat && <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />}
                  <span>{isSaleCat ? 'Promotional Sale' : cat}</span>
                </div>
                {isSelected && <Sparkles className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Occasion Filter */}
      <div className="pt-2 border-t border-stone-100">
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">Occasion & Style</label>
        <div className="flex flex-wrap gap-1.5">
          {occasions.map((occ) => (
            <button
              key={occ}
              onClick={() => setSelectedOccasion(occ)}
              className={`text-[11px] px-2.5 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                selectedOccasion === occ
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm font-bold'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Polish / Finish Filter */}
      <div className="pt-2 border-t border-stone-100">
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">Metal Polish / Finish</label>
        <div className="flex flex-wrap gap-1.5">
          {polishes.map((pol) => (
            <button
              key={pol}
              onClick={() => setSelectedPolish(pol)}
              className={`text-[11px] px-2.5 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                selectedPolish === pol
                  ? 'bg-brand-rose text-white border-brand-rose shadow-sm font-bold'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {pol}
            </button>
          ))}
        </div>
      </div>

      {/* Stone / Craft Filter */}
      <div className="pt-2 border-t border-stone-100">
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">Stone & Craft</label>
        <div className="flex flex-wrap gap-1.5">
          {stones.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStone(st)}
              className={`text-[11px] px-2.5 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                selectedStone === st
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm font-bold'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Price Quick Buckets */}
      <div className="pt-2 border-t border-stone-100">
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">Price Budget</label>
        <div className="grid grid-cols-2 gap-1.5">
          {priceBuckets.map((bucket) => (
            <button
              key={bucket.id}
              onClick={() => setPriceBucket(bucket.id)}
              className={`text-[11px] px-2.5 py-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                priceBucket === bucket.id
                  ? 'bg-brand-gold text-stone-900 border-brand-gold font-bold shadow-xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {bucket.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Price Range Slider (Minimum & Maximum on Single Bar) */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <div className="flex justify-between items-center text-xs font-semibold text-stone-800">
          <span className="uppercase tracking-wider">Custom Price Range</span>
          <span className="text-brand-rose font-bold font-mono bg-brand-cream px-2 py-0.5 rounded border border-brand-gold/30">
            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </span>
        </div>
        
        {/* Single Track Container */}
        <div className="relative w-full pt-4 pb-2 select-none">
          <div className="relative h-2 w-full rounded-full bg-stone-200">
            <div
              className="absolute h-full rounded-full bg-brand-rose"
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`
              }}
            />
          </div>

          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step={STEP}
            value={minPrice}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), maxPrice - STEP);
              setMinPrice(val);
            }}
            className="dual-range-input absolute top-2.5 left-0 w-full appearance-none bg-transparent pointer-events-none"
            style={{ zIndex: minPrice > MAX_LIMIT - 5000 ? 50 : 30 }}
          />

          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step={STEP}
            value={maxPrice}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), minPrice + STEP);
              setMaxPrice(val);
            }}
            className="dual-range-input absolute top-2.5 left-0 w-full appearance-none bg-transparent pointer-events-none z-40"
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono">
          <span>{formatPrice(MIN_LIMIT)}</span>
          <span>{formatPrice(MAX_LIMIT)}</span>
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-800 uppercase tracking-wider">In Stock Only</span>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="accent-brand-rose w-4 h-4 rounded cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Shop Header Banner */}
      {selectedCategory === 'Sale' ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-950 via-rose-950 to-stone-900 text-white p-6 sm:p-10 border border-brand-gold/40 shadow-xl">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-rose/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-rose-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{activePopupCampaign?.name || 'Festive Seasonal Sale'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>FLAT {activePopupCampaign?.discount_percentage || 50}% OFF</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-brand-cream">
                {activePopupCampaign?.headline || 'Exclusive Promotional Jewelry Sale'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {activePopupCampaign?.description || 'Celebrate with our handcrafted artificial fine jewelry at exclusive celebratory pricing. Hand-set Kundan, Cubic Zirconia, and bridal heirlooms with complimentary insured dispatch across India.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-widest">Promotion Items</span>
                <span className="font-serif text-2xl font-bold text-white">{filtered.length} Curated Pieces</span>
              </div>
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs text-stone-300 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                View all jewelry catalog &rarr;
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {activePopupCampaign && (
            <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white px-4 py-3 rounded-2xl border border-brand-gold/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5 text-xs text-center sm:text-left">
                <Sparkles className="w-4 h-4 text-brand-gold shrink-0 animate-pulse" />
                <span>
                  <strong className="text-amber-200">{activePopupCampaign.headline}</strong> — Limited-time promotional discounts applied on selected items.
                </span>
              </div>
              <button
                onClick={() => setSelectedCategory('Sale')}
                className="bg-brand-rose hover:bg-rose-700 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-sm shrink-0 transition-colors cursor-pointer"
              >
                Shop {activePopupCampaign.discount_percentage}% OFF Sale &rarr;
              </button>
            </div>
          )}

          <div className="bg-gradient-to-r from-brand-sand via-brand-cream to-brand-pink/30 p-6 sm:p-8 rounded-3xl border border-brand-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-sm">
            <div>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-brand-gold">Ella Creations Catalog</span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
                {selectedCategory && selectedCategory !== 'All' 
                  ? `${selectedCategory} Collection - Handcrafted Artificial Jewelry` 
                  : 'Artificial Fine Jewelry Collection'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {selectedCategory && selectedCategory !== 'All'
                  ? `Explore our curated selection of handcrafted ${selectedCategory.toLowerCase()} with gold finish and AAA+ crystals.`
                  : 'Handcrafted Kundan, Cubic Zirconia drops, Rose Gold & Sterling Silver creations with express shipping across India.'}
              </p>
            </div>
            <div className="flex items-center gap-2.5 bg-white/80 px-3.5 py-2 rounded-2xl border border-brand-gold/40 shadow-sm self-start md:self-auto">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-semibold text-stone-800">{filtered.length} Items Available</span>
            </div>
          </div>
        </>
      )}

      {/* Mobile Sticky Filter Sub-Bar & Quick Swipe Category Pills */}
      <div className="lg:hidden sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md -mx-4 px-3 sm:px-4 py-2.5 border-y border-brand-gold/30 shadow-md space-y-2">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-900 bg-brand-cream hover:bg-brand-sand px-3 py-2 rounded-xl border border-brand-gold/40 flex-1 justify-center transition-all cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-rose shrink-0" />
            <span>All Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-rose text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-xl border border-stone-200 bg-stone-50 font-medium outline-none text-stone-800 cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Biggest Deals</option>
            </select>
          </div>

          <span className="text-[11px] font-bold text-brand-rose whitespace-nowrap bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200 shrink-0">
            {filtered.length} items
          </span>
        </div>

        {/* Quick Horizontal Scrollable Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            const isSale = cat === 'Sale';
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all shrink-0 cursor-pointer ${
                  isSel
                    ? (isSale ? 'bg-gradient-to-r from-rose-700 to-brand-rose text-white shadow-xs font-bold' : 'bg-stone-900 text-white font-bold')
                    : (isSale ? 'bg-rose-50 text-brand-rose border border-rose-200 font-bold' : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200')
                }`}
              >
                {isSale ? '🔥 Sale' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Chips / Badges Row (1-Tap Clear) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">Active:</span>
          
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs bg-brand-rose/10 text-brand-rose border border-brand-rose/30 px-2.5 py-1 rounded-full font-medium">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} className="hover:text-stone-900 ml-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedOccasion !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 border border-stone-300 px-2.5 py-1 rounded-full font-medium">
              Occasion: {selectedOccasion}
              <button onClick={() => setSelectedOccasion('All')} className="hover:text-rose-600 ml-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedPolish !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full font-medium">
              Finish: {selectedPolish}
              <button onClick={() => setSelectedPolish('All')} className="hover:text-rose-600 ml-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedStone !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-full font-medium">
              Stone: {selectedStone}
              <button onClick={() => setSelectedStone('All')} className="hover:text-rose-600 ml-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          {priceBucket !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full font-medium">
              Budget: {priceBuckets.find(b => b.id === priceBucket)?.label}
              <button onClick={() => setPriceBucket('All')} className="hover:text-rose-600 ml-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full font-medium">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-rose-600 ml-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          {shopSearch.trim() && (
            <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 border border-stone-300 px-2.5 py-1 rounded-full font-medium">
              "{shopSearch}"
              <button onClick={() => setShopSearch('')} className="hover:text-rose-600 ml-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-stone-500 hover:text-brand-rose underline underline-offset-2 ml-auto font-semibold cursor-pointer"
          >
            Clear All ({activeFilterCount})
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Desktop Sticky Sidebar Filter */}
        <div className="lg:w-64 lg:sticky lg:top-24 z-20 space-y-6 flex-shrink-0 bg-white p-6 rounded-3xl border border-brand-gold/20 shadow-sm max-h-[calc(100vh-7rem)] overflow-y-auto hidden lg:block">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-rose" /> Filter Jewelry
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-stone-500 hover:text-brand-rose flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {renderFilterContent()}
        </div>

        {/* Mobile Slide-Up Filter Drawer / Bottom Sheet */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col w-full shadow-2xl border-t border-brand-gold/30">
              
              {/* Drawer Header */}
              <div className="p-4 px-6 border-b border-stone-100 flex items-center justify-between bg-brand-cream/60 rounded-t-3xl">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-rose" />
                  <h3 className="font-serif text-base font-bold text-stone-900">Filter & Refine Catalog</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-stone-500 hover:text-brand-rose flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Drawer Body (Scrollable Filters) */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {renderFilterContent()}
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 px-6 border-t border-stone-200 bg-white safe-pb">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-soft-rose cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Show {filtered.length} Matching Pieces
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Main Product Catalog Grid Column */}
        <div className="flex-1 space-y-6 w-full">
          
          {/* Top Bar Sort & View Layout Controls */}
          <div className="bg-white p-4 rounded-2xl border border-brand-gold/20 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs font-medium text-stone-600">
              Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> items
            </span>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600 uppercase">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-xl border border-stone-300 outline-none focus:border-brand-rose bg-white font-medium cursor-pointer"
                >
                  <option value="featured">Featured Items</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-brand-rose text-white' : 'text-stone-600 hover:text-stone-900'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-brand-rose text-white' : 'text-stone-600 hover:text-stone-900'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-stone-200">
              <div className="w-16 h-16 rounded-full bg-brand-cream mx-auto flex items-center justify-center text-brand-rose">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-800">No matching jewelry found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your price range or filter options to view available pieces.
              </p>
              <button
                onClick={resetFilters}
                className="bg-brand-rose text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-brand-rose/90 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6" : "space-y-4"}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Recently Viewed Jewelry Section */}
      {recentlyViewedProducts.length > 0 && (
        <section className="pt-10 border-t border-brand-gold/30 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-rose" />
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">Recently Viewed by You</h3>
                <p className="text-xs text-stone-500">Curated pieces you explored earlier</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
