const SUPABASE_OBJECT = '/storage/v1/object/public/';
const SUPABASE_RENDER = '/storage/v1/render/image/public/';

// Rewrites a remote image URL to a resized WebP variant when the host supports it.
export function optimizeImageUrl(url, width = 600, quality = 75) {
  if (!url || typeof url !== 'string' || url.startsWith('data:') || url.startsWith('blob:')) return url;
  try {
    if (url.includes('.supabase.co') && url.includes(SUPABASE_OBJECT)) {
      return `${url.replace(SUPABASE_OBJECT, SUPABASE_RENDER).split('?')[0]}?width=${width}&quality=${quality}&format=webp`;
    }
    if (url.includes('images.unsplash.com')) {
      const u = new URL(url);
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', String(quality));
      u.searchParams.set('fm', 'webp');
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      return u.toString();
    }
  } catch {
    return url;
  }
  return url;
}

export function optimizedSrcSet(url, widths = [320, 640, 960]) {
  const optimized = optimizeImageUrl(url, widths[0]);
  if (!optimized || optimized === url) return undefined;
  return widths.map(w => `${optimizeImageUrl(url, w)} ${w}w`).join(', ');
}
