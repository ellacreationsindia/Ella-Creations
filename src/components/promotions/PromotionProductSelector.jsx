import React, { useState, useMemo } from 'react';
import { Search, Check, X, Sparkles, Filter, CheckSquare, Square, Package, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../context/StoreContext';

export default function PromotionProductSelector({
  products = [],
  selectedProductIds = [],
  onChange = () => {},
  discountPercentage = 50
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'selected'

  const categories = useMemo(() => {
    const cats = new Set(['All']);
    products.forEach(p => { if (p.category) cats.add(p.category); });
    return Array.from(cats);
  }, [products]);

  // Filter products based on search term & category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (viewMode === 'selected' && !selectedProductIds.some(id => String(id) === String(p.id))) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchSku = (p.sku || '').toLowerCase().includes(q);
        const matchCategory = (p.category || '').toLowerCase().includes(q);
        const matchStone = (p.stoneType || '').toLowerCase().includes(q);
        if (!matchTitle && !matchSku && !matchCategory && !matchStone) return false;
      }
      return true;
    });
  }, [products, selectedProductIds, categoryFilter, searchTerm, viewMode]);

  const toggleSelectProduct = (id) => {
    const sId = String(id);
    const exists = selectedProductIds.some(item => String(item) === sId);
    if (exists) {
      onChange(selectedProductIds.filter(item => String(item) !== sId));
    } else {
      onChange([...selectedProductIds, id]);
    }
  };

  const selectAllFiltered = () => {
    const newIds = new Set(selectedProductIds);
    filteredProducts.forEach(p => newIds.add(p.id));
    onChange(Array.from(newIds));
  };

  const deselectAllFiltered = () => {
    const removeSet = new Set(filteredProducts.map(p => p.id));
    onChange(selectedProductIds.filter(id => !removeSet.has(id)));
  };

  const clearAllSelection = () => {
    onChange([]);
  };

  const discountVal = Number(discountPercentage) || 0;

  return (
    <div className="space-y-4">
      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-900 text-stone-200 p-4 rounded-2xl border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">Eligible Products</span>
            <span className="bg-brand-rose text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              {selectedProductIds.length} Selected
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            The {discountVal}% promotional discount will apply strictly to these items.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={selectAllFiltered}
            className="text-[11px] font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
          >
            <CheckSquare className="w-3.5 h-3.5 text-brand-gold" />
            <span>Select Filtered ({filteredProducts.length})</span>
          </button>

          {selectedProductIds.length > 0 && (
            <button
              type="button"
              onClick={clearAllSelection}
              className="text-[11px] font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer border border-rose-800/50"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, stone, category..."
            className="w-full bg-stone-900/90 text-white placeholder-stone-500 text-xs pl-9 pr-8 py-2.5 rounded-xl border border-stone-700 focus:border-brand-gold outline-none"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-stone-900/90 text-white text-xs px-3 py-2.5 rounded-xl border border-stone-700 focus:border-brand-gold outline-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div className="sm:col-span-3 flex rounded-xl overflow-hidden border border-stone-700 bg-stone-900 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'all' ? 'bg-brand-rose text-white shadow-sm' : 'text-stone-400 hover:text-white'
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('selected')}
            className={`flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'selected' ? 'bg-brand-rose text-white shadow-sm' : 'text-stone-400 hover:text-white'
            }`}
          >
            Selected ({selectedProductIds.length})
          </button>
        </div>
      </div>

      {/* Selected Products Chips Bar (Quick remove) */}
      {selectedProductIds.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap max-h-24 overflow-y-auto p-2 bg-stone-950/70 rounded-xl border border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mr-1">Selected:</span>
          {selectedProductIds.map(id => {
            const p = products.find(prod => String(prod.id) === String(id));
            return (
              <span 
                key={id} 
                className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] pl-2 pr-1.5 py-0.5 rounded-full border border-stone-700 transition-colors"
              >
                <span className="truncate max-w-[120px]">{p ? p.title : id}</span>
                <button
                  type="button"
                  onClick={() => toggleSelectProduct(id)}
                  className="w-3.5 h-3.5 rounded-full bg-stone-700 hover:bg-rose-900 text-stone-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Remove from promotion"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Product List Table / Grid */}
      <div className="max-h-80 overflow-y-auto border border-stone-800 rounded-2xl bg-stone-950 divide-y divide-stone-850">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-xs space-y-2">
            <Package className="w-8 h-8 mx-auto text-stone-600" />
            <p>No products match the active search and filter criteria.</p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setViewMode('all'); }}
                className="text-brand-gold underline cursor-pointer hover:text-white"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map(product => {
            const isSelected = selectedProductIds.some(id => String(id) === String(product.id));
            const numPrice = Number(product.price || 0);
            const discountedPrice = discountVal > 0 ? Math.round(numPrice * (1 - discountVal / 100)) : numPrice;
            const thumb = Array.isArray(product.images) && product.images[0] ? product.images[0] : '/logo.png';

            return (
              <div
                key={product.id}
                onClick={() => toggleSelectProduct(product.id)}
                className={`p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors select-none ${
                  isSelected 
                    ? 'bg-rose-950/20 hover:bg-rose-950/30' 
                    : 'hover:bg-stone-900/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    isSelected 
                      ? 'bg-brand-rose border-brand-rose text-white' 
                      : 'border-stone-700 bg-stone-900 text-transparent hover:border-stone-500'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={thumb}
                    alt=""
                    className="w-10 h-10 object-contain rounded-lg bg-stone-900 border border-stone-800 shrink-0"
                  />

                  {/* Details */}
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-stone-200 truncate">{product.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                      <span className="text-brand-gold font-medium">{product.category}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-stone-500">SKU: {product.sku || product.id}</span>
                      {product.stock <= 5 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400 font-medium">Stock: {product.stock}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price calculations */}
                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-xs font-bold text-white">
                      {isSelected && discountVal > 0 ? formatPrice(discountedPrice) : formatPrice(numPrice)}
                    </span>
                    {isSelected && discountVal > 0 && (
                      <span className="text-[10px] line-through text-stone-500">
                        {formatPrice(numPrice)}
                      </span>
                    )}
                  </div>
                  {isSelected && discountVal > 0 && (
                    <span className="text-[9px] font-bold text-brand-rose bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
                      -{discountVal}% OFF
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary footnote */}
      <div className="text-right text-[11px] text-stone-400">
        Showing {filteredProducts.length} of {products.length} catalog items
      </div>
    </div>
  );
}
