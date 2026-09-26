import React, { memo } from 'react';

/**
 * AnimatedBackground
 * High-performance, luxury ambient live gradient background for Ella Creations.
 * Optimized for 60fps/120fps silky-smooth scrolling:
 * - GPU-composited radial gradient mesh
 * - Hardware-accelerated floating luminous aurora orbs
 * - Lightweight ambient sparkles
 * - Zero CPU-heavy SVG filter overhead
 */
function AnimatedBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      style={{ contain: 'strict' }}
    >
      {/* 1. Base Multi-stop Animated Gradient Canvas */}
      <div className="absolute inset-0 live-gradient-base opacity-95" />

      {/* 2. Floating Luminous Aurora Mesh Orbs (GPU composited) */}
      <div className="absolute inset-0 overflow-hidden filter blur-[40px] sm:blur-[60px] opacity-75 sm:opacity-85 transform-gpu pointer-events-none">
        
        {/* Orb 1: Royal Rose & Soft Blush (Top-Left) */}
        <div 
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] min-w-[280px] min-h-[280px] max-w-[650px] max-h-[650px] rounded-full animate-float-orb-1 opacity-70"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(212, 154, 165, 0.45) 0%, rgba(232, 190, 198, 0.25) 45%, rgba(255, 246, 238, 0) 75%)',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)'
          }}
        />

        {/* Orb 2: Champagne & Antique Gold (Top-Right) */}
        <div 
          className="absolute -top-[5%] -right-[10%] w-[45vw] h-[45vw] min-w-[260px] min-h-[260px] max-w-[600px] max-h-[600px] rounded-full animate-float-orb-2 opacity-65"
          style={{
            background: 'radial-gradient(circle at 60% 40%, rgba(207, 164, 92, 0.35) 0%, rgba(233, 208, 151, 0.2) 50%, rgba(255, 246, 238, 0) 75%)',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)'
          }}
        />

        {/* Orb 3: Warm Peach & Apricot Glow (Bottom-Left) */}
        <div 
          className="absolute -bottom-[15%] -left-[5%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] max-w-[700px] max-h-[700px] rounded-full animate-float-orb-3 opacity-60"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(254, 215, 170, 0.4) 0%, rgba(242, 196, 199, 0.2) 50%, rgba(255, 246, 238, 0) 80%)',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)'
          }}
        />

        {/* Orb 4: Radiant Rose Gold Highlight (Center Floating Aura) */}
        <div 
          className="absolute top-[35%] right-[15%] w-[40vw] h-[40vw] min-w-[250px] min-h-[250px] max-w-[550px] max-h-[550px] rounded-full animate-float-orb-4 opacity-55"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(233, 208, 151, 0.3) 0%, rgba(212, 154, 165, 0.2) 50%, rgba(255, 246, 238, 0) 75%)',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)'
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
      </div>

      {/* 4. Delicate Luxury Edge Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 65%, rgba(207, 164, 92, 0.05) 100%)'
        }}
      />
    </div>
  );
}

export default memo(AnimatedBackground);
