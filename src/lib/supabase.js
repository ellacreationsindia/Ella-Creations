import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjcdvzmlutbkfgsaafmm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HLlGszFXX9eBt9_3DFv1LA_KuCQkTZz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a local image File or base64 data URI to Supabase Storage bucket 'products'
 * Returns the public URL of the uploaded image file.
 */
export async function uploadProductPhotoToSupabase(fileOrDataUrl) {
  try {
    if (!fileOrDataUrl) return '';

    // If it's already a hosted URL (http/https), return as is
    if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
      return fileOrDataUrl;
    }

    let fileToUpload;
    let fileName = `image_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.png`;

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const response = await fetch(fileOrDataUrl);
      const blob = await response.blob();
      const mimeType = blob.type || 'image/png';
      const ext = mimeType.split('/')[1] || 'png';
      fileName = `image_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      fileToUpload = new File([blob], fileName, { type: mimeType });
    } else if (fileOrDataUrl instanceof File) {
      fileToUpload = fileOrDataUrl;
      const cleanName = fileOrDataUrl.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      fileName = `image_${Date.now()}_${cleanName}`;
    } else {
      return fileOrDataUrl;
    }

    const filePath = `images/${fileName}`;

    // Upload to 'products' public bucket
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase photo upload notice (bucket "products"):', error.message);
      return fileOrDataUrl;
    }

    // Get public URL from 'products' bucket
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || fileOrDataUrl;
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

    // If it's already a hosted URL (http/https), return as is
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

    // Upload to 'products' public bucket
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

    // Get public URL from 'products' bucket
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || fileOrDataUrl;
  } catch (err) {
    console.error('Error uploading video to Supabase storage:', err);
    return fileOrDataUrl;
  }
}
