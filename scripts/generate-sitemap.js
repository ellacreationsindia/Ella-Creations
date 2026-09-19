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

const getProductSlug = (p) => `${slugify(p.title)}--${encryptId(p.id)}`;

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
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">\n\n';

// 1. Core Brand Pages
xml += '  <!-- 1. Core Brand Landing Pages -->\n';
xml += `  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
    <image:image>
      <image:loc>${domain}/logo.png</image:loc>
      <image:title>Ella Creations - Handcrafted Luxury Artificial &amp; Bridal Jewelry India</image:title>
      <image:caption>Contemporary luxury artificial jewelry brand in India</image:caption>
    </image:image>
  </url>\n\n`;

xml += `  <url>
    <loc>${domain}/shop</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>\n\n`;

// 2. Jewelry Categories
const categories = [
  { name: 'Necklace', title: 'Handcrafted Royal Kundan Chokers &amp; Rani Haars', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000', prio: '0.90' },
  { name: 'Earring', title: 'AAA+ Cubic Zirconia Drop Earrings &amp; Peacock Jhumkas', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000', prio: '0.90' },
  { name: 'Rings', title: 'Solitaire &amp; Floral Statement Cocktail Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000', prio: '0.85' },
  { name: 'Bracelets/Bangles', title: 'Imperial Hand-Enameled Meenakari Bangles &amp; Cuffs', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', prio: '0.85' },
  { name: 'Pendant Set', title: 'Rose Gold &amp; Diamond Look CZ Pendant Sets', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000', prio: '0.85' },
  { name: 'Sets', title: 'Bridal &amp; Festive Jewelry Complete Sets', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000', prio: '0.90' },
  { name: 'Bridal Sets', title: 'Grand Wedding Bridal Troussau Ensembles', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1000', prio: '0.95' },
  { name: 'Others', title: 'Accessories &amp; Special Jewelry Pieces', img: 'https://images.unsplash.com/photo-1611591475819-79b8b4a742cd?auto=format&fit=crop&q=80&w=1000', prio: '0.75' },
  { name: 'Sale', title: 'Exclusive Festive Jewelry Deals &amp; Promotional Sale', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', prio: '0.95' }
];

xml += '  <!-- 2. Category Landing Pages -->\n';
for (const cat of categories) {
  const encodedCat = encodeURIComponent(cat.name);
  xml += `  <url>
    <loc>${domain}/shop?category=${encodedCat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${cat.prio}</priority>
    <image:image>
      <image:loc>${escapeXml(cat.img)}</image:loc>
      <image:title>${cat.title}</image:title>
    </image:image>
  </url>\n`;
}
xml += '\n';

// 3. Individual Products (with Encrypted IDs and Rich Google Image schema)
xml += '  <!-- 3. Individual Handcrafted Products (With Encrypted Canonical Slugs) -->\n';
for (const prod of INITIAL_PRODUCTS) {
  const slug = getProductSlug(prod);
  const cleanTitle = escapeXml(prod.title);
  const cleanDesc = escapeXml((prod.description || '').slice(0, 150));
  xml += `  <url>
    <loc>${domain}/product/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>\n`;
  
  if (Array.isArray(prod.images) && prod.images.length > 0) {
    for (const img of prod.images.slice(0, 3)) {
      xml += `    <image:image>
      <image:loc>${escapeXml(img)}</image:loc>
      <image:title>${cleanTitle} | Ella Creations</image:title>
      <image:caption>${cleanDesc}</image:caption>
    </image:image>\n`;
    }
  }
  xml += '  </url>\n';
}
xml += '\n';

// 4. Ella Journal Articles
xml += '  <!-- 4. Ella Journal & Styling Articles -->\n';
xml += `  <url>
    <loc>${domain}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>\n`;
for (const b of INITIAL_BLOGS) {
  const cleanBTitle = escapeXml(b.title);
  xml += `  <url>
    <loc>${domain}/blog/${escapeXml(b.slug)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>\n`;
  if (b.coverImage) {
    xml += `    <image:image>
      <image:loc>${escapeXml(b.coverImage)}</image:loc>
      <image:title>${cleanBTitle}</image:title>
    </image:image>\n`;
  }
  xml += '  </url>\n';
}
xml += '\n';

// 5. Brand Information & Legal Policies
xml += '  <!-- 5. Brand Information & Legal Policies -->\n';
const infoPages = [
  { path: '/about', priority: '0.70' },
  { path: '/contact', priority: '0.75' },
  { path: '/ring-size-guide', priority: '0.70' },
  { path: '/shipping-policy', priority: '0.60' },
  { path: '/returns-refunds', priority: '0.60' },
  { path: '/terms-of-service', priority: '0.50' },
  { path: '/privacy-policy', priority: '0.50' }
];

for (const p of infoPages) {
  xml += `  <url>
    <loc>${domain}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
  </url>\n`;
}

xml += '</urlset>\n';

const targetPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(targetPath, xml, 'utf-8');
console.log('Successfully written sitemap.xml to:', targetPath, `(${xml.length} bytes)`);
