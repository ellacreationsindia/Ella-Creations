import React, { memo } from 'react';

/**
 * AnimatedBackground
 * High-performance, luxury ambient live gradient background for Ella Creations.
 * Features:
 * - Shifting multi-stop silk gradient mesh
 * - Fluid, GPU-accelerated floating luminous aurora orbs (Rose, Gold, Champagne, Blush)
 * - Subtle ambient stardust jewelry sparkles
 * - Ultra-fine satin noise texture overlay (anti-banding)
 * - Respects prefers-reduced-motion automatically
 */
function AnimatedBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* 1. Base Multi-stop Animated Gradient Canvas */}
      <div className="absolute inset-0 live-gradient-base opacity-95" />

      {/* 2. Floating Luminous Aurora Mesh Orbs */}
      <div className="absolute inset-0 overflow-hidden filter blur-[80px] sm:blur-[110px] md:blur-[130px] opacity-75 sm:opacity-85 transform-gpu">
        
        {/* Orb 1: Royal Rose & Soft Blush (Top-Left to Center) */}
        <div 
          className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] min-w-[320px] min-h-[320px] max-w-[750px] max-h-[750px] rounded-full animate-float-orb-1 opacity-70"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(212, 154, 165, 0.55) 0%, rgba(232, 190, 198, 0.35) 45%, rgba(255, 246, 238, 0) 75%)'
          }}
        />

        {/* Orb 2: Champagne & Antique Gold (Top-Right to Mid-Screen) */}
        <div 
          className="absolute -top-[5%] -right-[10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] max-w-[700px] max-h-[700px] rounded-full animate-float-orb-2 opacity-65"
          style={{
            background: 'radial-gradient(circle at 60% 40%, rgba(207, 164, 92, 0.45) 0%, rgba(233, 208, 151, 0.3) 50%, rgba(255, 246, 238, 0) 75%)'
          }}
        />

        {/* Orb 3: Warm Peach & Apricot Glow (Bottom-Left to Center-Bottom) */}
        <div 
          className="absolute -bottom-[15%] -left-[5%] w-[58vw] h-[58vw] min-w-[340px] min-h-[340px] max-w-[800px] max-h-[800px] rounded-full animate-float-orb-3 opacity-60"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(254, 215, 170, 0.5) 0%, rgba(242, 196, 199, 0.3) 50%, rgba(255, 246, 238, 0) 80%)'
          }}
        />

        {/* Orb 4: Radiant Rose Gold Highlight (Center Floating Aura) */}
        <div 
          className="absolute top-[35%] right-[15%] w-[45vw] h-[45vw] min-w-[280px] min-h-[280px] max-w-[620px] max-h-[620px] rounded-full animate-float-orb-4 opacity-55"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(233, 208, 151, 0.4) 0%, rgba(212, 154, 165, 0.25) 50%, rgba(255, 246, 238, 0) 75%)'
          }}
        />

      </div>

      {/* 3. Subtle Luxury Stardust Sparkles (Jewelry Theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Sparkle 1 */}
        <div 
          className="absolute top-[14%] left-[12%] animate-twinkle"
          style={{ animationDuration: '6.5s', animationDelay: '0.5s' }}
        >
          <svg className="w-5 h-5 text-brand-gold/45" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        </div>

        {/* Sparkle 2 */}
        <div 
          className="absolute top-[28%] right-[16%] animate-twinkle"
          style={{ animationDuration: '8s', animationDelay: '2.2s' }}
        >
          <svg className="w-4 h-4 text-brand-rose/50" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        </div>

        {/* Sparkle 3 */}
        <div 
          className="absolute top-[52%] left-[8%] animate-twinkle"
          style={{ animationDuration: '7s', animationDelay: '1.4s' }}
        >
          <svg className="w-6 h-6 text-brand-gold/40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        </div>

        {/* Sparkle 4 */}
        <div 
          className="absolute top-[68%] right-[10%] animate-twinkle"
          style={{ animationDuration: '9s', animationDelay: '3.6s' }}
        >
          <svg className="w-5 h-5 text-brand-rose/45" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        </div>

        {/* Sparkle 5 */}
        <div 
          className="absolute top-[85%] left-[22%] animate-twinkle"
          style={{ animationDuration: '7.5s', animationDelay: '4.8s' }}
        >
          <svg className="w-4 h-4 text-brand-gold/40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        </div>

        {/* Sparkle 6 */}
        <div 
          className="absolute top-[42%] right-[35%] animate-twinkle"
          style={{ animationDuration: '8.5s', animationDelay: '2.8s' }}
        >
          <svg className="w-3.5 h-3.5 text-brand-gold-dark/35" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        </div>
      </div>

      {/* 4. Fine Satin Noise Filter (Banding Prevention & Editorial Paper Texture) */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-overlay pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="luxury-satin-noise">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#luxury-satin-noise)" />
      </svg>

      {/* 5. Delicate Edge Glow & Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(207, 164, 92, 0.08) 100%)'
        }}
      />
    </div>
  );
}

export default memo(AnimatedBackground);
