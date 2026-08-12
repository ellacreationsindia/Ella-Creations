import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Grid, List, Search, Sparkles, RefreshCw, X, Check } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function ShopView() {
  const { products, selectedCategory, setSelectedCategory } = useStore();

  const [selectedStone, setSelectedStone] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [shopSearch, setShopSearch] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const MIN_LIMIT = 0;
  const MAX_LIMIT = 50000;
  const STEP = 500;

  // Filter products
  let filtered = products.filter((p) => {
    if (selectedCategory && selectedCategory !== 'All') {
      const normSel = selectedCategory.toLowerCase().trim();
      const normCat = (p.category || '').toLowerCase().trim();
      
      const isSetMatch = (normSel.includes('set') || normSel.includes('bridal')) && (normCat.includes('set') || normCat.includes('bridal'));
      const isDirectMatch = normCat === normSel || normCat.includes(normSel) || normSel.includes(normCat);
      
      if (!isSetMatch && !isDirectMatch) return false;
    }
    if (selectedStone !== 'All' && !p.stoneType.toLowerCase().includes(selectedStone.toLowerCase())) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (inStockOnly && (p.price <= 0 || p.stock <= 0)) return false;
    if (shopSearch.trim() && !p.title.toLowerCase().includes(shopSearch.toLowerCase())) return false;
    return true;
  });

  // Sort products
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedStone('All');
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setInStockOnly(false);
    setShopSearch('');
    setSortBy('featured');
  };

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) +
    (selectedStone !== 'All' ? 1 : 0) +
    (minPrice > MIN_LIMIT || maxPrice < MAX_LIMIT ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (shopSearch.trim() ? 1 : 0);

  const categories = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Sets'];
  const stones = ['All', 'Kundan', 'Cubic Zirconia', 'Pearl', 'Uncut'];

  // Single Track Dual-Thumb Percentages
  const minPercent = Math.max(0, Math.min(100, ((minPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100));

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Search inside shop */}
      <div>
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">Search Catalog</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Title or keyword..."
            value={shopSearch}
            onChange={(e) => setShopSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-brand-rose bg-white"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">Category</label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); }}
              className={`w-full text-left text-xs px-3 py-2 rounded-xl font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat ? 'bg-brand-rose text-white shadow-sm font-bold' : 'text-stone-700 hover:bg-brand-cream'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Sparkles className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Stone / Gemstone Filter */}
      <div>
        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">Stone Type</label>
        <div className="flex flex-wrap gap-1.5">
          {stones.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStone(st)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                selectedStone === st
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Price Range Slider (Minimum & Maximum on Single Bar) */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <div className="flex justify-between items-center text-xs font-semibold text-stone-800">
          <span className="uppercase tracking-wider">Price Range</span>
          <span className="text-brand-rose font-bold font-mono bg-brand-cream px-2 py-0.5 rounded border border-brand-gold/30">
            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </span>
        </div>
        
        {/* Single Track Container */}
        <div className="relative w-full pt-4 pb-2 select-none">
          {/* Background Track */}
          <div className="relative h-2 w-full rounded-full bg-stone-200">
            {/* Colored Active Highlight Track */}
            <div
              className="absolute h-full rounded-full bg-brand-rose"
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`
              }}
            />
          </div>

          {/* Both Min and Max Knobs on the Same Slider */}
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
      <div className="bg-gradient-to-r from-brand-sand via-brand-cream to-brand-pink/30 p-6 sm:p-8 rounded-3xl border border-brand-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-sm">
        <div>
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-brand-gold">Ella Creations Catalog</span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">Artificial Jewelry Collection</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">Handcrafted Kundan, Cubic Zirconia drops, Rose Gold & Sterling Silver creations.</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white/80 px-3.5 py-2 rounded-2xl border border-brand-gold/40 shadow-sm self-start md:self-auto">
          <Sparkles className="w-4 h-4 text-brand-gold" />
          <span className="text-xs font-semibold text-stone-800">{filtered.length} Items Available</span>
        </div>
      </div>

      {/* Mobile Sticky Filter Trigger Bar */}
      <div className="lg:hidden sticky top-20 z-30 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-brand-gold/30 shadow-md">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-stone-900 bg-brand-cream hover:bg-brand-sand px-4 py-2.5 rounded-xl border border-brand-gold/40 flex-1 justify-center transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-rose" />
          Filter & Refine Jewelry
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-rose text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <span className="text-xs font-semibold text-stone-600 px-2">{filtered.length} Results</span>
      </div>

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
              <div className="p-4 px-6 border-t border-stone-200 bg-white">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-soft-rose"
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
                className="bg-brand-rose text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-brand-rose/90 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
