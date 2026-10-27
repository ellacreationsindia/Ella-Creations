// Google Analytics 4 wrapper. Safe no-op if gtag isn't loaded (e.g. ad blockers).
const GA_ID = 'G-TGG30E71ZG';

function gtag(...args) {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push(args);
  if (typeof window.gtag === 'function') window.gtag(...args);
}

export function trackPageView(path, title) {
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: typeof window !== 'undefined' ? window.location.href : path,
    send_to: GA_ID
  });
}

export function trackViewItem(product) {
  if (!product) return;
  gtag('event', 'view_item', {
    currency: 'INR',
    value: Number(product.price) || 0,
    items: [{
      item_id: String(product.id || product.sku || ''),
      item_name: product.title || '',
      item_category: product.category || 'Jewelry',
      item_brand: 'Ella Creations',
      price: Number(product.price) || 0,
      quantity: 1
    }]
  });
}

export function trackAddToCart(product, quantity = 1, variantName = '') {
  if (!product) return;
  gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: (Number(product.price) || 0) * quantity,
    items: [{
      item_id: String(product.id || product.sku || ''),
      item_name: product.title || '',
      item_category: product.category || 'Jewelry',
      item_variant: variantName || undefined,
      item_brand: 'Ella Creations',
      price: Number(product.price) || 0,
      quantity
    }]
  });
}

export function trackRemoveFromCart(item) {
  if (!item) return;
  gtag('event', 'remove_from_cart', {
    currency: 'INR',
    value: (Number(item.price) || 0) * (Number(item.qty) || 1),
    items: [{
      item_id: String(item.id || ''),
      item_name: item.title || '',
      item_variant: item.finish || undefined,
      item_brand: 'Ella Creations',
      price: Number(item.price) || 0,
      quantity: Number(item.qty) || 1
    }]
  });
}

export function trackBeginCheckout(cart, total) {
  if (!Array.isArray(cart) || cart.length === 0) return;
  gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: Number(total) || 0,
    items: cart.map(c => ({
      item_id: String(c.id || ''),
      item_name: c.title || '',
      item_variant: c.finish || undefined,
      item_brand: 'Ella Creations',
      price: Number(c.price) || 0,
      quantity: Number(c.qty) || 1
    }))
  });
}

export function trackPurchase(order) {
  if (!order) return;
  gtag('event', 'purchase', {
    transaction_id: String(order.id || ''),
    currency: 'INR',
    value: Number(order.total) || 0,
    tax: Number(order.tax_amount) || 0,
    shipping: Number(order.shipping) || 0,
    coupon: order.coupon_code || undefined,
    items: (order.items || []).map(c => ({
      item_id: String(c.id || ''),
      item_name: c.title || '',
      item_variant: c.finish || undefined,
      item_brand: 'Ella Creations',
      price: Number(c.price) || 0,
      quantity: Number(c.qty) || 1
    }))
  });
}

export function trackSearch(term) {
  const q = (term || '').trim();
  if (!q) return;
  gtag('event', 'search', { search_term: q });
}

export function trackSignUp(method = 'email') {
  gtag('event', 'sign_up', { method });
}

export function trackLogin(method = 'email') {
  gtag('event', 'login', { method });
}
