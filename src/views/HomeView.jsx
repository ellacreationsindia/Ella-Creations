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
  HelpCircle,
  Gem
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

export default function HomeView() {
  const { products, blogs, navigateTo, applyCoupon, showToast, reviews } = useStore();
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'featured' | 'new' | 'kundan' | 'cz'
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Filter products for Homepage Showcase
  let showcaseProducts = [...products];
  if (activeTab === 'featured') {
    showcaseProducts = products.filter(p => p.isFeatured || p.isBestseller || (p.reviewsCount && p.reviewsCount > 20) || (p.rating && p.rating >= 4.8));
  } else if (activeTab === 'new') {
    showcaseProducts = products.filter(p => p.isNew || Boolean(p.is_new));
  } else if (activeTab === 'kundan') {
    showcaseProducts = products.filter(p => {
      const text = `${p.title || ''} ${p.category || ''} ${p.stoneType || ''} ${p.description || ''} ${(p.occasionTags || []).join(' ')}`.toLowerCase();
      return text.includes('kundan') || text.includes('polki') || text.includes('meenakari') || text.includes('rani haar') || text.includes('choker');
    });
  } else if (activeTab === 'cz') {
    showcaseProducts = products.filter(p => {
      const text = `${p.title || ''} ${p.category || ''} ${p.stoneType || ''} ${p.description || ''} ${(p.occasionTags || []).join(' ')}`.toLowerCase();
      return text.includes('cubic zirconia') || text.includes('cz') || text.includes('solitaire') || text.includes('crystal') || text.includes('zircon') || text.includes('rhodium');
    });
  }

  // Display matching products (up to 12)
  const displayProducts = showcaseProducts.slice(0, 12);

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
      
      {/* Premium Editorial Jewelry Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b lg:bg-gradient-to-r from-[#FAF4EE] via-[#F8EFE7] to-[#F5E8E4] border-b border-[#DFCBB9]/30">
        
        {/* Background Architectural Arches & Soft Dappled Sunlight */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Architectural Arch Silhouette 1 (Visible on tablet & desktop) */}
          <div className="absolute right-[22%] top-4 w-60 sm:w-72 lg:w-96 h-[560px] rounded-t-full border border-[#DFCBB9]/35 bg-gradient-to-b from-white/35 to-transparent hidden sm:block" />
          {/* Architectural Arch Silhouette 2 */}
          <div className="absolute right-[4%] top-10 w-52 sm:w-64 lg:w-80 h-[500px] rounded-t-full border border-[#DFCBB9]/25 bg-gradient-to-b from-white/25 to-transparent hidden sm:block" />
          {/* Soft warm radial glow behind models */}
          <div className="absolute right-[8%] top-1/4 w-80 sm:w-[540px] lg:w-[650px] h-80 sm:h-[540px] lg:h-[650px] rounded-full bg-[#F5DFD5]/45 blur-3xl" />
          
          {/* Top Left Organic Dappled Shadow */}
          <div className="absolute -top-12 -left-12 w-72 sm:w-96 lg:w-[480px] h-72 sm:h-96 lg:h-[480px] opacity-[0.07] blur-[2px] pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full text-[#6E5D4F] fill-current">
              <path d="M40,-65C52,-58,62,-47,68,-34C74,-21,76,-6,73,8C70,22,62,35,52,46C42,57,30,66,16,70C2,74,-14,73,-28,67C-42,61,-54,50,-62,37C-70,24,-74,9,-72,-6C-70,-21,-62,-36,-51,-45C-40,-54,-26,-57,-12,-63C2,-69,28,-72,40,-65Z" transform="translate(100 100)" />
            </svg>
          </div>
          {/* Delicate leaf silhouette */}
          <div className="absolute top-16 left-56 w-44 h-44 opacity-[0.04] blur-[3px] pointer-events-none hidden lg:block">
            <svg viewBox="0 0 200 200" className="w-full h-full text-[#6E5D4F] fill-current">
              <path d="M48,-59C62,-49,73,-34,76,-17C79,0,74,19,65,35C56,51,43,64,28,70C13,76,-4,75,-21,70C-38,65,-55,56,-65,42C-75,28,-78,9,-74,-9C-70,-27,-59,-44,-45,-55C-31,-66,-15,-71,1,-72C17,-73,34,-69,48,-59Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>

        {/* 1. MOBILE-OPTIMIZED COMPACT HERO (Visible on mobile & small tablets < lg) */}
        {/* Specially tuned to ~200px height so both Hero & Category section fit above fold without scrolling */}
        <div className="lg:hidden relative z-10 px-3.5 sm:px-6 py-3.5 sm:py-5 min-h-[195px] sm:min-h-[230px] flex items-center justify-between overflow-hidden">
          {/* Left Text & CTA */}
          <div className="w-[56%] sm:w-[52%] z-20 space-y-1.5 sm:space-y-2 pr-1">
            <p className="text-[8px] sm:text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#9E7D58]">
              ARTIFICIAL JEWELRY INDIA
            </p>
            <h1 className="font-serif text-[22px] sm:text-[28px] font-bold tracking-tight text-[#1A1A1A] leading-[1.08]">
              Jewelry for <br />
              <span className="text-[#B87080] font-serif font-normal">Every You</span>
            </h1>
            <p className="text-[#5C5552] text-[10px] sm:text-xs leading-tight line-clamp-1">
              Handcrafted Kundan & CZ crystal heirlooms.
            </p>
            <div className="pt-0.5">
              <a
                href="/shop"
                onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}
                className="inline-flex items-center gap-1.5 bg-[#B87080] hover:bg-[#A55E6E] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider py-1.5 px-3.5 sm:py-2 sm:px-4 rounded-full shadow-xs active:scale-95 transition-all"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            {/* Compact trust pill */}
            <div className="flex items-center gap-2 pt-0.5 text-[8.5px] sm:text-[9.5px] text-[#6E5D4F]">
              <span className="flex items-center gap-0.5"><Gem className="w-2.5 h-2.5 text-[#B87080]" /> Pure Brass</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><Gift className="w-2.5 h-2.5 text-[#B87080]" /> Gift Box</span>
            </div>
          </div>

          {/* Right Image: Aligned to the right side, seamless mask */}
          <div className="w-[50%] sm:w-[50%] absolute right-0 bottom-0 top-0 flex items-end justify-end pointer-events-none z-10">
            <img
              src="/hero-models.png"
              alt="Ella Creations Handcrafted Luxury Jewelry"
              className="h-[96%] w-auto max-w-none object-contain object-right-bottom scale-110 sm:scale-105 origin-bottom-right select-none drop-shadow-sm"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 100%)',
              }}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

        {/* 2. DESKTOP HERO LAYOUT (Visible on lg screens and up) */}
        {/* Image aligned all the way to right side, enlarged to cover the full hero area */}
        <div className="hidden lg:block relative z-10 pl-8 xl:pl-14 2xl:pl-20 pr-0 max-w-[1720px] mx-auto">
          <div className="grid grid-cols-12 items-center min-h-[580px] xl:min-h-[660px] 2xl:min-h-[720px]">
            
            {/* LEFT SIDE: Editorial Typography, CTAs & Badges */}
            <div className="col-span-5 xl:col-span-5 space-y-4 xl:space-y-6 z-20 py-8 xl:py-12 text-left max-w-xl">
              <div className="inline-block">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9E7D58]">
                  ARTIFICIAL JEWELRY INDIA
                </p>
              </div>

              <h1 className="font-serif text-5xl xl:text-[68px] 2xl:text-[76px] font-bold tracking-tight text-[#1A1A1A] leading-[1.05]">
                Jewelry for <br />
                <span className="text-[#B87080] font-serif font-normal inline-block">
                  Every You
                </span>
              </h1>

              <p className="text-[#5C5552] text-sm xl:text-base font-normal leading-relaxed max-w-md">
                Timeless designs. Modern moments.<br />
                Handcrafted pieces for the confident, elegant you.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3.5 pt-2">
                <a
                  href="/shop"
                  onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}
                  className="bg-[#B87080] hover:bg-[#A55E6E] text-white text-xs font-semibold uppercase tracking-[0.14em] py-3.5 px-8 rounded-full shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>SHOP COLLECTIONS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="/shop?category=Sale"
                  onClick={(e) => { e.preventDefault(); navigateTo('shop', null, 'Sale'); }}
                  className="bg-[#FDF7F2]/80 hover:bg-[#B87080]/10 text-[#4A4543] hover:text-[#1A1A1A] text-xs font-semibold uppercase tracking-[0.14em] py-3.5 px-7 rounded-full border border-[#B87080]/50 hover:border-[#B87080] transition-all transform active:scale-95 text-center"
                >
                  <span>EXPLORE SALE</span>
                </a>
              </div>

              {/* Value Badges */}
              <div className="flex items-center gap-6 xl:gap-8 pt-4 text-[#5C5552]">
                <div className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-[#4A4543] flex-shrink-0" />
                  <div className="text-[11px] leading-tight text-left">
                    <span className="font-medium text-[#2E2A28] block">Premium</span>
                    <span className="text-[#7A736F]">Quality</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#4A4543] flex-shrink-0" />
                  <div className="text-[11px] leading-tight text-left">
                    <span className="font-medium text-[#2E2A28] block">Elegant</span>
                    <span className="text-[#7A736F]">Packaging</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#4A4543] flex-shrink-0" />
                  <div className="text-[11px] leading-tight text-left">
                    <span className="font-medium text-[#2E2A28] block">Designed</span>
                    <span className="text-[#7A736F]">for You</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Enlarged Image Covering Whole Right Hero Area */}
            <div className="col-span-7 xl:col-span-7 relative h-full flex items-end justify-end self-stretch overflow-visible">
              <div className="w-full h-full min-h-[580px] xl:min-h-[660px] 2xl:min-h-[720px] flex items-end justify-end relative">
                <img
                  src="/hero-models.png"
                  alt="Five Models Showcasing Ella Creations Handcrafted Luxury Jewelry"
                  className="w-full h-full max-h-[680px] xl:max-h-[760px] 2xl:max-h-[820px] object-contain object-bottom-right lg:object-right-bottom scale-110 xl:scale-115 2xl:scale-120 origin-bottom-right select-none drop-shadow-md"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 100%)',
                  }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />

                {/* Vertical carousel dots on right */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-[#B87080] shadow-sm"></span>
                  <span className="w-2 h-2 rounded-full bg-white/80 border border-[#B87080]/30"></span>
                  <span className="w-2 h-2 rounded-full bg-white/80 border border-[#B87080]/30"></span>
                </div>

                {/* Bottom right corner tag */}
                <div className="absolute bottom-4 right-8 text-right pointer-events-none z-20">
                  <p className="text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[#7A736F] font-serif">More Than Jewelry</p>
                  <p className="text-xs xl:text-sm italic text-[#B87080] font-editorial">A Feeling</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Category Collections Section (Compact and Fully Visible Above Fold on Mobile) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-2.5 sm:mt-4 lg:mt-6">
        <div className="text-center space-y-0.5 sm:space-y-1 mb-2.5 sm:mb-4">
          <span className="text-[9px] sm:text-xs font-semibold uppercase tracking-widest text-brand-gold">Curated Collections</span>
          <h2 className="font-serif text-base sm:text-xl lg:text-3xl font-bold text-stone-900 leading-tight">Shop by Jewelry Category</h2>
          <div className="gold-divider max-w-[140px] sm:max-w-xs mx-auto my-0.5 sm:my-1">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
        </div>

        {/* 7 Round Category Avatars: Mobile Single Row Rail, Desktop 7-Col Grid */}
        <div className="flex sm:grid sm:grid-cols-7 gap-2.5 sm:gap-4 md:gap-6 overflow-x-auto sm:overflow-x-visible no-scrollbar pb-1 sm:pb-0 px-1 items-start justify-start sm:justify-items-center">
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
            <a
              key={idx}
              href={`/shop?category=${encodeURIComponent(cat.label)}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('shop', null, cat.title);
              }}
              className="group flex flex-col items-center cursor-pointer transition-all duration-300 transform active:scale-95 text-center flex-shrink-0 w-[60px] sm:w-[72px] md:w-full"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-brand-gold/30 group-hover:border-brand-rose bg-white p-0.5 sm:p-1 shadow-xs group-hover:shadow-soft-rose transition-all flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-contain rounded-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="mt-1 sm:mt-1.5 text-[9px] sm:text-[11px] font-semibold text-stone-800 tracking-tight leading-tight group-hover:text-brand-rose transition-colors line-clamp-1 w-full text-center">
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Expanded Catalog Showcase Section (Showing 8 - 12 Products in Mobile 2-Col Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-brand-gold/20 pb-3 gap-2 sm:gap-4">
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
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-brand-gold/20 space-y-2">
            <p className="text-xs text-stone-600 font-medium">New pieces arriving soon in this collection.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="text-xs text-brand-rose font-bold hover:underline cursor-pointer"
            >
              Browse All Catalog &rarr;
            </button>
          </div>
        )}

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
        <div className="bg-gradient-to-r from-brand-sand via-brand-cream to-brand-sand/50 rounded-3xl p-4 sm:p-6 lg:p-8 border border-brand-gold/30 space-y-4 sm:space-y-5 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-1">
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
        <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-brand-gold/20 shadow-sm text-center space-y-4 sm:space-y-5">
          <div className="space-y-1">
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
        <div className="text-center space-y-1.5 mb-4 sm:mb-6">
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
      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        <div className="text-center space-y-1.5">
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
