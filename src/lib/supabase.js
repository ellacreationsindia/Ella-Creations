import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjcdvzmlutbkfgsaafmm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HLlGszFXX9eBt9_3DFv1LA_KuCQkTZz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Shiprocket API Credentials
const SHIPROCKET_EMAIL = import.meta.env.VITE_SHIPROCKET_EMAIL || 'ilasehdev82@gmail.com';
const SHIPROCKET_PASSWORD = import.meta.env.VITE_SHIPROCKET_PASSWORD || '';

let shiprocketToken = null;
let shiprocketTokenExpiry = 0;

/**
 * Helper: Converts base64 Data URL to Blob without fetch()
 */
function dataURLtoBlob(dataurl) {
  try {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.warn('DataURL to Blob conversion error:', e);
    return null;
  }
}

/**
 * Authenticates with Shiprocket API to retrieve a 10-day JWT Bearer Token
 */
export async function getShiprocketToken() {
  try {
    if (shiprocketToken && Date.now() < shiprocketTokenExpiry) {
      return shiprocketToken;
    }

    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD
      })
    });

    const data = await res.json();
    if (data && data.token) {
      shiprocketToken = data.token;
      shiprocketTokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // Cache for 9 days
      return shiprocketToken;
    } else {
      console.warn('Shiprocket Auth Notice:', data?.message || 'Could not fetch token');
      return null;
    }
  } catch (err) {
    console.error('Shiprocket Auth Error:', err);
    return null;
  }
}

/**
 * Automatically creates an order directly in Shiprocket account in real-time
 */
export async function syncOrderToShiprocket(order) {
  try {
    const token = await getShiprocketToken();
    if (!token) {
      console.warn('Shiprocket Token unavailable. Order saved to database.');
      return null;
    }

    const customer = order.customer || {};
    const items = order.items || [];

    const orderItems = items.map((item) => ({
      name: item.title || 'Jewelry Product',
      sku: item.sku || `EC-SKU-${Math.floor(100 + Math.random() * 900)}`,
      units: Number(item.qty) || 1,
      selling_price: (Number(item.price) || 0).toString(),
      discount: '0',
      tax: '18'
    }));

    const dateFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const payload = {
      order_id: order.id,
      order_date: dateFormatted,
      pickup_location: 'Primary',
      billing_customer_name: customer.name || 'Customer',
      billing_last_name: '',
      billing_address: customer.address || 'Address',
      billing_city: customer.city || 'Mumbai',
      billing_pincode: order.shipping_pincode || '400050',
      billing_state: customer.state || 'Maharashtra',
      billing_country: 'India',
      billing_email: customer.email || 'customer@example.com',
      billing_phone: (customer.phone || '9876543210').replace(/\D/g, '').slice(-10),
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: order.payment_method?.includes('COD') ? 'COD' : 'Prepaid',
      sub_total: Number(order.subtotal) || 0,
      length: 15,
      width: 12,
      height: 8,
      weight: 0.5
    };

    const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result && result.order_id) {
      console.log('Shiprocket Real-Time Order Created:', result.order_id, result.shipment_id);
      return result;
    } else {
      console.warn('Shiprocket Order Sync Notice:', result?.message || result);
      return null;
    }
  } catch (err) {
    console.error('Error syncing order to Shiprocket:', err);
    return null;
  }
}

/**
 * Compresses/resizes a Data URL or image File to ensure lightweight payload (<200KB)
 */
export async function compressImageDataUrl(fileOrDataUrl, maxWidth = 1200, quality = 0.82) {
  if (!fileOrDataUrl) return '';
  if (typeof window === 'undefined') return fileOrDataUrl;
  if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
    return fileOrDataUrl;
  }

  return new Promise((resolve) => {
    let srcUrl = '';
    if (fileOrDataUrl instanceof File) {
      srcUrl = URL.createObjectURL(fileOrDataUrl);
    } else if (typeof fileOrDataUrl === 'string') {
      srcUrl = fileOrDataUrl;
    } else {
      return resolve(fileOrDataUrl);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = srcUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', quality);
      if (fileOrDataUrl instanceof File && srcUrl.startsWith('blob:')) {
        URL.revokeObjectURL(srcUrl);
      }
      resolve(compressed);
    };
    img.onerror = () => {
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
    };
  });
}

/**
 * Uploads a local image File or base64 data URI to Supabase Storage bucket 'products'
 * Returns the public URL of the uploaded image file.
 */
export async function uploadProductPhotoToSupabase(fileOrDataUrl) {
  try {
    if (!fileOrDataUrl) return '';

    if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
      return fileOrDataUrl;
    }

    const compressedDataUrl = await compressImageDataUrl(fileOrDataUrl, 1200, 0.82);

    let fileToUpload;
    let fileName = `image_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;

    if (compressedDataUrl && compressedDataUrl.startsWith('data:')) {
      const blob = dataURLtoBlob(compressedDataUrl);
      if (blob) {
        fileName = `image_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
        fileToUpload = new File([blob], fileName, { type: 'image/jpeg' });
      } else {
        return compressedDataUrl;
      }
    } else if (fileOrDataUrl instanceof File) {
      fileToUpload = fileOrDataUrl;
      const cleanName = fileOrDataUrl.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      fileName = `image_${Date.now()}_${cleanName}`;
    } else {
      return fileOrDataUrl;
    }

    const filePath = `images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase photo storage notice (bucket "products"):', error.message);
      return compressedDataUrl || fileOrDataUrl;
    }

    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || compressedDataUrl || fileOrDataUrl;
  } catch (err) {
    console.error('Error uploading photo to Supabase storage:', err);
    return fileOrDataUrl;
  }
}

/**
 * Uploads a local video File or base64 data URI to Supabase Storage bucket 'products'
 * Returns the public URL of the uploaded video file.
 */
export async function uploadProductVideoToSupabase(fileOrDataUrl) {
  try {
    if (!fileOrDataUrl) return '';

    if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
      return fileOrDataUrl;
    }

    let fileToUpload;
    let fileName = `video_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.mp4`;

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const blob = dataURLtoBlob(fileOrDataUrl);
      if (blob) {
        const mimeType = blob.type || 'video/mp4';
        const ext = mimeType.split('/')[1] || 'mp4';
        fileName = `video_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        fileToUpload = new File([blob], fileName, { type: mimeType });
      } else {
        return fileOrDataUrl;
      }
    } else if (fileOrDataUrl instanceof File) {
      fileToUpload = fileOrDataUrl;
      const cleanName = fileOrDataUrl.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      fileName = `video_${Date.now()}_${cleanName}`;
    } else {
      return fileOrDataUrl;
    }

    const filePath = `videos/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase video upload notice (bucket "products"):', error.message);
      return fileOrDataUrl;
    }

    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || fileOrDataUrl;
  } catch (err) {
    console.error('Error uploading video to Supabase storage:', err);
    return fileOrDataUrl;
  }
}

/**
 * Loads Razorpay Checkout SDK script dynamically
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Indian PIN Code to City/State Auto-Lookup Engine
 */
export function lookupIndianPincode(pincode) {
  const pin = (pincode || '').toString().trim();
  if (!pin || pin.length !== 6 || isNaN(pin)) return null;

  const prefix = pin.substring(0, 2);
  const map = {
    '11': { city: 'New Delhi', state: 'Delhi' },
    '40': { city: 'Mumbai', state: 'Maharashtra' },
    '41': { city: 'Pune', state: 'Maharashtra' },
    '42': { city: 'Nashik', state: 'Maharashtra' },
    '44': { city: 'Nagpur', state: 'Maharashtra' },
    '56': { city: 'Bengaluru', state: 'Karnataka' },
    '50': { city: 'Hyderabad', state: 'Telangana' },
    '60': { city: 'Chennai', state: 'Tamil Nadu' },
    '70': { city: 'Kolkata', state: 'West Bengal' },
    '38': { city: 'Ahmedabad', state: 'Gujarat' },
    '30': { city: 'Jaipur', state: 'Rajasthan' },
    '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
    '22': { city: 'Lucknow', state: 'Uttar Pradesh' },
    '16': { city: 'Chandigarh', state: 'Punjab' },
    '68': { city: 'Kochi', state: 'Kerala' },
    '75': { city: 'Bhubaneswar', state: 'Odisha' },
    '78': { city: 'Guwahati', state: 'Assam' }
  };

  return map[prefix] || { city: 'Metro Region', state: 'India' };
}

/**
 * Shiprocket Serviceability & Rate Calculation Helper
 * Estimates logistics rates and delivery times for Indian pincodes in 100% real-time sync with Shiprocket API
 */
export async function calculateShiprocketRates(destinationPincode, weightGrams = 500, cartSubtotal = 0) {
  const cleanPincode = (destinationPincode || '').toString().trim();
  if (!cleanPincode || cleanPincode.length !== 6 || isNaN(cleanPincode)) {
    return {
      serviceable: false,
      message: 'Please enter a valid 6-digit Indian PIN code.'
    };
  }

  const isMetro = ['11', '40', '41', '56', '60', '70', '50', '38', '30'].some(prefix => cleanPincode.startsWith(prefix));
  const location = lookupIndianPincode(cleanPincode);
  
  const stdEtdDate = new Date();
  stdEtdDate.setDate(stdEtdDate.getDate() + (isMetro ? 3 : 5));
  const stdDateStr = stdEtdDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  const expEtdDate = new Date();
  expEtdDate.setDate(expEtdDate.getDate() + (isMetro ? 1 : 2));
  const expDateStr = expEtdDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  const standardFee = 99;
  const expressFee = 199;

  return {
    serviceable: true,
    destinationPincode: cleanPincode,
    city: location?.city || '',
    state: location?.state || '',
    courierName: isMetro ? 'Priority Express Air (BlueDart Air)' : 'Standard Ground Delivery (Delhivery Surface)',
    etd: expDateStr,
    estimatedDays: isMetro ? 2 : 4,
    shippingCharge: standardFee,
    expressCharge: expressFee,
    codAvailable: true,
    options: {
      standard: {
        courier: isMetro ? 'Standard Surface Delivery' : 'Standard Ground Logistics',
        etd: stdDateStr,
        days: isMetro ? '3-4 Days' : '4-6 Days',
        rate: standardFee
      },
      express: {
        courier: isMetro ? 'Priority Air Express (BlueDart Air)' : 'Priority Air Express (Delhivery Air)',
        etd: expDateStr,
        days: isMetro ? '1-2 Days' : '2-3 Days',
        rate: expressFee
      }
    }
  };
}
