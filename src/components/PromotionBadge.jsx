import React from 'react';
import { Sparkles, Percent } from 'lucide-react';

export default function PromotionBadge({ 
  discountPercent, 
  size = 'md', 
  variant = 'rose',
  showIcon = false,
  className = ''
}) {
  if (!discountPercent || discountPercent <= 0) return null;

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 font-bold tracking-wider',
    sm: 'text-[10px] px-2 py-0.5 font-bold tracking-wide',
    md: 'text-xs px-2.5 py-1 font-bold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-wider'
  }[size] || 'text-xs px-2.5 py-1 font-bold';

  const variantClasses = {
    rose: 'bg-gradient-to-r from-rose-700 via-brand-rose to-rose-800 text-white shadow-soft-rose border border-rose-400/30',
    gold: 'bg-gradient-to-r from-amber-700 via-brand-gold to-amber-800 text-stone-950 shadow-gold-glow border border-amber-300/40 font-extrabold',
    dark: 'bg-stone-900 text-brand-cream border border-brand-gold/30 shadow-sm',
    subtle: 'bg-rose-50 text-brand-rose border border-rose-200'
  }[variant] || 'bg-brand-rose text-white';

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full uppercase transition-transform select-none ${sizeClasses} ${variantClasses} ${className}`}
      title={`${discountPercent}% OFF Promotional Sale`}
    >
      {showIcon && <Sparkles className="w-3 h-3 text-brand-gold animate-pulse" />}
      <span>SALE</span>
      <span className="opacity-75">|</span>
      <span>{discountPercent}% OFF</span>
    </span>
  );
}
