import React from 'react';
import { Sparkles, ArrowLeft, ShoppingBag, Search, Home } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function NotFoundView() {
  const { navigateTo } = useStore();

  const categories = [
    { title: 'Necklace', cat: 'Necklace' },
    { title: 'Pendant Set', cat: 'Pendant Set' },
    { title: 'Rings', cat: 'Rings' },
    { title: 'Earrings', cat: 'Earring' },
    { title: 'Bridal Sets', cat: 'Bridal Sets' },
    { title: 'Bracelets', cat: 'Bracelets/Bangles' },
    { title: 'Others', cat: 'Others' }
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SEOHead
        title="404: Page Not Found | Ella Creations India"
        description="The jewelry piece or page you are looking for cannot be found. Explore our fine handcrafted artificial Kundan, CZ and bridal jewelry collections."
      />

      <div className="max-w-xl w-full text-center space-y-6 sm:space-y-8 bg-white/90 backdrop-blur-md p-6 sm:p-12 rounded-3xl border border-brand-gold/30 shadow-xl relative overflow-hidden">
        
        {/* Background Sparkles */}
        <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
          <Sparkles className="w-40 h-40 text-brand-gold" />
        </div>
        <div className="absolute -bottom-10 -left-10 opacity-10 pointer-events-none">
          <Sparkles className="w-40 h-40 text-brand-rose" />
        </div>

        {/* 404 Emblem Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-cream border border-brand-gold/40 text-[11px] font-bold uppercase tracking-widest text-brand-gold">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>Error 404 • Missing Splendor</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-2">
          <h1 className="font-serif text-5xl sm:text-7xl font-bold text-stone-900 tracking-tight">
            4<span className="text-brand-rose">0</span>4
          </h1>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-800">
            This Jewelry Piece Could Not Be Found
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            The page or piece you are seeking may have been renamed, archived, or is momentarily hidden in our royal vaults.
          </p>
        </div>

        {/* Gold Divider */}
        <div className="gold-divider max-w-xs mx-auto my-2 sm:my-4">
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-full shadow-soft-rose transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider min-h-[44px]"
          >
            <Home className="w-4 h-4" /> Return to Storefront
          </button>

          <button
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-brand-cream font-semibold py-3 sm:py-3.5 px-6 rounded-full shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4 text-brand-gold" /> Explore All Jewelry
          </button>
        </div>

        {/* Quick Category Suggestions */}
        <div className="pt-4 border-t border-stone-100 space-y-2.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Popular Collections
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((c) => (
              <button
                key={c.cat}
                onClick={() => navigateTo('shop', null, c.cat)}
                className="text-xs px-3 py-1 rounded-full bg-brand-cream hover:bg-brand-rose/15 text-stone-700 hover:text-brand-rose border border-brand-gold/30 transition-colors"
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
