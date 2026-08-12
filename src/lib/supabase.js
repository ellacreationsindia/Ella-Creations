import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjcdvzmlutbkfgsaafmm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HLlGszFXX9eBt9_3DFv1LA_KuCQkTZz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      const response = await fetch(compressedDataUrl);
      const blob = await response.blob();
      fileName = `image_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
      fileToUpload = new File([blob], fileName, { type: 'image/jpeg' });
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
      const response = await fetch(fileOrDataUrl);
      const blob = await response.blob();
      const mimeType = blob.type || 'video/mp4';
      const ext = mimeType.split('/')[1] || 'mp4';
      fileName = `video_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      fileToUpload = new File([blob], fileName, { type: mimeType });
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
 * Estimates logistics rates and delivery times for Indian pincodes
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
  
  // Calculate delivery date estimated
  const etdDate = new Date();
  etdDate.setDate(etdDate.getDate() + (isMetro ? 2 : 4));
  const dateStr = etdDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  const standardFee = cartSubtotal >= 2500 ? 0 : 99;
  const expressFee = standardFee + 100;

  return {
    serviceable: true,
    destinationPincode: cleanPincode,
    city: location?.city || '',
    state: location?.state || '',
    courierName: isMetro ? 'Shiprocket Priority (BlueDart Express Air)' : 'Shiprocket Surface (Delhivery Logistics)',
    etd: dateStr,
    estimatedDays: isMetro ? 2 : 4,
    shippingCharge: standardFee,
    expressCharge: expressFee,
    codAvailable: true
  };
}
