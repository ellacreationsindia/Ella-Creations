import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Grid, List, Search, Sparkles, RefreshCw } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function ShopView() {
  const { products } = useStore();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFinish, setSelectedFinish] = useState('All');
  const [selectedStone, setSelectedStone] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [shopSearch, setShopSearch] = useState('');

  // Filter products
  let filtered = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedFinish !== 'All' && (!p.finishOptions || !p.finishOptions.includes(selectedFinish))) return false;
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
    setSelectedFinish('All');
    setSelectedStone('All');
    setMinPrice(0);
    setMaxPrice(50000);
    setInStockOnly(false);
    setShopSearch('');
    setSortBy('featured');
  };

  const categories = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Sets'];
  const finishes = ['All', 'Rose Gold', 'Gold', 'Silver', 'Antique Gold'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Shop Header Banner */}
      <div className="bg-gradient-to-r from-brand-sand via-brand-cream to-brand-pink/30 p-8 rounded-3xl border border-brand-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Ella Creations Catalog</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">Artificial Jewelry Collection</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">Handcrafted Kundan, Cubic Zirconia drops, Rose Gold & Sterling Silver creations.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-2xl border border-brand-gold/40 shadow-sm">
          <Sparkles className="w-5 h-5 text-brand-gold" />
          <span className="text-xs font-semibold text-stone-800">{filtered.length} Jewelry Items Available</span>
        </div>
      </div>

      {/* Filter & Toolbar Row */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6 flex-shrink-0 bg-white p-6 rounded-2xl border border-brand-gold/20 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-rose" /> Filter Jewelry
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-stone-500 hover:text-brand-rose flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search inside shop */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">Search Catalog</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title or keyword..."
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-brand-rose"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">Category</label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat ? 'bg-brand-rose text-white shadow-sm' : 'text-stone-700 hover:bg-brand-cream'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Sparkles className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Metal Finish Filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2.5">Metal Finish</label>
            <div className="flex flex-wrap gap-1.5">
              {finishes.map((finish) => (
                <button
                  key={finish}
                  onClick={() => setSelectedFinish(finish)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                    selectedFinish === finish
                      ? 'border-brand-rose bg-brand-rose text-white'
                      : 'border-stone-200 text-stone-700 hover:border-brand-rose'
                  }`}
                >
                  {finish}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Price Range Sliders (Minimum & Maximum) */}
          <div className="space-y-3 pt-1 border-t border-stone-100">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-800">
              <span className="uppercase tracking-wider">Price Range:</span>
              <span className="text-brand-rose font-bold">{formatPrice(minPrice)} - {formatPrice(maxPrice)}</span>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">Minimum Price: {formatPrice(minPrice)}</label>
                <input
                  type="range"
                  min="0"
                  max="45000"
                  step="500"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 500))}
                  className="w-full accent-brand-rose cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">Maximum Price: {formatPrice(maxPrice)}</label>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 500))}
                  className="w-full accent-brand-rose cursor-pointer"
                />
              </div>
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

        {/* Main Product Grid Column */}
        <div className="flex-1 space-y-6">
          
          {/* Top Bar Sort & Layout Controls */}
          <div className="bg-white p-4 rounded-2xl border border-brand-gold/20 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs font-medium text-stone-600">
              Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> items
            </span>

            <div className="flex items-center gap-4">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600 uppercase">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 outline-none focus:border-brand-rose bg-white font-medium"
                >
                  <option value="featured">Featured Items</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
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

          {/* Product Cards Container */}
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
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
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
