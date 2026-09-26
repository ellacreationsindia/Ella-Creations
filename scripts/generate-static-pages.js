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

function generateStaticHtml(baseHtml, { title, description, canonicalUrl, ogImage }) {
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

  return html;
}

function writePage(relPath, htmlContent) {
  const targetFile = path.join(distDir, relPath, 'index.html');
  const targetDir = path.dirname(targetFile);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, htmlContent, 'utf-8');
}

export function generateAllStaticPages() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Error: dist/index.html not found! Run vite build first.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  let pagesCreated = 0;

  // 1. Core Brand Pages
  const staticRoutes = [
    {
      path: 'shop',
      title: 'Shop Handcrafted Luxury Jewelry | Ella Creations India',
      description: 'Explore our complete royal catalog: handcrafted Kundan chokers, AAA+ Cubic Zirconia drop earrings, solitaire cocktail rings, and bridal sets with insured express delivery across India.'
    },
    {
      path: 'blog',
      title: 'Ella Journal | Indian Jewelry Styling, Kundan Care & Bridal Guides',
      description: 'Read bridal jewelry styling guides, uncut Kundan care instructions, and Indian festive and wedding accessory trend forecasts from Ella Creations.'
    },
    {
      path: 'terms',
      title: 'Terms & Conditions | Ella Creations India',
      description: 'Official terms of service, ordering policies, insured shipping terms, and payment terms for Ella Creations luxury artificial jewelry.'
    },
    {
      path: 'privacy',
      title: 'Privacy Policy & Data Security | Ella Creations India',
      description: 'DPDP Act compliant privacy policy, Razorpay 256-bit SSL encrypted checkout, and customer privacy protection standards at Ella Creations.'
    },
    {
      path: 'refund-policy',
      title: 'Return & Refund Policy | Ella Creations India',
      description: 'Transparent 48-hour replacement and damage protection policy for handcrafted artificial jewelry orders delivered across India.'
    },
    {
      path: 'shipping-policy',
      title: 'Shipping & Delivery Policy | Ella Creations India',
      description: 'Pan-India insured express shipping details, premium courier dispatch timelines, tracking updates, and signature delivery at Ella Creations.'
    },
    {
      path: 'brand-guidelines',
      title: 'Jewelry Care & Brand Heritage | Ella Creations India',
      description: 'Learn how to care for your artificial jewelry, our lead-free and nickel-free brass metallurgy, gold polish preservation, and artisan heritage.'
    },
    {
      path: 'sitemap',
      title: 'Website Sitemap & Catalog Directory | Ella Creations India',
      description: 'Structured directory of all product collections, category navigation, blog articles, and machine-readable AI manifests on Ella Creations.'
    },
    {
      path: 'checkout',
      title: 'Secure Checkout | Ella Creations India',
      description: 'Complete your luxury jewelry order with encrypted UPI, Debit/Credit Card, Net Banking, or Cash on Delivery at Ella Creations.'
    },
    {
      path: 'account',
      title: 'Customer Account & Orders | Ella Creations India',
      description: 'Access your Ella Creations account to view recent jewelry orders, saved shipping addresses, and live dispatch tracking.'
    },
    {
      path: 'admin',
      title: 'Admin Control Center | Ella Creations India',
      description: 'Authorized administrator portal for product inventory, promotions, and order fulfillment.'
    },
    // Common aliases to prevent 404 on legacy or direct links
    { 
      path: 'jewelry-care', 
      title: 'Jewelry Care & Cleaning Guide | Ella Creations India', 
      description: 'Expert tips on keeping your handcrafted Kundan and CZ artificial jewelry sparkling, tarnish-free, and protected for years.' 
    },
    { 
      path: 'terms-of-service', 
      title: 'Terms of Service | Ella Creations India', 
      description: 'Review our store terms of service, customer commitments, delivery terms, and customer care policies.' 
    },
    { 
      path: 'privacy-policy', 
      title: 'Customer Privacy Policy | Ella Creations India', 
      description: 'Our comprehensive privacy policy outlining customer information protection, safe transactions, and DPDP compliance.' 
    },
    { 
      path: 'returns-refunds', 
      title: 'Returns & Replacement Policy | Ella Creations India', 
      description: 'Hassle-free replacement policy for transit-damaged jewelry pieces with dedicated customer concierge assistance.' 
    },
    { 
      path: 'about', 
      title: 'About Ella Creations | Handcrafted Indian Luxury Jewelry House', 
      description: 'Discover the artisans, heritage craftsmanship, and royal Indian aesthetic behind Ella Creations handcrafted artificial jewelry.' 
    },
    { 
      path: 'contact', 
      title: 'Contact Concierge Support | Ella Creations India', 
      description: 'Get in touch with Ella Creations concierge team via WhatsApp (+91 91799 44342) and email for bespoke jewelry queries.' 
    },
    { 
      path: 'ring-size-guide', 
      title: 'Ring & Bangle Size Guide | Ella Creations India', 
      description: 'Step-by-step measurement guide to find your perfect fit for adjustable cocktail rings, chokers, and royal Indian bangles.' 
    }
  ];

  for (const route of staticRoutes) {
    const pageHtml = generateStaticHtml(baseHtml, {
      title: route.title,
      description: route.description,
      canonicalUrl: `${domain}/${route.path}`
    });
    writePage(route.path, pageHtml);
    pagesCreated++;
  }

  // 2. Individual Products Pages
  for (const prod of INITIAL_PRODUCTS) {
    const slug = getProductSlug(prod);
    const prodTitle = `${prod.title} - Handcrafted ${prod.category} | Ella Creations India`;
    const cleanSnippet = (prod.description || '').replace(/\s+/g, ' ').trim().slice(0, 140);
    const prodDesc = cleanSnippet
      ? `${prod.title}: ${cleanSnippet}... Buy online for ₹${prod.price.toLocaleString('en-IN')}. Insured Pan-India shipping.`
      : `Buy ${prod.title} handcrafted in India online for ₹${prod.price.toLocaleString('en-IN')}. Premium ${prod.category} artificial jewelry with insured pan-India delivery.`;
    const mainImg = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : null;

    const pageHtml = generateStaticHtml(baseHtml, {
      title: prodTitle,
      description: prodDesc,
      canonicalUrl: `${domain}/product/${slug}`,
      ogImage: mainImg
    });

    // Write slug path
    writePage(`product/${slug}`, pageHtml);
    // Write legacy ID path
    writePage(`product/${prod.id}`, pageHtml);
    pagesCreated += 2;
  }

  // 3. Ella Journal Blog Articles
  for (const b of INITIAL_BLOGS) {
    const blogTitle = `${b.title} | Ella Journal`;
    const blogDesc = b.excerpt 
      ? `${b.excerpt.slice(0, 150)}... Read expert jewelry styling advice on Ella Journal.`
      : `Read "${b.title}" on Ella Journal. Styling and care tips for handcrafted Indian jewelry from Ella Creations.`;

    const pageHtml = generateStaticHtml(baseHtml, {
      title: blogTitle,
      description: blogDesc,
      canonicalUrl: `${domain}/blog/${b.slug}`,
      ogImage: b.coverImage
    });

    writePage(`blog/${b.slug}`, pageHtml);
    writePage(`blog/${b.id}`, pageHtml);
    pagesCreated += 2;
  }

  // 4. Dedicated 404 Error Page (dist/404.html)
  // Essential for GitHub Pages: Acts as both the SPA fallback handler and standalone branded error screen
  const notFoundHtml = generate404Html(baseHtml);
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');
  fs.writeFileSync(path.resolve(__dirname, '../public/404.html'), notFoundHtml, 'utf-8');
  pagesCreated++;

  // 5. Ensure .nojekyll in dist
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '# Disable Jekyll\n', 'utf-8');

  console.log(`Successfully generated ${pagesCreated} static HTML pages in ./dist for 100% direct-navigation GitHub Pages support!`);
}

function generate404Html(baseHtml) {
  // Inject standalone luxury fallback UI directly into the initial root div so if JS is slow or disabled, it shows immediately
  const fallback404Content = `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px; font-family: 'Playfair Display', serif, system-ui; text-align: center; color: #333333; background: #FFF6EE;">
      <div style="max-width: 580px; width: 100%; background: #ffffff; border: 1px solid rgba(207, 164, 92, 0.35); border-radius: 28px; padding: 40px 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.06); position: relative; overflow: hidden;">
        
        <div style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: #FFF6EE; border: 1px solid rgba(207,164,92,0.4); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #CFA45C; margin-bottom: 20px;">
          ✦ Error 404 • Missing Splendor ✦
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
          <a href="/" style="background: #D49AA5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(212,154,165,0.4);">
            Return to Storefront
          </a>
          <a href="/shop" style="background: #1c1917; color: #FFF6EE; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px;">
            Explore All Jewelry
          </a>
        </div>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f3e7da; font-family: 'Montserrat', sans-serif;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a8a29e; display: block; margin-bottom: 10px;">Popular Collections</span>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <a href="/shop?category=Necklace" style="font-size: 11px; padding: 4px 12px; border-radius: 9999px; background: #FFF6EE; border: 1px solid rgba(207,164,92,0.3); color: #44403c; text-decoration: none;">Necklaces</a>
            <a href="/shop?category=Earring" style="font-size: 11px; padding: 4px 12px; border-radius: 9999px; background: #FFF6EE; border: 1px solid rgba(207,164,92,0.3); color: #44403c; text-decoration: none;">Earrings</a>
            <a href="/shop?category=Rings" style="font-size: 11px; padding: 4px 12px; border-radius: 9999px; background: #FFF6EE; border: 1px solid rgba(207,164,92,0.3); color: #44403c; text-decoration: none;">Rings</a>
            <a href="/shop?category=Bridal%20Sets" style="font-size: 11px; padding: 4px 12px; border-radius: 9999px; background: #FFF6EE; border: 1px solid rgba(207,164,92,0.3); color: #44403c; text-decoration: none;">Bridal Sets</a>
          </div>
        </div>

      </div>
    </div>
  `;

  let html = generateStaticHtml(baseHtml, {
    title: '404: Page Not Found | Ella Creations India',
    description: 'The jewelry piece or page you are looking for cannot be found. Return to Ella Creations storefront.',
    canonicalUrl: `${domain}/404`
  });

  // Inject fallback markup inside #root
  html = html.replace('<div id="root"></div>', `<div id="root">${fallback404Content}</div>`);
  return html;
}

// Run standalone
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateAllStaticPages();
}
