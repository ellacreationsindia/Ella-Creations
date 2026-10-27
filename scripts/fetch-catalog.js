// Build-time catalog fetcher: pulls real products & blogs from Supabase.
// Falls back to seed data if the network / credentials fail so builds never break.
import { INITIAL_PRODUCTS, INITIAL_BLOGS } from '../src/data/initialData.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mjcdvzmlutbkfgsaafmm.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_HLlGszFXX9eBt9_3DFv1LA_KuCQkTZz';

async function restFetch(path) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json'
    }
  });
  if (!res.ok) throw new Error(`Supabase ${path} ${res.status}`);
  return res.json();
}

function normalizeProduct(p) {
  return {
    id: p.id,
    title: p.title || '',
    category: p.category || 'Jewelry',
    price: Number(p.price) || 0,
    comparePrice: Number(p.compare_price || p.comparePrice) || 0,
    rating: Number(p.rating) || 0,
    reviewsCount: Number(p.reviews_count || p.reviewsCount) || 0,
    stock: Number(p.stock) || 0,
    sku: p.sku || '',
    stoneType: p.stone_type || p.stoneType || '',
    isFeatured: !!(p.is_featured || p.isFeatured),
    isNew: !!(p.is_new || p.isNew),
    images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? safeParseJson(p.images, []) : []),
    description: p.description || '',
    createdAt: p.created_at || p.createdAt || null
  };
}

function normalizeBlog(b) {
  return {
    id: b.id,
    title: b.title || '',
    slug: b.slug || String(b.id || '').toLowerCase(),
    excerpt: b.excerpt || '',
    content: b.content || '',
    author: b.author || 'Ella Editorial',
    category: b.category || 'Styling',
    coverImage: b.cover_image || b.coverImage || '',
    readTime: b.read_time || b.readTime || '',
    publishedAt: b.published_at || b.publishedAt || null
  };
}

function safeParseJson(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}

export async function fetchCatalog() {
  // Preserve the hardcoded ids filter used by StoreContext (system ids skipped)
  try {
    const [products, blogs] = await Promise.all([
      restFetch('products?select=*').catch(() => null),
      restFetch('blogs?select=*&order=created_at.desc').catch(() => null)
    ]);

    const prodList = Array.isArray(products) && products.length > 0
      ? products
          .filter(p => p && p.id && !String(p.id).startsWith('__system'))
          .map(normalizeProduct)
          .filter(p => p.title && p.price > 0)
      : INITIAL_PRODUCTS;

    const blogList = Array.isArray(blogs) && blogs.length > 0
      ? blogs.map(normalizeBlog).filter(b => b.title)
      : INITIAL_BLOGS;

    console.log(`[fetch-catalog] Loaded ${prodList.length} products, ${blogList.length} blogs${products ? ' (from Supabase)' : ' (from seed fallback)'}`);
    return { products: prodList, blogs: blogList, source: products ? 'supabase' : 'seed' };
  } catch (err) {
    console.warn('[fetch-catalog] Supabase fetch failed, using seed data:', err.message);
    return { products: INITIAL_PRODUCTS, blogs: INITIAL_BLOGS, source: 'seed' };
  }
}
