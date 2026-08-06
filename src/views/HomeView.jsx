import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Star, Award, Gift } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function HomeView() {
  const { products, navigateTo } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured);
  const newArrivals = products.filter(p => p.isNew);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-sand via-brand-cream to-brand-pink/30 py-20 lg:py-28 border-b border-brand-gold/20">
        
        {/* Background Decorative Gold Vines & Ornaments */}
        <div className="absolute top-10 right-10 opacity-15 pointer-events-none">
          <Sparkles className="w-64 h-64 text-brand-gold animate-pulse-slow" />
        </div>
        <div className="absolute bottom-5 left-5 opacity-10 pointer-events-none">
          <img src="/logo.png" alt="Watermark Logo" className="w-96 h-96 object-contain" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-brand-gold/40 text-xs font-semibold uppercase tracking-widest text-brand-gold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                Contemporary Artificial Jewelry India
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
                Timeless Beauty & <br className="hidden sm:inline" />
                <span className="rose-gradient-text">Sparkle in Every Moment</span>
              </h1>

              <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Ella Creations is crafted for the modern, confident and elegant woman. Explore our 100% anti-tarnish Kundan, Cubic Zirconia crystal drops, and 22k gold-plated statement pieces.
              </p>

              {/* Gold Divider Motif */}
              <div className="gold-divider max-w-xs mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigateTo('shop')}
                  className="w-full sm:w-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-4 px-8 rounded-full shadow-soft-rose transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  Explore Collections <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateTo('shop')}
                  className="w-full sm:w-auto bg-white/80 hover:bg-white text-stone-800 font-semibold py-4 px-8 rounded-full border border-brand-gold/40 hover:border-brand-gold transition-all text-sm uppercase tracking-wider"
                >
                  View Bestsellers
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" /> 100% Anti-Tarnish
                </div>
                <div className="flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-brand-rose" /> Luxury Velvet Box
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-brand-gold" /> AAA+ Cubic Zirconia
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white glass-card relative group">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000"
                    alt="Royal Kundan Choker Model"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase font-bold tracking-widest text-brand-pink">Signature Piece</span>
                    <h3 className="font-serif text-xl font-bold">Royal Kundan & Pearl Choker</h3>
                    <p className="text-xs text-stone-300 mt-1">{formatPrice(12999)} • 22k Gold Plated</p>
                  </div>
                </div>

                {/* Floating Emblem Tag */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-brand-gold/30 flex items-center gap-3 hidden sm:flex">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-stone-900">Ella Creations</h4>
                    <p className="text-[11px] text-brand-rose font-medium">Handcrafted Artificial Jewelry</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Curated Categories</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">Shop by Jewelry Category</h2>
          <div className="gold-divider max-w-xs mx-auto">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600", count: "14 Styles" },
            { title: "Earrings", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600", count: "22 Styles" },
            { title: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600", count: "18 Styles" },
            { title: "Sets", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600", count: "10 Styles" }
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigateTo('shop')}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-soft-rose border border-brand-gold/20 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[11px] font-semibold text-brand-pink tracking-wider">{cat.count}</span>
                <h3 className="font-serif text-xl font-bold tracking-wide group-hover:text-brand-pink transition-colors">
                  {cat.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-rose">Bestseller Spotlight</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">Most Loved Creations</h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-brand-rose hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Value Proposition Banner */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto object-contain filter drop-shadow-md" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold max-w-2xl mx-auto text-brand-cream">
            "Designed to add a touch of timeless beauty & sparkle to every moment."
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Every Ella Creations piece undergoes 5-stage quality inspection, electroplated in real 18k rose gold or 22k yellow gold, ensuring hypoallergenic wear and resistance to dulling over time.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="bg-brand-gold hover:bg-brand-gold/90 text-stone-900 text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full shadow-gold-glow transition-all"
            >
              Shop The Master Collection
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
