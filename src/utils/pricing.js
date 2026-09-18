/**
 * Ella Creations - Central Pricing & Promotional Campaign Engine
 * 
 * Handles timezone-safe schedule evaluation (IST / Asia/Kolkata),
 * deterministic priority resolution across overlapping campaigns,
 * product discount calculation, and authoritative cart/order verification.
 */

// India Standard Time Offset in minutes (+05:30 = 330 mins)
export const IST_OFFSET_MINUTES = 330;

/**
 * Returns current timestamp in UTC epoch milliseconds.
 */
export function getCurrentTimestamp() {
  return Date.now();
}

/**
 * Parses an ISO date string or local datetime string into UTC epoch milliseconds.
 * If no timezone is specified in the string, treats it as IST (Asia/Kolkata).
 */
export function parseCampaignDateTime(dateStr) {
  if (!dateStr) return null;
  
  // If it's already an ISO string with Z or timezone offset (+XX:XX)
  if (typeof dateStr === 'string' && (dateStr.includes('Z') || dateStr.includes('+') || (dateStr.includes('-') && dateStr.lastIndexOf('-') > 10))) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d.getTime();
  }

  // Handle local datetime string "YYYY-MM-DDTHH:mm" or "YYYY-MM-DD HH:mm"
  // Assuming it's in IST (Asia/Kolkata)
  const normalized = dateStr.replace(' ', 'T');
  const d = new Date(`${normalized}:00+05:30`);
  if (!isNaN(d.getTime())) {
    return d.getTime();
  }

  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback.getTime();
}

/**
 * Formats a timestamp or ISO string into a human-readable Indian Standard Time string.
 * Example: "20 Sep 2026, 12:00 AM IST"
 */
export function formatISTDateTime(dateInput) {
  if (!dateInput) return '—';
  const d = typeof dateInput === 'number' ? new Date(dateInput) : new Date(dateInput);
  if (isNaN(d.getTime())) return '—';

  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }) + ' IST';
}

/**
 * Converts an ISO string or timestamp to "YYYY-MM-DDTHH:mm" in IST for datetime-local input fields.
 */
export function toISTInputString(dateInput) {
  if (!dateInput) return '';
  const d = typeof dateInput === 'number' ? new Date(dateInput) : new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  // Calculate IST Date parts using Intl
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(d);
  const map = {};
  parts.forEach(p => { map[p.type] = p.value; });

  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
}

/**
 * Evaluates the real-time status of a promotional campaign:
 * - 'Disabled': is_enabled is explicitly false
 * - 'Draft': marked as draft or missing required dates
 * - 'Scheduled': start time is in the future
 * - 'Expired': end time is in the past
 * - 'Active': current time is between start and end time
 */
export function getCampaignStatus(campaign, currentTimestamp = getCurrentTimestamp()) {
  if (!campaign) return 'Draft';
  if (campaign.is_enabled === false) return 'Disabled';
  if (campaign.status === 'Draft') return 'Draft';

  const startMs = parseCampaignDateTime(campaign.start_at);
  const endMs = parseCampaignDateTime(campaign.end_at);

  if (!startMs || !endMs) return 'Draft';

  if (currentTimestamp < startMs) {
    return 'Scheduled';
  } else if (currentTimestamp > endMs) {
    return 'Expired';
  } else {
    return 'Active';
  }
}

/**
 * Filters and returns all currently active campaigns, sorted deterministically by:
 * 1. Priority ascending (1 is highest priority, 2, 3...)
 * 2. Higher discount percentage (tie-breaker)
 * 3. Most recently updated/created (secondary tie-breaker)
 */
export function getActivePromotions(promotions = [], currentTimestamp = getCurrentTimestamp()) {
  if (!Array.isArray(promotions) || promotions.length === 0) return [];

  return promotions
    .filter(p => getCampaignStatus(p, currentTimestamp) === 'Active')
    .sort((a, b) => {
      const prioA = Number(a.priority ?? 99);
      const prioB = Number(b.priority ?? 99);
      if (prioA !== prioB) return prioA - prioB;

      const discA = Number(a.discount_percentage ?? 0);
      const discB = Number(b.discount_percentage ?? 0);
      if (discB !== discA) return discB - discA;

      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return timeB - timeA;
    });
}

/**
 * Returns the single active campaign that should display the storefront popup.
 * Picks the highest-priority active campaign that has popup_enabled !== false.
 */
export function getActivePopupCampaign(promotions = [], currentTimestamp = getCurrentTimestamp()) {
  const active = getActivePromotions(promotions, currentTimestamp);
  return active.find(p => p.popup_enabled !== false) || null;
}

/**
 * Determines whether a specific product is included in a promotional campaign.
 */
export function isProductInCampaign(productId, campaign) {
  if (!productId || !campaign) return false;
  const list = campaign.product_ids || campaign.productIds || [];
  if (!Array.isArray(list)) return false;
  return list.some(id => String(id) === String(productId));
}

/**
 * Calculates authoritative pricing for a product given active promotions.
 * 
 * Rules:
 * - Iterates active promotions in priority order.
 * - The first active campaign that includes this product applies.
 * - Discounts DO NOT stack.
 * - Promotional price is rounded to nearest integer (in INR).
 * 
 * @param {Object} product - Product data object (must have .id and .price)
 * @param {Object|null} selectedVariant - Optional variant object (may have .price)
 * @param {Array} activePromotions - List of active promotion objects
 * @returns {Object} { hasPromo, originalPrice, finalPrice, discountPercent, savings, campaign, comparePrice }
 */
export function calculateProductPricing(product, selectedVariant = null, activePromotions = []) {
  if (!product) {
    return {
      hasPromo: false,
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      savings: 0,
      campaign: null,
      comparePrice: null
    };
  }

  const basePrice = Number(selectedVariant?.price ?? product.price ?? 0);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;

  if (basePrice <= 0) {
    return {
      hasPromo: false,
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      savings: 0,
      campaign: null,
      comparePrice
    };
  }

  // Find highest priority applicable campaign
  const applicableCampaign = (activePromotions || []).find(campaign => 
    isProductInCampaign(product.id, campaign)
  );

  if (!applicableCampaign) {
    return {
      hasPromo: false,
      originalPrice: basePrice,
      finalPrice: basePrice,
      discountPercent: 0,
      savings: 0,
      campaign: null,
      comparePrice
    };
  }

  const discountPercent = Math.min(100, Math.max(1, Number(applicableCampaign.discount_percentage || 0)));
  const discountMultiplier = (100 - discountPercent) / 100;
  const finalPrice = Math.max(1, Math.round(basePrice * discountMultiplier));
  const savings = Math.max(0, basePrice - finalPrice);

  return {
    hasPromo: true,
    originalPrice: basePrice,
    finalPrice,
    discountPercent,
    savings,
    campaign: applicableCampaign,
    comparePrice: basePrice // Show the original regular price as crossed-out
  };
}

/**
 * Validates and authoritatively re-calculates all cart items and subtotal on checkout.
 * Guarantees that client cannot manipulate prices in localStorage or HTTP payloads.
 * 
 * @param {Array} cart - Array of cart items
 * @param {Array} catalogProducts - Authoritative product list from DB
 * @param {Array} activePromotions - Currently active promotions
 * @returns {Object} { verifiedItems, subtotal, totalSavings }
 */
export function verifyCartPricing(cart = [], catalogProducts = [], activePromotions = []) {
  let subtotal = 0;
  let totalSavings = 0;

  const verifiedItems = (cart || []).map(item => {
    const realProduct = catalogProducts.find(p => String(p.id) === String(item.id));
    const qty = Math.max(1, Number(item.qty) || 1);

    if (!realProduct) {
      // Product no longer exists in catalog
      return {
        ...item,
        price: Number(item.price) || 0,
        subtotal: (Number(item.price) || 0) * qty,
        hasPromo: false,
        savings: 0
      };
    }

    // Match variant if applicable
    let targetVariant = null;
    if (item.variantId && item.variantId !== 'default' && Array.isArray(realProduct.variants)) {
      targetVariant = realProduct.variants.find(v => v.id === item.variantId || v.name === item.finish);
    }

    const priceInfo = calculateProductPricing(realProduct, targetVariant, activePromotions);
    const itemTotal = priceInfo.finalPrice * qty;
    const itemSavings = priceInfo.savings * qty;

    subtotal += itemTotal;
    totalSavings += itemSavings;

    return {
      ...item,
      price: priceInfo.finalPrice,
      originalPrice: priceInfo.originalPrice,
      hasPromo: priceInfo.hasPromo,
      discountPercent: priceInfo.discountPercent,
      campaignName: priceInfo.campaign?.name || null,
      subtotal: itemTotal,
      savings: itemSavings
    };
  });

  return {
    verifiedItems,
    subtotal: Math.round(subtotal),
    totalSavings: Math.round(totalSavings)
  };
}
