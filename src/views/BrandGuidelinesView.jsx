import React from 'react';
import { Crown, Sparkles, Palette, Type, ShieldCheck, Heart, Award, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function BrandGuidelinesView() {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-stone-800">
      <SEOHead
        title="Brand Guidelines & Heritage | Ella Creations India"
        description="Explore the brand story, design aesthetics, craftsmanship standards, and luxury visual guidelines of Ella Creations India."
      />

      {/* Hero Banner */}
      <div className="bg-stone-950 text-white rounded-3xl p-8 sm:p-12 border border-brand-gold/40 relative overflow-hidden space-y-4 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-rose/20 rounded-full blur-3xl pointer-events-none"></div>
        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-stone-400 hover:text-white flex items-center gap-1 font-semibold transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-gold flex items-center gap-2">
          <Crown className="w-4 h-4 text-brand-gold" /> Official Heritage & Visual Identity
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Ella Creations Brand Guidelines</h1>
        <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          The definitive guide to the craftsmanship, color system, typography, and luxury aesthetic standards of India's premier artificial & bridal jewelry house.
        </p>
      </div>

      {/* Brand Story */}
      <section className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-gold/20 shadow-sm space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-brand-rose">Our Essence</span>
        <h2 className="font-serif text-2xl font-bold text-stone-900">The Ella Creations Story</h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Ella Creations was founded with a singular vision: to democratize royal Indian luxury. We blend centuries-old Kundan and Meenakari metalwork with state-of-the-art 3.5 Micron Anti-Tarnish E-Coating and AAA+ Cubic Zirconia crystals.
        </p>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Every piece is designed for the modern woman who demands the regal grandeur of bridal heritage without the vulnerability of un-insured high-carat gold.
        </p>
      </section>

      {/* Brand Color Palette */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-brand-gold" />
          <h2 className="font-serif text-2xl font-bold text-stone-900">Official Color Palette</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Color 1 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="h-20 rounded-xl bg-[#8B263E] flex items-end p-2 text-white font-bold font-mono">
              #8B263E
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900">Royal Rose (Primary)</h4>
              <p className="text-stone-500 text-[11px]">Symbolizes regal passion, Indian bridal velvet, and elegance.</p>
            </div>
          </div>

          {/* Color 2 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="h-20 rounded-xl bg-[#D4AF37] flex items-end p-2 text-stone-950 font-bold font-mono">
              #D4AF37
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900">Imperial Gold (Accent)</h4>
              <p className="text-stone-500 text-[11px]">Represents handcrafted Kundan foil and 22K gold electroplating.</p>
            </div>
          </div>

          {/* Color 3 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="h-20 rounded-xl bg-[#FAF4EE] flex items-end p-2 text-stone-800 font-bold font-mono border border-stone-200">
              #FAF4EE
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900">Warm Ivory (Background)</h4>
              <p className="text-stone-500 text-[11px]">Creates a soft, warm canvas for jewelry showcase.</p>
            </div>
          </div>

          {/* Color 4 */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="h-20 rounded-xl bg-[#1C1917] flex items-end p-2 text-white font-bold font-mono">
              #1C1917
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900">Obsidian Stone (Neutral)</h4>
              <p className="text-stone-500 text-[11px]">Used for crisp typography and luxury contrast framing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Typography & Craftsmanship */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-sm space-y-4 text-xs sm:text-sm">
          <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <Type className="w-4 h-4 text-brand-rose" /> Typography Hierarchy
          </h3>
          <div className="space-y-3">
            <div className="border-b border-stone-100 pb-2">
              <span className="text-[10px] text-stone-400 font-mono uppercase block">Serif Headings (Playfair Display)</span>
              <p className="font-serif text-lg font-bold text-stone-900">Crafted for Royal Elegance</p>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-mono uppercase block">Body Font (Inter Sans-Serif)</span>
              <p className="text-stone-600">Clean, legibly modern typography for specifications, pricing, and checkout guidance.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-sm space-y-4 text-xs sm:text-sm">
          <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-gold" /> Craftsmanship Guarantee
          </h3>
          <ul className="space-y-2 text-stone-600">
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-rose flex-shrink-0 mt-0.5" />
              <span>3.5 Micron E-Coated Anti-Tarnish Finish</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-rose flex-shrink-0 mt-0.5" />
              <span>Hand-set AAA+ Cubic Zirconia & Polki Glass</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-rose flex-shrink-0 mt-0.5" />
              <span>Signature Velvet Keepsake Gift Packaging</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
