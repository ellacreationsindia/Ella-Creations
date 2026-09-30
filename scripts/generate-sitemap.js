import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_BLOGS } from '../src/data/initialData.js';
import { encryptId } from '../src/utils/idSecurity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const today = new Date().toISOString().split('T')[0];
const domain = 'https://ella-creations.com';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">\n\n';

// Helper to append standard URL with AI & Internationalization alternates
function renderUrlEntry({ loc, priority, changefreq, images = [] }) {
  let entry = '  <url>\n';
  entry += `    <loc>${loc}</loc>\n`;
  entry += `    <lastmod>${today}</lastmod>\n`;
  entry += `    <changefreq>${changefreq}</changefreq>\n`;
  entry += `    <priority>${priority}</priority>\n`;
  entry += `    <xhtml:link rel="alternate" hreflang="en-IN" href="${loc}"/>\n`;
  entry += `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>\n`;

  for (const img of images) {
    if (img && img.loc) {
      entry += '    <image:image>\n';
      entry += `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
      if (img.title) entry += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
      if (img.caption) entry += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
      entry += '    </image:image>\n';
    }
  }

  entry += '  </url>\n';
  return entry;
}

// 1. Core Brand Pages
xml += '  <!-- 1. Core Brand Landing Pages -->\n';
xml += renderUrlEntry({
  loc: `${domain}/`,
  priority: '1.00',
  changefreq: 'daily',
  images: [{
    loc: `${domain}/logo.png`,
    title: 'Ella Creations - Handcrafted Luxury Artificial & Bridal Jewelry India',
    caption: 'Contemporary luxury artificial jewelry brand in India'
  }]
});

xml += renderUrlEntry({
  loc: `${domain}/shop`,
  priority: '0.95',
  changefreq: 'daily'
});

// 2. Jewelry Categories
const categories = [
  { name: 'Necklace', title: 'Handcrafted Royal Kundan Chokers & Rani Haars', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000', prio: '0.90' },
  { name: 'Earring', title: 'AAA+ Cubic Zirconia Drop Earrings & Peacock Jhumkas', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000', prio: '0.90' },
  { name: 'Rings', title: 'Solitaire & Floral Statement Cocktail Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000', prio: '0.85' },
  { name: 'Bracelets/Bangles', title: 'Imperial Hand-Enameled Meenakari Bangles & Cuffs', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', prio: '0.85' },
  { name: 'Pendant Set', title: 'Rose Gold & Diamond Look CZ Pendant Sets', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000', prio: '0.85' },
  { name: 'Sets', title: 'Bridal & Festive Jewelry Complete Sets', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000', prio: '0.90' },
  { name: 'Bridal Sets', title: 'Grand Wedding Bridal Troussau Ensembles', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1000', prio: '0.95' },
  { name: 'Others', title: 'Accessories & Special Jewelry Pieces', img: 'https://images.unsplash.com/photo-1611591475819-79b8b4a742cd?auto=format&fit=crop&q=80&w=1000', prio: '0.75' },
  { name: 'Sale', title: 'Exclusive Festive Jewelry Deals & Promotional Sale', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', prio: '0.95' }
];

// 2. Jewelry Dedicated Category Landing Pages
xml += '\n  <!-- 2. Dedicated Category Landing Pages -->\n';
const canonicalCategoryRoutes = [
  { path: 'necklaces', cat: 'Necklace', title: 'Handcrafted Royal Kundan Chokers & Rani Haars', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000', prio: '0.90' },
  { path: 'earrings', cat: 'Earring', title: 'AAA+ Cubic Zirconia Drop Earrings & Peacock Jhumkas', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000', prio: '0.90' },
  { path: 'rings', cat: 'Rings', title: 'Solitaire & Floral Statement Cocktail Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000', prio: '0.85' },
  { path: 'bridal-sets', cat: 'Bridal Sets', title: 'Grand Wedding Bridal Troussau Ensembles', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1000', prio: '0.95' },
  { path: 'bracelets-bangles', cat: 'Bracelets/Bangles', title: 'Imperial Hand-Enameled Meenakari Bangles & Cuffs', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', prio: '0.85' }
];

for (const cRoute of canonicalCategoryRoutes) {
  xml += renderUrlEntry({
    loc: `${domain}/${cRoute.path}`,
    priority: cRoute.prio,
    changefreq: 'weekly',
    images: [{
      loc: cRoute.img,
      title: cRoute.title
    }]
  });
}

// 3. Individual Products (with Encrypted IDs and Rich Google Image schema)
xml += '\n  <!-- 3. Individual Handcrafted Products (With Encrypted Canonical Slugs) -->\n';
for (const prod of INITIAL_PRODUCTS) {
  const slug = getProductSlug(prod);
  const cleanTitle = prod.title;
  const cleanDesc = (prod.description || '').slice(0, 150);
  const prodImages = [];
  if (Array.isArray(prod.images)) {
    for (const img of prod.images.slice(0, 3)) {
      prodImages.push({
        loc: img,
        title: `${cleanTitle} | Ella Creations`,
        caption: cleanDesc
      });
    }
  }

  xml += renderUrlEntry({
    loc: `${domain}/product/${slug}`,
    priority: '0.85',
    changefreq: 'weekly',
    images: prodImages
  });
}

// 4. Ella Journal Articles
xml += '\n  <!-- 4. Ella Journal & Styling Articles -->\n';
xml += renderUrlEntry({
  loc: `${domain}/blog`,
  priority: '0.80',
  changefreq: 'weekly'
});

for (const b of INITIAL_BLOGS) {
  const blogImages = [];
  if (b.coverImage) {
    blogImages.push({
      loc: b.coverImage,
      title: b.title
    });
  }

  xml += renderUrlEntry({
    loc: `${domain}/blog/${b.slug}`,
    priority: '0.75',
    changefreq: 'monthly',
    images: blogImages
  });
}

// 5. Brand Information & Legal Policies
xml += '\n  <!-- 5. Brand Information & Legal Policies -->\n';
const infoPages = [
  { path: '/brand-guidelines', priority: '0.80', changefreq: 'monthly' },
  { path: '/sitemap', priority: '0.75', changefreq: 'weekly' },
  { path: '/shipping-policy', priority: '0.65', changefreq: 'monthly' },
  { path: '/refund-policy', priority: '0.65', changefreq: 'monthly' },
  { path: '/terms', priority: '0.60', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.60', changefreq: 'monthly' }
];

for (const p of infoPages) {
  xml += renderUrlEntry({
    loc: `${domain}${p.path}`,
    priority: p.priority,
    changefreq: p.changefreq
  });
}

xml += '</urlset>\n';

const targetPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(targetPath, xml, 'utf-8');
console.log('Successfully written agentic-friendly sitemap.xml to:', targetPath, `(${xml.length} bytes)`);

// 6. Generate Machine-Readable LLM Full Knowledge Catalog (llms-full.txt)
let llmsFull = `# Ella Creations - Full Agentic Catalog & Knowledge Base (llms-full.txt)
> Website: https://ella-creations.com
> Brand Identity: Handcrafted Luxury Artificial, Kundan & CZ Bridal Jewelry India
> Official Support: support@ella-creations.com | WhatsApp: +91 91799 44342
> Operating Location: Bhopal, Madhya Pradesh, India (Pan-India Insured Express Courier Delivery)
> Last Updated: ${today}

## Brand & Craftsmanship Benchmarks
- Metal Matrix: 100% Lead-Free & Nickel-Free Hypoallergenic Skin-Safe Brass Alloy.
- Electroplating: 22K/24K Gold and Rhodium Multi-Layer Flash Micron Polish with Anti-Tarnish barrier.
- Stones: Hand-cut uncut Polki Kundan, AAA+ Cubic Zirconia crystals, cultured simulated pearls.
- Shipping: Insured express dispatch across India with tracking. Free delivery on orders over ₹999.
- Returns: Hassle-free 7-day doorstep replacement & return warranty on damaged or defective items.

## Core Navigation URLs
- Homepage: https://ella-creations.com/
- All Products: https://ella-creations.com/shop
- Festive & Sale Collection: https://ella-creations.com/shop?category=Sale
- Royal Kundan Necklaces: https://ella-creations.com/necklaces
- CZ Drop Earrings & Jhumkas: https://ella-creations.com/earrings
- Solitaire & Cocktail Rings: https://ella-creations.com/rings
- Complete Bridal Sets: https://ella-creations.com/bridal-sets
- Meenakari Bangles: https://ella-creations.com/bracelets-bangles
- Pendant Sets: https://ella-creations.com/shop?category=Pendant%20Set
- Ella Journal & Guides: https://ella-creations.com/blog
- Jewelry Care Guidelines: https://ella-creations.com/brand-guidelines
- Shipping Policy: https://ella-creations.com/shipping-policy
- Return Policy: https://ella-creations.com/refund-policy
- Terms: https://ella-creations.com/terms
- Privacy: https://ella-creations.com/privacy
- Sitemap: https://ella-creations.com/sitemap

## Complete Handcrafted Catalog Index (${INITIAL_PRODUCTS.length} Items)

`;

for (let i = 0; i < INITIAL_PRODUCTS.length; i++) {
  const p = INITIAL_PRODUCTS[i];
  const slug = getProductSlug(p);
  llmsFull += `### ${i + 1}. ${p.title}\n`;
  llmsFull += `- URL: https://ella-creations.com/product/${slug}\n`;
  llmsFull += `- Category: ${p.category}\n`;
  llmsFull += `- Price: ₹${p.price.toLocaleString('en-IN')}${p.originalPrice ? ` (Original: ₹${p.originalPrice.toLocaleString('en-IN')})` : ''}\n`;
  if (p.stoneType) llmsFull += `- Gemstone / Material: ${p.stoneType}\n`;
  if (p.plating) llmsFull += `- Plating: ${p.plating}\n`;
  if (p.description) llmsFull += `- Overview: ${p.description}\n`;
  if (Array.isArray(p.details) && p.details.length > 0) {
    llmsFull += `- Highlights: ${p.details.join('; ')}\n`;
  }
  llmsFull += `\n`;
}

const llmsPath = path.resolve(__dirname, '../public/llms-full.txt');
fs.writeFileSync(llmsPath, llmsFull, 'utf-8');
console.log('Successfully written agentic llms-full.txt to:', llmsPath, `(${llmsFull.length} bytes)`);
