import React from 'react';
import { optimizeImageUrl, optimizedSrcSet } from '../utils/image';

// <img> that serves a resized WebP when possible and falls back to the original URL on error.
export default function OptImg({ src, width = 640, widths, sizes, onError, alt = '', ...rest }) {
  const optimized = optimizeImageUrl(src, width);
  const srcSet = optimizedSrcSet(src, widths || [Math.round(width / 2), width, width * 2]);

  return (
    <img
      src={optimized}
      srcSet={srcSet}
      sizes={srcSet ? (sizes || `${width}px`) : undefined}
      alt={alt}
      decoding="async"
      {...rest}
      onError={(e) => {
        const img = e.currentTarget;
        if (src && img.dataset.fellBack !== '1' && img.src !== src) {
          img.dataset.fellBack = '1';
          img.removeAttribute('srcset');
          img.src = src;
          return;
        }
        if (onError) onError(e);
      }}
    />
  );
}
