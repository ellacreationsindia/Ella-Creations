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
  Flame, 
  BookOpen, 
  Clock, 
  User, 
  Crown, 
  ChevronRight,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function HomeView() {
  const { products, blogs, navigateTo, applyCoupon, showToast, reviews } = useStore();
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'featured' | 'new' | 'kundan' | 'cz'
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Filter 8-12 products for Homepage Showcase
  let showcaseProducts = [...products];
  if (activeTab === 'featured') {
    showcaseProducts = products.filter(p => p.isFeatured);
  } else if (activeTab === 'new') {
    showcaseProducts = products.filter(p => p.isNew);
  } else if (activeTab === 'kundan') {
    showcaseProducts = products.filter(p => (p.stoneType || '').toLowerCase().includes('kundan'));
  } else if (activeTab === 'cz') {
    showcaseProducts = products.filter(p => (p.stoneType || '').toLowerCase().includes('cubic zirconia') || (p.stoneType || '').toLowerCase().includes('cz'));
  }

  // Ensure at least 8-12 products are shown
  const displayProducts = showcaseProducts.length >= 8 ? showcaseProducts.slice(0, 12) : products.slice(0, 12);

  // Latest 3 Journal Articles for Homepage Section
  const latestBlogs = (blogs || []).filter(b => b.status !== 'Draft').slice(0, 3);

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 pb-6 sm:pb-10">
      
      {/* Hero Banner Section (Compact & Visually Balanced Layout) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-sand via-brand-cream to-brand-pink/30 py-5 sm:py-8 lg:py-10 border-b border-brand-gold/20">
        
        {/* Background Decorative Gold Vines & Ornaments */}
        <div className="absolute top-10 right-10 opacity-15 pointer-events-none">
          <Sparkles className="w-48 sm:w-64 h-48 sm:h-64 text-brand-gold animate-pulse-slow" />
        </div>
        <div className="absolute bottom-5 left-5 opacity-10 pointer-events-none">
          <img src="/logo.png" alt="Watermark Logo" className="w-64 sm:w-96 h-64 sm:h-96 object-contain" />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-5 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-brand-gold/40 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-brand-gold shadow-sm">
                <Sparkles className="w-3 h-3 text-brand-gold" />
                Handcrafted Luxury Artificial Jewelry
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
                Timeless Beauty & <br className="hidden sm:inline" />
                <span className="rose-gradient-text">Sparkle in Every Moment</span>
              </h1>

              <p className="text-stone-600 text-xs sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Ella Creations is designed for the modern, confident, and elegant woman. Discover our handcrafted Kundan, Cubic Zirconia crystal drops, and gold-polished statement pieces.
              </p>

              {/* Gold Divider Motif */}
              <div className="gold-divider max-w-xs mx-auto lg:mx-0 my-2 sm:my-4">
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              {/* Mobile-Friendly CTAs */}
              <div className="flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1">
                <button
                  onClick={() => navigateTo('shop')}
                  className="flex-1 sm:flex-initial bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3 sm:py-3.5 px-4 sm:px-7 rounded-full shadow-soft-rose transition-all transform active:scale-95 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider min-h-[44px]"
                >
                  <span>Explore Catalog</span> <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => navigateTo('shop', null, 'Sale')}
                  className="flex-1 sm:flex-initial bg-white/95 hover:bg-white text-stone-800 font-semibold py-3 sm:py-3.5 px-4 sm:px-7 rounded-full border border-brand-gold/40 hover:border-brand-gold transition-all text-xs uppercase tracking-wider shadow-sm min-h-[44px]"
                >
                  Promotional Sale
                </button>
              </div>

              {/* Quick Trust Badges in Mobile 3-Col Layout */}
              <div className="pt-2 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-6 text-[10px] sm:text-xs text-stone-600 font-medium text-center border-t border-brand-gold/15 lg:border-0 lg:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 sm:gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-gold flex-shrink-0" />
                  <span>Handcrafted Quality</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 sm:gap-1.5">
                  <Gift className="w-4 h-4 text-brand-rose flex-shrink-0" />
                  <span>Insured Packaging</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 sm:gap-1.5">
                  <Award className="w-4 h-4 text-brand-gold flex-shrink-0" />
                  <span>AAA+ Crystals</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card (Mobile Proportionate Spotlight) */}
            <div className="lg:col-span-5 relative mt-2 lg:mt-0">
              <div className="relative mx-auto max-w-[260px] sm:max-w-xs lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white bg-gradient-to-b from-stone-50 via-brand-cream/50 to-white p-2.5 sm:p-4 relative group flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000"
                    alt="Royal Kundan Choker Model"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/85 via-stone-900/40 to-transparent p-3 sm:p-6 text-white rounded-b-3xl">
                    <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-brand-pink bg-brand-rose/20 px-2 py-0.5 sm:py-1 rounded-full border border-brand-pink/30">Signature Piece</span>
                    <h3 className="font-serif text-sm sm:text-xl font-bold mt-1">Royal Kundan & Pearl Choker</h3>
                  </div>
                </div>

                {/* Floating Emblem Tag */}
                <div className="absolute -bottom-3 -left-3 bg-white p-2 sm:p-3 rounded-2xl shadow-xl border border-brand-gold/30 items-center gap-2 hidden sm:flex">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                  <div>
                    <h4 className="font-serif text-xs font-bold text-stone-900">Ella Creations</h4>
                    <p className="text-[9px] sm:text-[10px] text-brand-rose font-medium">Handcrafted Artificial Jewelry</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Collections Section (Small Round Fitted Shapes for 7 Categories) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center space-y-1.5 sm:space-y-2 mb-4 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-brand-gold">Curated Collections</span>
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-stone-900">Shop by Jewelry Category</h2>
          <div className="gold-divider max-w-xs mx-auto my-1.5 sm:my-3">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 7 Round Category Avatars Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-4 md:gap-6 items-start justify-items-center">
          {[
            { 
              title: "necklace", 
              label: "Necklace", 
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300"
            },
            { 
              title: "pendant set", 
              label: "Pendant Set", 
              image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300" 
            },
            { 
              title: "rings", 
              label: "Rings", 
              image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=300" 
            },
            { 
              title: "earring", 
              label: "Earring", 
              image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=300" 
            },
            { 
              title: "bridal sets", 
              label: "Bridal Sets", 
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300" 
            },
            { 
              title: "bracelets/bangles", 
              label: "Bracelets / Bangles", 
              image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300" 
            },
            { 
              title: "others", 
              label: "Others", 
              image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=300" 
            }
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigateTo('shop', null, cat.title)}
              className="group flex flex-col items-center cursor-pointer transition-all duration-300 transform active:scale-95 text-center w-full"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-brand-gold/30 group-hover:border-brand-rose bg-white p-1 shadow-sm group-hover:shadow-soft-rose transition-all flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-contain rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-semibold text-stone-800 tracking-tight leading-tight group-hover:text-brand-rose transition-colors line-clamp-2 max-w-[76px] sm:max-w-none">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Expanded Catalog Showcase Section (Showing 8 - 12 Products in Mobile 2-Col Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-brand-gold/20 pb-4 gap-3 sm:gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-gold">Full Master Showcase</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">Explore Popular Creations</h2>
            <p className="text-[11px] sm:text-xs text-stone-600 mt-1">Discover {displayProducts.length} handcrafted pieces from our artificial fine collection.</p>
          </div>

          {/* Filter Pills with Horizontal Swipe on Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto flex-nowrap md:flex-wrap">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'featured', label: 'Bestsellers' },
              { id: 'new', label: 'New Arrivals' },
              { id: 'kundan', label: 'Kundan' },
              { id: 'cz', label: 'CZ Solitaires' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-brand-rose text-white shadow-soft-rose'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 8 to 12 Product Cards in Mobile 2-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-2 sm:pt-4">
          <button
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg transition-all min-h-[44px]"
          >
            View Complete {products.length}+ Pieces Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Jewelry Styling & Occasion Guide Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-sand via-brand-cream to-brand-sand/50 rounded-3xl p-5 sm:p-8 lg:p-10 border border-brand-gold/30 space-y-5 sm:space-y-6 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-gold">Styling Concierge</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Jewelry for Every Special Occasion</h2>
            <p className="text-xs sm:text-sm text-stone-600">Explore tailored jewelry guides designed to match your outfit and event vibe perfectly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "Bridal & Reception",
                desc: "Heavy gold-plated Kundan chokers, multi-layer Rani Haars, and forehead Maang Tikkas.",
                tag: "Royal Grandeur",
                icon: Crown
              },
              {
                title: "Festive & Sangeet",
                desc: "Hand-painted Meenakari enamel bangles and pearl-fringed peacock Jhumkas.",
                tag: "Traditional Sparkle",
                icon: Sparkles
              },
              {
                title: "Cocktails & Evenings",
                desc: "AAA+ Cubic Zirconia drop chandelier earrings & stacked solitaire statement rings.",
                tag: "High-Shine Glam",
                icon: Award
              },
              {
                title: "Workwear & Gifting",
                desc: "Subtle Rose Gold floral studs, minimal pendant chains, and comfortable cuffs.",
                tag: "Everyday Grace",
                icon: Gift
              }
            ].map((occ, i) => {
              const IconComp = occ.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-brand-gold/20 shadow-sm space-y-2.5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-cream text-brand-rose flex items-center justify-center border border-brand-gold/30">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                      {occ.tag}
                    </span>
                    <h3 className="font-serif text-base font-bold text-stone-900">{occ.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{occ.desc}</p>
                  </div>
                  
                  <button
                    onClick={() => navigateTo('shop')}
                    className="text-xs font-bold text-brand-rose hover:text-stone-900 flex items-center gap-1 pt-2.5 border-t border-stone-100 transition-colors"
                  >
                    Browse Occasion <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Ella Journal Articles Section */}
      {latestBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-brand-gold/20 pb-3 gap-3">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-gold">Editorial & Styling Advice</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">Latest From Ella Journal</h2>
            </div>

            <button
              onClick={() => navigateTo('blog')}
              className="text-xs font-bold uppercase tracking-wider text-brand-rose hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              View All Articles <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {latestBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => navigateTo('blog-detail', blog.id)}
                className="bg-white rounded-3xl overflow-hidden border border-brand-gold/20 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/10] overflow-hidden relative bg-stone-100">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-stone-950/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] text-stone-400 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                      <span>•</span>
                      <span>{new Date(blog.publishedAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-brand-rose transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-brand-rose">
                  <span className="text-[10px] sm:text-[11px] text-stone-500 font-normal">{blog.author}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promotional Offers Banner */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-brand-gold/30">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Sparkles className="w-96 h-96 text-brand-gold" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                Artisanal Excellence
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-cream leading-tight">
                Handcrafted Artificial & Bridal Fine Jewelry
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                Explore statement Kundan chokers, AAA+ Cubic Zirconia crystal drops, and gold-polished statement pieces handcrafted for every occasion.
              </p>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3.5 px-7 rounded-2xl shadow-soft-rose transition-all text-xs uppercase tracking-wider text-center"
              >
                Browse Master Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Ella Creations Guarantee Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-brand-gold/20 shadow-sm text-center space-y-6">
          <div className="space-y-1.5">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-brand-gold">Craftsmanship & Promise</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Why Ella Creations Stand Out</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-left">
            <div className="p-3.5 sm:p-5 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-rose/10 text-brand-rose flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">Handcrafted Quality</h3>
              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                Handcrafted with premium gold-polished finish and high-grade Kundan & CZ stones.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">Protective Packaging</h3>
              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                Every purchase arrives carefully wrapped in signature protective gift packaging.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-rose/10 text-brand-rose flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">Insured Courier Shipping</h3>
              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                Fast insured courier delivery across all Indian pincodes.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">Dedicated Concierge</h3>
              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                Dedicated assistance for styling guidance, sizing, and order tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-brand-rose">Customer Love</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Loved by Women Across India</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reviews.slice(0, 2).map((rev) => (
            <div key={rev.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-gold/20 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`} />
                    ))}
                  </div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Buyer
                  </span>
                </div>
                <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900">"{rev.title}"</h4>
                <p className="text-xs text-stone-600 leading-relaxed italic">"{rev.comment}"</p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-800">{rev.author}</span>
                <span className="text-[10px] text-stone-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section for Search Rich Results */}
      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-brand-gold flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-brand-gold" /> Frequently Asked Questions
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Got Questions About Our Jewelry?</h2>
          <p className="text-xs sm:text-sm text-stone-600">Everything you need to know about materials, skin safety, delivery, and jewelry care.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What types of artificial jewelry does Ella Creations specialize in?",
              a: "Ella Creations specializes in handcrafted artificial fine jewelry including royal gold-plated Kundan choker sets, AAA+ Cubic Zirconia (CZ) solitaire drop earrings, micro-pave statement rings, hand-painted Meenakari enamel bangles, and complete bridal wedding sets with maang tikka and jhumkas."
            },
            {
              q: "Is Ella Creations jewelry hypoallergenic and skin-safe?",
              a: "Yes! All pieces are handcrafted using premium 100% lead-free and nickel-free brass alloy bases. Our earrings feature hypoallergenic 925 sterling silver posts and protective electroplating to ensure long, irritation-free wear even for sensitive skin."
            },
            {
              q: "How long does shipping take across India?",
              a: "We provide fast, insured express courier dispatch across all serviceable Indian pincodes. Orders typically dispatch within 24–48 hours and arrive within 3 to 5 business days with live SMS and WhatsApp tracking."
            },
            {
              q: "How should I care for and maintain artificial Kundan and CZ jewelry?",
              a: "Follow the golden rule of 'Last On, First Off'—put your jewelry on after perfumes, cosmetics, and hairsprays. Keep jewelry away from direct water or moisture. Store each piece in an airtight pouch or velvet box after wiping gently with a dry microfiber cloth."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major secure payment methods through Razorpay, including UPI (Google Pay, PhonePe, Paytm), Credit and Debit Cards (Visa, Mastercard, RuPay), and Net Banking across 50+ Indian banks."
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-brand-gold/20 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-brand-cream/30 transition-colors"
              >
                <span className="font-serif text-base font-semibold text-stone-900">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-brand-gold flex-shrink-0 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
