import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_BLOGS } from '../src/data/initialData.js';
import { encryptId } from '../src/utils/idSecurity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const slugify = (text) => (text || '')
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');

const getProductSlug = (p) => {
  if (!p) return '';
  const shortTitle = (p.title || '').trim().split(/\s+/).slice(0, 4).join(' ');
  return `${slugify(shortTitle)}--${encryptId(p.id)}`;
};

const domain = 'https://ella-creations.com';

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateStaticHtml(baseHtml, { title, description, canonicalUrl, ogImage, bodyContent, jsonLd }) {
  let html = baseHtml;

  // Replace Title
  if (title) {
    const cleanTitle = escapeHtml(title);
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${cleanTitle}</title>`);
    html = html.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/gi, `<meta name="title" content="${cleanTitle}" />`);
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${cleanTitle}" />`);
    html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${cleanTitle}" />`);
  }

  // Replace Description
  if (description) {
    const cleanDesc = escapeHtml(description);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${cleanDesc}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${cleanDesc}" />`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${cleanDesc}" />`);
  }

  // Replace Canonical URL
  if (canonicalUrl) {
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:url" content="${canonicalUrl}" />`);
  }

  // Replace Image if specified
  if (ogImage) {
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
    html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`);
  }

  // Inject JSON-LD Schema if specified
  if (jsonLd) {
    const jsonString = typeof jsonLd === 'string' ? jsonLd : JSON.stringify(jsonLd);
    html = html.replace('</head>', `  <script type="application/ld+json">${jsonString}</script>\n  </head>`);
  }

  // Inject body content into #root
  if (bodyContent) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);
  }

  return html;
}

function writePage(relPath, htmlContent) {
  const targetFile = relPath === '' ? path.join(distDir, 'index.html') : path.join(distDir, relPath, 'index.html');
  const targetDir = path.dirname(targetFile);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, htmlContent, 'utf-8');

  // Also write the flat .html file (e.g. dist/shop.html) for servers with cleanUrls enabled (Vercel, Netlify)
  if (relPath !== '') {
    const flatFile = path.join(distDir, `${relPath}.html`);
    const flatDir = path.dirname(flatFile);
    fs.mkdirSync(flatDir, { recursive: true });
    fs.writeFileSync(flatFile, htmlContent, 'utf-8');
  }
}

// Common Shared HTML Header for static rendering
function renderCommonHeader(activePath = '') {
  return `
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/40 shadow-xs">
      <div class="bg-stone-900 text-white text-[10px] sm:text-xs py-2 px-3 text-center tracking-wider font-medium">
        INSURED EXPRESS COURIER DISPATCH ACROSS INDIA | ELLA CREATIONS FINE ARTIFICIAL JEWELRY
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <nav class="hidden lg:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-stone-700">
          <a href="/" class="hover:text-rose-700 py-1 ${activePath === '/' ? 'text-rose-700 font-bold border-b-2 border-rose-700' : ''}">Home</a>
          <a href="/shop" class="hover:text-rose-700 py-1 ${activePath === '/shop' ? 'text-rose-700 font-bold border-b-2 border-rose-700' : ''}">Shop Collections</a>
          <a href="/necklaces" class="hover:text-rose-700 py-1 ${activePath.includes('necklace') ? 'text-rose-700 font-bold border-b-2 border-rose-700' : ''}">Necklaces</a>
          <a href="/earrings" class="hover:text-rose-700 py-1 ${activePath.includes('earring') ? 'text-rose-700 font-bold border-b-2 border-rose-700' : ''}">Earrings</a>
          <a href="/rings" class="hover:text-rose-700 py-1 ${activePath.includes('ring') ? 'text-rose-700 font-bold border-b-2 border-rose-700' : ''}">Rings</a>
          <a href="/bridal-sets" class="hover:text-rose-700 py-1 ${activePath.includes('bridal') ? 'text-rose-700 font-bold border-b-2 border-rose-700' : ''}">Bridal Sets</a>
          <a href="/bracelets-bangles" class="hover:text-rose-700 py-1 ${activePath.includes('bangle') || activePath.includes('bracelet') ? 'text-rose-700 font-bold border-b-2 border-rose-700' : ''}">Bangles</a>
          <a href="/blog" class="hover:text-rose-700 py-1 ${activePath.startsWith('/blog') ? 'text-rose-700 font-bold border-b-2 border-rose-700' : ''}">Ella Journal</a>
        </nav>
        <div class="flex flex-col items-center justify-center text-center mx-auto lg:mx-0">
          <a href="/" class="flex flex-col items-center group">
            <img src="/logo.png" alt="Ella Creations Logo" class="h-9 sm:h-11 w-auto object-contain" />
            <span class="font-serif text-lg sm:text-xl font-bold tracking-wider text-stone-900 mt-0.5">Ella Creations</span>
            <span class="text-[8px] uppercase tracking-[0.25em] text-amber-600 font-bold">Artificial Jewelry India</span>
          </a>
        </div>
        <div class="flex items-center space-x-3 text-xs">
          <a href="/shop" class="bg-stone-900 text-white font-semibold px-4 py-2 rounded-full hover:bg-rose-700 transition-colors hidden sm:inline-block">Explore Shop</a>
        </div>
      </div>
    </header>
  `;
}

// Common Shared HTML Footer for static rendering
function renderCommonFooter() {
  return `
    <footer class="w-full bg-stone-950 text-stone-300 pt-10 pb-8 border-t border-amber-600/30 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 border-b border-stone-800">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-left">
          <div class="p-3 bg-stone-900/60 rounded-xl">
            <h4 class="font-serif text-sm font-bold text-white">Handcrafted Quality</h4>
            <p class="text-xs text-stone-400 mt-0.5">Lead & nickel free brass with gold plating.</p>
          </div>
          <div class="p-3 bg-stone-900/60 rounded-xl">
            <h4 class="font-serif text-sm font-bold text-white">Insured Courier</h4>
            <p class="text-xs text-stone-400 mt-0.5">Pan-India express delivery with real-time tracking.</p>
          </div>
          <div class="p-3 bg-stone-900/60 rounded-xl">
            <h4 class="font-serif text-sm font-bold text-white">Velvet Gift Box</h4>
            <p class="text-xs text-stone-400 mt-0.5">Protective heirloom packaging with every piece.</p>
          </div>
          <div class="p-3 bg-stone-900/60 rounded-xl">
            <h4 class="font-serif text-sm font-bold text-white">Stylist Support</h4>
            <p class="text-xs text-stone-400 mt-0.5">Bridal styling consultation via WhatsApp concierge.</p>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div class="space-y-3">
          <span class="font-serif text-xl font-bold text-white block">Ella Creations</span>
          <p class="text-stone-400 leading-relaxed">Contemporary Indian artificial jewelry house. Handcrafted uncut Kundan, AAA+ Cubic Zirconia solitaires, and royal bridal chokers.</p>
        </div>
        <div>
          <h5 class="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">Shop Collections</h5>
          <ul class="space-y-2 text-stone-400">
            <li><a href="/necklaces" class="hover:text-white">Necklaces & Chokers</a></li>
            <li><a href="/earrings" class="hover:text-white">Earrings & Jhumkas</a></li>
            <li><a href="/rings" class="hover:text-white">Solitaire Cocktail Rings</a></li>
            <li><a href="/bridal-sets" class="hover:text-white">Bridal Trousseau Sets</a></li>
            <li><a href="/bracelets-bangles" class="hover:text-white">Bangles & Bracelets</a></li>
          </ul>
        </div>
        <div>
          <h5 class="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">Customer Care & Policies</h5>
          <ul class="space-y-2 text-stone-400">
            <li><a href="/blog" class="hover:text-white">📖 Ella Journal & Styling Guides</a></li>
            <li><a href="/brand-guidelines" class="hover:text-white">Jewelry Care & Metallurgy Guide</a></li>
            <li><a href="/shipping-policy" class="hover:text-white">Shipping & Delivery Policy</a></li>
            <li><a href="/refund-policy" class="hover:text-white">Return & Refund Policy</a></li>
            <li><a href="/terms" class="hover:text-white">Terms & Conditions</a></li>
            <li><a href="/privacy" class="hover:text-white">Privacy Policy</a></li>
            <li><a href="/sitemap" class="hover:text-white">Sitemap Directory</a></li>
          </ul>
        </div>
        <div>
          <h5 class="font-serif text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">Concierge Contact</h5>
          <p class="text-stone-400 leading-relaxed">WhatsApp: +91 91799 44342<br />Email: support@ella-creations.com<br />Pan-India Insured Dispatch from Madhya Pradesh, India.</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 border-t border-stone-800 text-center text-[11px] text-stone-500">
        &copy; ${new Date().getFullYear()} Ella Creations India. Handcrafted Luxury Artificial Jewelry. All rights reserved.
      </div>
  `;
}

// 0. Render Home Page HTML
function renderHomePage(products, blogs) {
  const featured = products.slice(0, 8);
  const featuredHtml = featured.map(p => {
    const slug = getProductSlug(p);
    const mainImg = p.images?.[0] || '/logo.png';
    return `
      <article class="group bg-white rounded-2xl overflow-hidden border border-amber-200/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-3 sm:p-4">
        <a href="/product/${slug}" class="block relative aspect-square overflow-hidden rounded-xl bg-stone-50 mb-3 flex items-center justify-center">
          <img src="${mainImg}" alt="${escapeHtml(p.title)} - Ella Creations" class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </a>
        <div class="space-y-1.5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">${escapeHtml(p.category)} • ${escapeHtml(p.stoneType || 'Fine Jewelry')}</span>
            <h2 class="font-serif text-sm sm:text-base font-bold text-stone-900 line-clamp-2 mt-1">
              <a href="/product/${slug}" class="hover:text-rose-700 transition-colors">${escapeHtml(p.title)}</a>
            </h2>
            <div class="text-[11px] text-stone-500 mt-0.5">★ ${p.rating || 4.9} (${p.reviewsCount || 30} reviews)</div>
          </div>
          <div class="pt-2 border-t border-stone-100 flex items-center justify-between mt-2">
            <span class="font-serif text-base font-bold text-stone-900">₹${p.price.toLocaleString('en-IN')}</span>
            <a href="/product/${slug}" class="bg-stone-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-rose-700 transition-colors">View Piece</a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const recentBlogs = (blogs || []).slice(0, 3).map(b => {
    return `
      <article class="bg-white rounded-2xl border border-amber-200/40 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
        <a href="/blog/${b.slug}" class="block aspect-video overflow-hidden bg-stone-100">
          <img src="${b.coverImage}" alt="${escapeHtml(b.title)}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
        </a>
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-rose-700">${escapeHtml(b.category || 'Styling Guide')}</span>
            <h3 class="font-serif text-base sm:text-lg font-bold text-stone-900 mt-1 line-clamp-2">
              <a href="/blog/${b.slug}" class="hover:text-rose-700 transition-colors">${escapeHtml(b.title)}</a>
            </h3>
            <p class="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">${escapeHtml(b.excerpt)}</p>
          </div>
          <div class="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between text-[11px] text-stone-500">
            <span>By ${escapeHtml(b.author || 'Ella Editorial')}</span>
            <a href="/blog/${b.slug}" class="text-rose-700 font-semibold hover:underline">Read Article &rarr;</a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="min-h-screen flex flex-col font-sans bg-[#FFF6EE] text-[#1c1917]">
      ${renderCommonHeader('/')}
      <main class="flex-1 w-full space-y-12 sm:space-y-16">
        <!-- Hero Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 text-center space-y-4">
          <div class="inline-block px-4 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs font-bold uppercase tracking-widest">
            Royal Handcrafted Indian Artificial Jewelry
          </div>
          <h1 class="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 max-w-4xl mx-auto leading-tight">
            Heirloom Kundan & Cubic Zirconia Masterpieces
          </h1>
          <p class="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover exquisite handcrafted bridal chokers, uncut Polki necklaces, solitaire cocktail rings, and lightweight jhumkas. Crafted in nickel-free brass with 18k micro gold electroplating.
          </p>
          <div class="flex items-center justify-center gap-3 pt-2">
            <a href="/shop" class="bg-stone-900 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-rose-700 transition-all shadow-md">
              Explore All Collections
            </a>
            <a href="/shop?category=Bridal%20Sets" class="bg-white text-stone-900 border border-amber-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-stone-50 transition-all">
              Bridal Trousseau
            </a>
          </div>
        </section>

        <!-- Category Showcase -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-6">
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Curated By Category</h2>
            <p class="text-xs text-stone-600 mt-1">Explore our signature artisanal collections</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <a href="/necklaces" class="group bg-white rounded-2xl p-4 text-center border border-amber-200/50 hover:border-amber-400 hover:shadow-md transition-all">
              <div class="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👑</div>
              <h3 class="font-serif text-sm font-bold text-stone-900 mt-2">Necklaces</h3>
              <span class="text-[11px] text-amber-700">Chokers & Haars</span>
            </a>
            <a href="/earrings" class="group bg-white rounded-2xl p-4 text-center border border-amber-200/50 hover:border-amber-400 hover:shadow-md transition-all">
              <div class="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">✨</div>
              <h3 class="font-serif text-sm font-bold text-stone-900 mt-2">Earrings</h3>
              <span class="text-[11px] text-amber-700">Jhumkas & Studs</span>
            </a>
            <a href="/rings" class="group bg-white rounded-2xl p-4 text-center border border-amber-200/50 hover:border-amber-400 hover:shadow-md transition-all">
              <div class="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💍</div>
              <h3 class="font-serif text-sm font-bold text-stone-900 mt-2">Statement Rings</h3>
              <span class="text-[11px] text-amber-700">Cocktail & Solitaire</span>
            </a>
            <a href="/bridal-sets" class="group bg-white rounded-2xl p-4 text-center border border-amber-200/50 hover:border-amber-400 hover:shadow-md transition-all">
              <div class="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👰</div>
              <h3 class="font-serif text-sm font-bold text-stone-900 mt-2">Bridal Sets</h3>
              <span class="text-[11px] text-amber-700">Complete Trousseau</span>
            </a>
            <a href="/bracelets-bangles" class="group bg-white rounded-2xl p-4 text-center border border-amber-200/50 hover:border-amber-400 hover:shadow-md transition-all">
              <div class="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💫</div>
              <h3 class="font-serif text-sm font-bold text-stone-900 mt-2">Bangles & Cuffs</h3>
              <span class="text-[11px] text-amber-700">Meenakari Kadas</span>
            </a>
          </div>
        </section>

        <!-- Bestsellers Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Featured Bestsellers</h2>
              <p class="text-xs text-stone-600 mt-1">Our most loved artisanal creations</p>
            </div>
            <a href="/shop" class="text-xs font-bold text-rose-700 hover:underline">View All &rarr;</a>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            ${featuredHtml}
          </div>
        </section>

        <!-- Journal Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900">From the Ella Journal</h2>
              <p class="text-xs text-stone-600 mt-1">Bridal styling secrets, jewelry care, and heritage craftsmanship</p>
            </div>
            <a href="/blog" class="text-xs font-bold text-rose-700 hover:underline">Read All Articles &rarr;</a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${recentBlogs}
          </div>
        </section>
      </main>
      ${renderCommonFooter()}
    </div>
  `;
}

// 1. Render Shop Catalog HTML
function renderShopPage(products, activeCategory = 'All') {
  const filtered = activeCategory === 'All' 
    ? products 
    : products.filter(p => (p.category || '').toLowerCase().includes(activeCategory.toLowerCase()));

  const productsHtml = filtered.map(p => {
    const slug = getProductSlug(p);
    const mainImg = p.images?.[0] || '/logo.png';
    return `
      <article class="group bg-white rounded-2xl overflow-hidden border border-amber-200/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-3 sm:p-4">
        <a href="/product/${slug}" class="block relative aspect-square overflow-hidden rounded-xl bg-stone-50 mb-3 flex items-center justify-center">
          <img src="${mainImg}" alt="${escapeHtml(p.title)} - Ella Creations" class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </a>
        <div class="space-y-1.5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">${escapeHtml(p.category)} • ${escapeHtml(p.stoneType || 'Fine Jewelry')}</span>
            <h2 class="font-serif text-sm sm:text-base font-bold text-stone-900 line-clamp-2 mt-1">
              <a href="/product/${slug}" class="hover:text-rose-700 transition-colors">${escapeHtml(p.title)}</a>
            </h2>
            <div class="text-[11px] text-stone-500 mt-0.5">★ ${p.rating || 4.9} (${p.reviewsCount || 30} reviews)</div>
          </div>
          <div class="pt-2 border-t border-stone-100 flex items-center justify-between mt-2">
            <span class="font-serif text-base font-bold text-stone-900">₹${p.price.toLocaleString('en-IN')}</span>
            <a href="/product/${slug}" class="bg-stone-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-rose-700 transition-colors">View Piece</a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="min-h-screen flex flex-col font-sans bg-[#FFF6EE] text-[#1c1917]">
      ${renderCommonHeader('/shop')}
      <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div class="text-center max-w-3xl mx-auto space-y-2">
          <span class="text-xs uppercase font-bold tracking-widest text-amber-700">Royal Indian Fine Artificial Jewelry</span>
          <h1 class="font-serif text-3xl sm:text-5xl font-bold text-stone-900">Shop Handcrafted Collections</h1>
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Explore our complete catalog of handcrafted Kundan choker necklaces, AAA+ Cubic Zirconia drop earrings, solitaire cocktail rings, and regal bridal sets with insured pan-India delivery.
          </p>
        </div>

        <nav class="flex items-center justify-center gap-2 flex-wrap text-xs font-semibold">
          <a href="/shop" class="px-4 py-2 rounded-full border ${activeCategory === 'All' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-amber-200/60 hover:bg-stone-100'}">All Pieces</a>
          <a href="/shop?category=Necklace" class="px-4 py-2 rounded-full border ${activeCategory === 'Necklace' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-amber-200/60 hover:bg-stone-100'}">Necklaces</a>
          <a href="/shop?category=Earring" class="px-4 py-2 rounded-full border ${activeCategory === 'Earring' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-amber-200/60 hover:bg-stone-100'}">Earrings</a>
          <a href="/shop?category=Rings" class="px-4 py-2 rounded-full border ${activeCategory === 'Rings' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-amber-200/60 hover:bg-stone-100'}">Rings</a>
          <a href="/shop?category=Bridal%20Sets" class="px-4 py-2 rounded-full border ${activeCategory === 'Bridal Sets' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-amber-200/60 hover:bg-stone-100'}">Bridal Sets</a>
          <a href="/shop?category=Bracelets%2FBangles" class="px-4 py-2 rounded-full border ${activeCategory === 'Bracelets' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-amber-200/60 hover:bg-stone-100'}">Bangles & Bracelets</a>
        </nav>

        <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          ${productsHtml}
        </section>

        <!-- Brand Assurances -->
        <section class="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/40 shadow-xs space-y-4">
          <h2 class="font-serif text-xl sm:text-2xl font-bold text-stone-900 text-center">Frequently Asked Questions</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600 leading-relaxed pt-2">
            <div>
              <h3 class="font-bold text-stone-900 mb-1">Is this genuine skin-safe jewelry?</h3>
              <p>Yes. All pieces are crafted from 100% lead-free and nickel-free brass alloy bases with hypoallergenic 925 silver earring posts.</p>
            </div>
            <div>
              <h3 class="font-bold text-stone-900 mb-1">How is delivery handled?</h3>
              <p>Dispatched via insured express couriers with tracking across India within 24 to 48 hours. Secure tamper-evident velvet packaging.</p>
            </div>
            <div>
              <h3 class="font-bold text-stone-900 mb-1">What is the return/exchange policy?</h3>
              <p>We provide a 48-hour replacement and damage protection guarantee for any transit defects with dedicated concierge support.</p>
            </div>
          </div>
        </section>
      </main>
      ${renderCommonFooter()}
    </div>
  `;
}

// 2. Render Single Product Detail Page HTML
function renderProductDetailPage(prod, allProducts = []) {
  const slug = getProductSlug(prod);
  const mainImg = prod.images?.[0] || '/logo.png';
  const related = allProducts.filter(p => p.id !== prod.id && p.category === prod.category).slice(0, 4);

  const relatedHtml = related.map(rel => {
    const relSlug = getProductSlug(rel);
    return `
      <div class="bg-white rounded-2xl p-3 border border-amber-200/40 text-xs">
        <a href="/product/${relSlug}" class="block aspect-square bg-stone-50 rounded-xl overflow-hidden mb-2">
          <img src="${rel.images?.[0] || '/logo.png'}" alt="${escapeHtml(rel.title)}" class="w-full h-full object-contain p-2" loading="lazy" />
        </a>
        <h4 class="font-serif font-bold text-stone-900 line-clamp-1"><a href="/product/${relSlug}">${escapeHtml(rel.title)}</a></h4>
        <div class="font-bold text-stone-900 mt-1">₹${rel.price.toLocaleString('en-IN')}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="min-h-screen flex flex-col font-sans bg-[#FFF6EE] text-[#1c1917]">
      ${renderCommonHeader('/shop')}
      <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        <!-- Breadcrumb navigation -->
        <nav class="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
          <a href="/" class="hover:text-rose-700">Home</a>
          <span>/</span>
          <a href="/shop" class="hover:text-rose-700">Shop</a>
          <span>/</span>
          <a href="/shop?category=${encodeURIComponent(prod.category)}" class="hover:text-rose-700">${escapeHtml(prod.category)}</a>
          <span>/</span>
          <span class="text-stone-900 font-semibold">${escapeHtml(prod.title)}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <!-- Left: Gallery -->
          <div class="lg:col-span-6 space-y-4">
            <div class="aspect-square rounded-3xl overflow-hidden bg-white border border-amber-200/50 p-6 flex items-center justify-center shadow-xs">
              <img src="${mainImg}" alt="${escapeHtml(prod.title)} - Ella Creations" class="w-full h-full object-contain" />
            </div>
            <div class="flex gap-2">
              ${(prod.images || []).map((img, i) => `
                <div class="w-16 h-16 rounded-xl overflow-hidden border border-amber-200 bg-white p-1">
                  <img src="${img}" alt="${escapeHtml(prod.title)} view ${i + 1}" class="w-full h-full object-contain" />
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Details -->
          <div class="lg:col-span-6 space-y-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-amber-700">${escapeHtml(prod.category)} • SKU: ${escapeHtml(prod.sku || prod.id)}</span>
              <h1 class="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">${escapeHtml(prod.title)}</h1>
              <div class="text-xs text-stone-500 mt-1">★ ${prod.rating || 4.9} (${prod.reviewsCount || 42} Customer Ratings) • Insured Pan-India Express Dispatch</div>
            </div>

            <div class="flex items-baseline gap-3 pt-2 border-t border-stone-200">
              <span class="font-serif text-3xl font-bold text-stone-900">₹${prod.price.toLocaleString('en-IN')}</span>
              <span class="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">In Stock (${prod.stock || 10} pieces available)</span>
            </div>

            <div class="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
              <p>${escapeHtml(prod.description)}</p>
            </div>

            <div class="space-y-3 pt-4 border-t border-stone-200">
              <h3 class="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider">Product Specifications</h3>
              <div class="bg-white p-4 rounded-2xl border border-amber-200/40 text-xs space-y-1.5">
                <div><strong>Stone Type:</strong> ${escapeHtml(prod.stoneType || 'AAA+ Cubic Zirconia / Kundan')}</div>
                <div><strong>Base Alloy:</strong> 100% Lead-Free & Nickel-Free Premium Brass</div>
                <div><strong>Plating:</strong> 22K Gold Micro-Plated Protective Electroplate</div>
                <div><strong>Earring Posts:</strong> Hypoallergenic 925 Sterling Silver</div>
                <div><strong>Origin:</strong> Proudly Handcrafted by Master Artisans in India</div>
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <a href="/checkout" class="block w-full text-center bg-stone-900 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-full shadow-md transition-colors">
                Order Online (Insured Delivery)
              </a>
              <a href="/shop" class="block w-full text-center bg-white border border-stone-300 text-stone-700 font-semibold text-xs py-3 rounded-full hover:bg-stone-50 transition-colors">
                &larr; Continue Browsing Catalog
              </a>
            </div>
          </div>
        </div>

        ${related.length > 0 ? `
          <section class="space-y-4 pt-10 border-t border-amber-200/50">
            <h3 class="font-serif text-xl font-bold text-stone-900">You May Also Admire</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              ${relatedHtml}
            </div>
          </section>
        ` : ''}

      </main>
      ${renderCommonFooter()}
    </div>
  `;
}

// 3. Render Blog Index HTML
function renderBlogIndexPage(blogs) {
  const blogsHtml = blogs.map(b => `
    <article class="bg-white rounded-3xl overflow-hidden border border-amber-200/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <a href="/blog/${b.slug}" class="block aspect-[16/10] overflow-hidden bg-stone-100">
          <img src="${b.coverImage}" alt="${escapeHtml(b.title)}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
        </a>
        <div class="p-5 space-y-2">
          <div class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">${escapeHtml(b.category)} • ${escapeHtml(b.readTime || '4 min read')}</div>
          <h2 class="font-serif text-lg font-bold text-stone-900 line-clamp-2">
            <a href="/blog/${b.slug}" class="hover:text-rose-700 transition-colors">${escapeHtml(b.title)}</a>
          </h2>
          <p class="text-xs text-stone-600 line-clamp-3 leading-relaxed">${escapeHtml(b.excerpt)}</p>
        </div>
      </div>
      <div class="p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-rose-700 mt-2">
        <span class="text-stone-500 font-normal">${escapeHtml(b.author || 'Ella Stylist')}</span>
        <a href="/blog/${b.slug}" class="hover:underline">Read Article &rarr;</a>
      </div>
    </article>
  `).join('');

  return `
    <div class="min-h-screen flex flex-col font-sans bg-[#FFF6EE] text-[#1c1917]">
      ${renderCommonHeader('/blog')}
      <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <span class="text-xs uppercase font-bold tracking-widest text-amber-700">Editorial & Styling Advice</span>
          <h1 class="font-serif text-3xl sm:text-5xl font-bold text-stone-900">Ella Journal</h1>
          <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Expert Indian bridal jewelry styling guides, uncut Kundan care tips, and festive jewelry fashion advice from the curators at Ella Creations.
          </p>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${blogsHtml}
        </section>
      </main>
      ${renderCommonFooter()}
    </div>
  `;
}

// 4. Render Single Blog Article HTML
function renderBlogDetailPage(blog, allBlogs = []) {
  const otherBlogs = allBlogs.filter(b => b.id !== blog.id).slice(0, 2);

  return `
    <div class="min-h-screen flex flex-col font-sans bg-[#FFF6EE] text-[#1c1917]">
      ${renderCommonHeader('/blog')}
      <main class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <nav class="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
          <a href="/" class="hover:text-rose-700">Home</a>
          <span>/</span>
          <a href="/blog" class="hover:text-rose-700">Ella Journal</a>
          <span>/</span>
          <span class="text-stone-900 font-semibold">${escapeHtml(blog.title)}</span>
        </nav>

        <article class="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/50 shadow-xs space-y-6">
          <div class="space-y-3">
            <span class="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ${escapeHtml(blog.category || 'Jewelry Styling')}
            </span>
            <h1 class="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">${escapeHtml(blog.title)}</h1>
            <div class="text-xs text-stone-500 flex items-center gap-3">
              <span>By ${escapeHtml(blog.author || 'Editorial Team')}</span>
              <span>•</span>
              <span>${escapeHtml(blog.readTime || '5 min read')}</span>
              <span>•</span>
              <span>Published: ${new Date(blog.publishedAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div class="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
            <img src="${blog.coverImage}" alt="${escapeHtml(blog.title)}" class="w-full h-full object-cover" />
          </div>

          <div class="text-sm sm:text-base text-stone-700 leading-relaxed space-y-4">
            <p class="font-serif italic text-base sm:text-lg text-stone-800">${escapeHtml(blog.excerpt)}</p>
            <div class="space-y-4 pt-2">
              ${(blog.content || '').split('\n\n').map(para => `<p>${escapeHtml(para)}</p>`).join('')}
            </div>
          </div>

          <div class="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div class="space-y-1 text-center sm:text-left">
              <h4 class="font-serif text-base font-bold text-stone-900">Explore Ella Creations Fine Catalog</h4>
              <p class="text-xs text-stone-600">Discover our handcrafted Kundan chokers, CZ earrings, and bridal jewels.</p>
            </div>
            <a href="/shop" class="bg-stone-900 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-colors shrink-0">
              Explore Catalog &rarr;
            </a>
          </div>
        </article>

        ${otherBlogs.length > 0 ? `
          <section class="space-y-4 pt-6">
            <h3 class="font-serif text-xl font-bold text-stone-900">More from Ella Journal</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${otherBlogs.map(ob => `
                <div class="bg-white p-4 rounded-2xl border border-amber-200/40 text-xs space-y-2">
                  <h4 class="font-serif font-bold text-sm text-stone-900"><a href="/blog/${ob.slug}" class="hover:text-rose-700">${escapeHtml(ob.title)}</a></h4>
                  <p class="text-stone-600 line-clamp-2">${escapeHtml(ob.excerpt)}</p>
                  <a href="/blog/${ob.slug}" class="text-rose-700 font-semibold inline-block">Read Post &rarr;</a>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

      </main>
      ${renderCommonFooter()}
    </div>
  `;
}

// 5. Render Standalone Legal / Policy Page HTML
function renderLegalPage({ title, category, description, sections }) {
  const sectionsHtml = sections.map((sec, i) => `
    <section class="space-y-2">
      <h2 class="font-serif text-base sm:text-lg font-bold text-stone-900 border-b border-stone-100 pb-1.5">${i + 1}. ${escapeHtml(sec.heading)}</h2>
      <div class="text-stone-700 space-y-2">
        ${sec.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
    </section>
  `).join('');

  return `
    <div class="min-h-screen flex flex-col font-sans bg-[#FFF6EE] text-[#1c1917]">
      ${renderCommonHeader()}
      <main class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <a href="/" class="text-xs text-stone-500 hover:text-rose-700 flex items-center gap-1 font-semibold">&larr; Back to Storefront</a>
        <div class="border-b border-amber-200/50 pb-4 space-y-1">
          <span class="text-xs uppercase font-bold tracking-widest text-amber-700">${escapeHtml(category)}</span>
          <h1 class="font-serif text-2xl sm:text-4xl font-bold text-stone-900">${escapeHtml(title)}</h1>
          <p class="text-xs text-stone-500 font-mono">${escapeHtml(description)}</p>
        </div>

        <div class="bg-white p-6 sm:p-10 rounded-3xl border border-amber-200/50 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed">
          ${sectionsHtml}
        </div>
      </main>
      ${renderCommonFooter()}
    </div>
  `;
}

export function generateAllStaticPages() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Error: dist/index.html not found! Run vite build first.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  let pagesCreated = 0;

  // 0. Home Page (dist/index.html)
  const homeBody = renderHomePage(INITIAL_PRODUCTS, INITIAL_BLOGS);
  const homeHtml = generateStaticHtml(baseHtml, {
    title: 'Ella Creations | Handcrafted Luxury Artificial Jewelry & Bridal Sets India',
    description: 'Discover handcrafted Kundan chokers, AAA+ Cubic Zirconia drop earrings, bridal trousseau sets, and cocktail rings. Free insured express shipping across India.',
    canonicalUrl: domain,
    bodyContent: homeBody
  });
  writePage('', homeHtml);
  pagesCreated++;

  // 1. Shop Page (/shop)
  const shopBody = renderShopPage(INITIAL_PRODUCTS, 'All');
  const shopItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Handcrafted Luxury Artificial Jewelry Collection",
    "numberOfItems": INITIAL_PRODUCTS.length,
    "itemListElement": INITIAL_PRODUCTS.map((prod, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${domain}/product/${getProductSlug(prod)}`,
      "name": prod.title
    }))
  };
  const shopHtml = generateStaticHtml(baseHtml, {
    title: 'Shop Handcrafted Luxury Jewelry | Ella Creations India',
    description: 'Explore our complete royal catalog: handcrafted Kundan chokers, AAA+ Cubic Zirconia drop earrings, solitaire cocktail rings, and bridal sets with insured express delivery across India.',
    canonicalUrl: `${domain}/shop`,
    bodyContent: shopBody,
    jsonLd: shopItemListSchema
  });
  writePage('shop', shopHtml);
  pagesCreated++;

  // 1b. Specific Category Pages
  const categoryRoutes = [
    { path: 'necklaces', cat: 'Necklace', title: 'Handcrafted Kundan & Polki Necklaces | Ella Creations India', desc: 'Shop royal Indian Kundan chokers, bridal rani haars, and gold-plated statement necklaces handcrafted with insured Pan-India shipping.' },
    { path: 'earrings', cat: 'Earring', title: 'AAA+ Cubic Zirconia & Kundan Earrings | Ella Creations India', desc: 'Explore designer Jhumkas, teardrop chandeliers, and CZ solitaire studs crafted with hypoallergenic sterling silver posts.' },
    { path: 'rings', cat: 'Rings', title: 'Solitaire & Floral Cocktail Statement Rings | Ella Creations India', desc: 'Handcrafted adjustable cocktail rings, rose gold diamond-cut CZ solitaires, and royal Indian statement rings.' },
    { path: 'bridal-sets', cat: 'Bridal Sets', title: 'Royal Indian Bridal Trousseau Jewelry Sets | Ella Creations India', desc: 'Complete wedding trousseau sets: choker, long rani haar, matching earrings, and maang tikka for royal brides.' },
    { path: 'bracelets-bangles', cat: 'Bracelets', title: 'Meenakari Enamel & Gold Plated Bangles | Ella Creations India', desc: 'Hand-painted royal Meenakari bangles, gold electroplated kadas, and adjustable crystal cuffs.' }
  ];

  for (const catRoute of categoryRoutes) {
    const catBody = renderShopPage(INITIAL_PRODUCTS, catRoute.cat);
    const catHtml = generateStaticHtml(baseHtml, {
      title: catRoute.title,
      description: catRoute.desc,
      canonicalUrl: `${domain}/${catRoute.path}`,
      bodyContent: catBody
    });
    writePage(catRoute.path, catHtml);
    writePage(`shop/${catRoute.path}`, catHtml);
    pagesCreated += 2;
  }

  // 2. Individual Product Pages (/product/[slug] and /product/[id])
  for (const prod of INITIAL_PRODUCTS) {
    const slug = getProductSlug(prod);
    const prodTitle = `${prod.title} - Handcrafted ${prod.category} | Ella Creations India`;
    const cleanSnippet = (prod.description || '').replace(/\s+/g, ' ').trim().slice(0, 140);
    const prodDesc = `${prod.title}: ${cleanSnippet}... Buy online for ₹${prod.price.toLocaleString('en-IN')}. 100% lead & nickel free brass. Insured Pan-India express delivery.`;
    const mainImg = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : null;

    const prodBody = renderProductDetailPage(prod, INITIAL_PRODUCTS);
    const prodSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": prod.title,
      "image": prod.images || [mainImg],
      "description": prod.description,
      "sku": prod.sku || prod.id,
      "brand": {
        "@type": "Brand",
        "name": "Ella Creations"
      },
      "offers": {
        "@type": "Offer",
        "url": `${domain}/product/${slug}`,
        "priceCurrency": "INR",
        "price": prod.price,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "IN",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 7,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "INR"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "IN"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "d"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 2,
              "maxValue": 5,
              "unitCode": "d"
            }
          }
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(prod.rating || 4.9),
        "reviewCount": String(prod.reviewsCount || 38)
      }
    };

    const prodPageHtml = generateStaticHtml(baseHtml, {
      title: prodTitle,
      description: prodDesc,
      canonicalUrl: `${domain}/product/${slug}`,
      ogImage: mainImg,
      bodyContent: prodBody,
      jsonLd: prodSchema
    });

    writePage(`product/${slug}`, prodPageHtml);
    writePage(`product/${prod.id}`, prodPageHtml);
    pagesCreated += 2;
  }

  // 3. Blog Index (/blog)
  const blogIndexBody = renderBlogIndexPage(INITIAL_BLOGS);
  const blogIndexHtml = generateStaticHtml(baseHtml, {
    title: 'Ella Journal | Indian Jewelry Styling, Kundan Care & Bridal Guides',
    description: 'Read bridal jewelry styling guides, uncut Kundan care instructions, and Indian festive and wedding accessory trend forecasts from Ella Creations.',
    canonicalUrl: `${domain}/blog`,
    bodyContent: blogIndexBody
  });
  writePage('blog', blogIndexHtml);
  pagesCreated++;

  // 3b. Individual Blog Article Pages (/blog/[slug] and /blog/[id])
  for (const b of INITIAL_BLOGS) {
    const blogTitle = `${b.title} | Ella Journal`;
    const blogDesc = b.excerpt 
      ? `${b.excerpt.slice(0, 150)}... Read expert jewelry styling advice on Ella Journal.`
      : `Read "${b.title}" on Ella Journal. Styling and care tips for handcrafted Indian jewelry from Ella Creations.`;

    const blogDetailBody = renderBlogDetailPage(b, INITIAL_BLOGS);
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": b.title,
      "image": b.coverImage,
      "author": {
        "@type": "Person",
        "name": b.author || "Ella Creations Editorial"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Ella Creations",
        "logo": {
          "@type": "ImageObject",
          "url": `${domain}/logo.png`
        }
      },
      "datePublished": b.publishedAt || "2026-08-01",
      "description": b.excerpt
    };

    const blogPageHtml = generateStaticHtml(baseHtml, {
      title: blogTitle,
      description: blogDesc,
      canonicalUrl: `${domain}/blog/${b.slug}`,
      ogImage: b.coverImage,
      bodyContent: blogDetailBody,
      jsonLd: blogSchema
    });

    writePage(`blog/${b.slug}`, blogPageHtml);
    writePage(`blog/${b.id}`, blogPageHtml);
    pagesCreated += 2;
  }

  // 4. Standalone Legal & Policy Pages
  const legalPages = [
    {
      path: 'terms',
      alias: 'terms-of-service',
      title: 'Terms & Conditions of Service | Ella Creations India',
      category: 'Legal & Commercial Agreement',
      description: 'Governed by the Information Technology Act, 2000 and Consumer Protection (E-Commerce) Rules, 2020.',
      sections: [
        { heading: 'Overview & Acceptance', paragraphs: ['These terms govern all visits, orders, and commercial transactions on ella-creations.com. By accessing our platform, you agree to be bound by these provisions.', 'Ella Creations reserves the right to amend or update terms at any time with immediate effect upon posting.'] },
        { heading: 'Product Representation & Metallurgy', paragraphs: ['All catalog items are fine fashion / artificial jewelry handcrafted from brass alloy bases with 22K gold electroplating. Products are not solid gold or natural mined diamonds unless explicitly certified.', 'Because every piece is handcrafted, subtle variations in pearl luster, stone setting, or enamel shading are hallmark traits of authentic artisan craft.'] },
        { heading: 'Pricing, Taxes & Order Authorization', paragraphs: ['All prices listed are in Indian Rupees (INR) and inclusive of applicable GST unless explicitly displayed otherwise. We reserve the right to correct typographical pricing discrepancies prior to fulfillment.'] },
        { heading: 'Shipping & Delivery Handover', paragraphs: ['Orders are dispatched via verified express courier networks. Customers must inspect outer tamper-evident packaging before accepting delivery and refuse damaged parcels.'] }
      ]
    },
    {
      path: 'privacy',
      alias: 'privacy-policy',
      title: 'Privacy Policy & Data Security | Ella Creations India',
      category: 'Data Protection & DPDP Compliance',
      description: 'Compliant with Digital Personal Data Protection Act, 2023 (DPDP) and IT Act 2000.',
      sections: [
        { heading: 'Data Collection Principles', paragraphs: ['We collect only personal information strictly necessary to process orders, generate shipping waybills, and comply with Indian commercial taxation laws.', 'Payment card and UPI credentials are processed directly through 256-bit SSL encrypted Razorpay payment gateways; Ella Creations never stores raw banking data on its servers.'] },
        { heading: 'Customer Rights & Data Rectification', paragraphs: ['Customers hold full rights under the DPDP Act to review, rectify, or request permanent deletion of their personal information from our fulfillment systems at any time by contacting support@ella-creations.com.'] }
      ]
    },
    {
      path: 'refund-policy',
      alias: 'returns-refunds',
      title: 'Return, Replacement & Refund Policy | Ella Creations India',
      category: 'Consumer Protection & Hygiene Standards',
      description: '48-hour transit defect reporting window and hygiene protection policy.',
      sections: [
        { heading: 'Intimate Hygiene & Final Sale Notice', paragraphs: ['Due to strict skin-hygiene regulations governing fashion earrings, chokers, and body jewelry, delivered pieces cannot be returned or exchanged for change of mind or personal preference.'] },
        { heading: '48-Hour Transit Defect Protection', paragraphs: ['In the rare circumstance that a piece arrives transit-damaged or with a manufacturing fault, report the claim to support@ella-creations.com within 48 hours of delivery accompanied by an unedited continuous parcel unboxing video.', 'Approved defect claims are issued an immediate free replacement dispatch or 100% refund via original payment method.'] }
      ]
    },
    {
      path: 'shipping-policy',
      title: 'Shipping & Express Delivery Policy | Ella Creations India',
      category: 'Logistics & Pan-India Dispatch',
      description: 'Fast, insured express courier delivery to all serviceable Indian pincodes.',
      sections: [
        { heading: 'Dispatch Schedules & Timelines', paragraphs: ['Standard orders dispatch within 24 to 48 business hours from our central fulfillment center. Transit durations range between 2 to 6 business days depending on distance and metro status.'] },
        { heading: 'Full Transit Insurance', paragraphs: ['Every single order dispatched by Ella Creations is 100% insured against loss, theft, or courier damage during transit until verified physical handover at your doorstep.'] }
      ]
    },
    {
      path: 'brand-guidelines',
      alias: 'jewelry-care',
      title: 'Jewelry Care & Metallurgy Guide | Ella Creations India',
      category: 'Artisanal Craft & Preservation Standards',
      description: 'Care instructions to keep your Kundan and CZ jewels sparkling for years.',
      sections: [
        { heading: 'The "Last On, First Off" Rule', paragraphs: ['Always put your fashion jewelry on after applying perfumes, hairsprays, lotions, and cosmetics. Take it off before sleeping or exercising.'] },
        { heading: 'Safe Cleaning & Storage', paragraphs: ['Never clean Kundan or artificial jewelry with water, dish soap, or chemical dips. Gently wipe with a dry micro-fiber cloth after each wear, and store in airtight ziplock pouches in a dark, dry place.'] }
      ]
    }
  ];

  for (const lp of legalPages) {
    const legalBody = renderLegalPage(lp);
    const legalHtml = generateStaticHtml(baseHtml, {
      title: lp.title,
      description: lp.description,
      canonicalUrl: `${domain}/${lp.path}`,
      bodyContent: legalBody
    });
    writePage(lp.path, legalHtml);
    if (lp.alias) {
      writePage(lp.alias, legalHtml);
      pagesCreated++;
    }
    pagesCreated++;
  }

  // 5. Dedicated 404 Error Page (dist/404.html)
  const notFoundHtml = generate404Html(baseHtml);
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');
  fs.writeFileSync(path.resolve(__dirname, '../public/404.html'), notFoundHtml, 'utf-8');
  pagesCreated++;

  // 6. Ensure .nojekyll in dist for GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '# Disable Jekyll\n', 'utf-8');

  console.log(`Successfully generated ${pagesCreated} static HTML pages with FULL pre-rendered content in ./dist!`);
}

function generate404Html(baseHtml) {
  const fallback404Content = `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px; font-family: 'Playfair Display', serif, system-ui; text-align: center; color: #333333; background: #FFF6EE;">
      <div style="max-width: 580px; width: 100%; background: #ffffff; border: 1px solid rgba(207, 164, 92, 0.35); border-radius: 28px; padding: 40px 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.06); position: relative; overflow: hidden;">
        <div style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: #FFF6EE; border: 1px solid rgba(207,164,92,0.4); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #CFA45C; margin-bottom: 20px;">
          ✦ Error 404 • Page Not Found ✦
        </div>
        <h1 style="font-size: 64px; font-weight: 900; margin: 0; line-height: 1; color: #1c1917;">
          4<span style="color: #D49AA5;">0</span>4
        </h1>
        <h2 style="font-size: 22px; font-weight: 700; margin: 16px 0 8px; color: #1c1917;">
          This Jewelry Piece Could Not Be Found
        </h2>
        <p style="font-family: 'Montserrat', sans-serif; font-size: 13px; color: #666666; line-height: 1.6; max-width: 420px; margin: 0 auto 28px;">
          The page or piece you are seeking may have been renamed, archived, or is momentarily hidden in our royal vaults.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="/" style="background: #D49AA5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px;">
            Return to Storefront
          </a>
          <a href="/shop" style="background: #1c1917; color: #FFF6EE; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px;">
            Explore All Jewelry
          </a>
        </div>
      </div>
    </div>
  `;

  let html = generateStaticHtml(baseHtml, {
    title: '404: Page Not Found | Ella Creations India',
    description: 'The jewelry piece or page you are looking for cannot be found. Return to Ella Creations storefront.',
    canonicalUrl: `${domain}/404`,
    bodyContent: fallback404Content
  });

  return html;
}

// Run standalone
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateAllStaticPages();
}
