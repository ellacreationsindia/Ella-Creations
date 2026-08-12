import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Star, 
  Award, 
  Gift, 
  Copy, 
  Check, 
  Truck, 
  RefreshCw, 
  Instagram, 
  ShoppingBag,
  Flame
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function HomeView() {
  const { products, navigateTo, applyCoupon, showToast, reviews } = useStore();
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [activeTab, setActiveTab] = useState('featured'); // 'featured' | 'new'

  const featuredProducts = products.filter(p => p.isFeatured);
  const newArrivals = products.filter(p => p.isNew);
  const displayProducts = activeTab === 'featured' 
    ? (featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4))
    : (newArrivals.length > 0 ? newArrivals : products.slice(0, 4));

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 3000);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-sand via-brand-cream to-brand-pink/30 py-16 lg:py-24 border-b border-brand-gold/20">
        
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
              
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-brand-gold/40 text-xs font-semibold uppercase tracking-widest text-brand-gold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                Handcrafted Luxury Artificial Jewelry
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
                Timeless Beauty & <br className="hidden sm:inline" />
                <span className="rose-gradient-text">Sparkle in Every Moment</span>
              </h1>

              <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Ella Creations is designed for the modern, confident, and elegant woman. Discover our handcrafted Kundan, Cubic Zirconia crystal drops, and 22k gold-plated statement pieces.
              </p>

              {/* Gold Divider Motif */}
              <div className="gold-divider max-w-xs mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigateTo('shop')}
                  className="w-full sm:w-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-4 px-8 rounded-full shadow-soft-rose transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  Explore Master Collection <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateTo('shop')}
                  className="w-full sm:w-auto bg-white/80 hover:bg-white text-stone-800 font-semibold py-4 px-8 rounded-full border border-brand-gold/40 hover:border-brand-gold transition-all text-xs uppercase tracking-wider shadow-sm"
                >
                  View Bestsellers
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" /> Handcrafted Quality
                </div>
                <div className="flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-brand-rose" /> Insured Protective Packaging
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-brand-gold" /> AAA+ Cubic Zirconia
                </div>
              </div>

            </div>

            {/* Right Hero Image Card (Uncropped Spotlight) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-stone-50 via-brand-cream/50 to-white p-4 relative group flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000"
                    alt="Royal Kundan Choker Model"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/85 via-stone-900/40 to-transparent p-6 text-white rounded-b-3xl">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pink bg-brand-rose/20 px-2.5 py-1 rounded-full border border-brand-pink/30">Signature Piece</span>
                    <h3 className="font-serif text-xl font-bold mt-2">Royal Kundan & Pearl Choker</h3>
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

      {/* Category Collections Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Curated Collections</span>
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
              onClick={() => navigateTo('shop', null, cat.title)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-soft-rose border border-brand-gold/20 transition-all duration-300 bg-brand-cream/40 p-2 flex items-center justify-center"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
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

      {/* Product Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-brand-gold/20 pb-4 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Handpicked Statement Pieces</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">Featured Collections</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'featured'
                  ? 'bg-brand-rose text-white shadow-soft-rose'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Curated Favorites
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'new'
                  ? 'bg-brand-rose text-white shadow-soft-rose'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              New Arrivals
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-semibold uppercase tracking-wider text-brand-rose hover:text-stone-900 transition-colors flex items-center gap-1 ml-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid with Uncropped Photos & Hover Swap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotional Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-brand-gold/30">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Sparkles className="w-96 h-96 text-brand-gold" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                Artisanal Excellence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-cream leading-tight">
                Handcrafted Artificial & Bridal Fine Jewelry
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                Explore statement Kundan chokers, AAA+ Cubic Zirconia crystal drops, and 22k gold-plated statement pieces handcrafted for every occasion.
              </p>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-4 px-8 rounded-2xl shadow-soft-rose transition-all text-xs uppercase tracking-wider text-center"
              >
                Browse Master Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Ella Creations Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-gold/20 shadow-sm text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Craftsmanship & Promise</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">Why Ella Creations Stand Out</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-rose/10 text-brand-rose flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Handcrafted Quality</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Handcrafted with 22k gold electroplated finish and premium grade Kundan & CZ stones.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Protective Packaging</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every purchase arrives carefully wrapped in signature protective gift packaging.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-rose/10 text-brand-rose flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Insured Courier Shipping</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fast insured courier delivery across all Indian pincodes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Dedicated Concierge</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dedicated assistance for styling guidance, sizing, and order tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-rose">Customer Love</span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">Loved by Women Across India</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.slice(0, 2).map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-3xl border border-brand-gold/20 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Buyer
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-stone-900">"{rev.title}"</h4>
                <p className="text-xs text-stone-600 leading-relaxed italic">"{rev.comment}"</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-800">{rev.author}</span>
                <span className="text-[11px] text-stone-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
