import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjcdvzmlutbkfgsaafmm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HLlGszFXX9eBt9_3DFv1LA_KuCQkTZz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a local image File or base64 data URI to Supabase Storage bucket 'product-images'
 * Returns the public URL of the uploaded image file.
 */
export async function uploadProductPhotoToSupabase(fileOrDataUrl) {
  try {
    let fileToUpload;
    let fileName = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      // Convert base64 data URL to Blob File
      const response = await fetch(fileOrDataUrl);
      const blob = await response.blob();
      fileToUpload = new File([blob], fileName, { type: blob.type || 'image/png' });
    } else if (fileOrDataUrl instanceof File) {
      fileToUpload = fileOrDataUrl;
      fileName = `${Date.now()}_${fileOrDataUrl.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    } else {
      return fileOrDataUrl; // Return as is if already a URL
    }

    // Upload to 'product-images' public bucket
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`catalog/${fileName}`, fileToUpload, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage bucket upload notice (falling back to data URI):', error.message);
      return fileOrDataUrl;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(`catalog/${fileName}`);

    return publicUrlData.publicUrl || fileOrDataUrl;
  } catch (err) {
    console.error('Error uploading photo to Supabase storage:', err);
    return fileOrDataUrl;
  }
}
