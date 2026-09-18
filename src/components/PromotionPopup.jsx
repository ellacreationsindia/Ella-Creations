import React, { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, ArrowRight, Tag, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatISTDateTime } from '../utils/pricing';

export default function PromotionPopup({ 
  preview = false, 
  previewCampaign = null, 
  previewDevice = 'desktop',
  onClosePreview = null 
}) {
  const store = useStore();
  const activeCampaign = preview ? previewCampaign : store?.activePopupCampaign;
  const navigateTo = store?.navigateTo;

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Check whether popup should be shown to storefront visitor
  useEffect(() => {
    if (preview) {
      setIsOpen(true);
      return;
    }

    if (!activeCampaign) {
      setIsOpen(false);
      return;
    }

    // Check frequency setting
    const campaignKey = `ella_promo_seen_${activeCampaign.id}`;
    const frequency = activeCampaign.popup_frequency || 'once_per_session';

    if (frequency === 'once_per_session') {
      const alreadySeen = sessionStorage.getItem(campaignKey);
      if (!alreadySeen) {
        // Small delay for elegant entry on initial page load
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } else if (frequency === 'once_per_day') {
      const lastSeenTime = localStorage.getItem(campaignKey);
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (!lastSeenTime || Date.now() - Number(lastSeenTime) > oneDayMs) {
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } else {
      // 'every_visit'
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeCampaign, preview]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (preview && onClosePreview) {
        onClosePreview();
      } else if (activeCampaign) {
        const campaignKey = `ella_promo_seen_${activeCampaign.id}`;
        sessionStorage.setItem(campaignKey, 'true');
        localStorage.setItem(campaignKey, Date.now().toString());
      }
    }, 280);
  }, [activeCampaign, preview, onClosePreview]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !activeCampaign) return null;

  const handleCtaClick = () => {
    handleClose();
    if (activeCampaign.cta_url && activeCampaign.cta_url.startsWith('http')) {
      window.location.href = activeCampaign.cta_url;
      return;
    }
    
    // Navigate to filtered sale collection in ShopView
    if (navigateTo) {
      navigateTo('shop', null, 'Sale');
    } else if (typeof window !== 'undefined') {
      window.location.hash = '#sale';
    }
  };

  const discountVal = activeCampaign.discount_percentage || activeCampaign.discountPercent || 50;
  const headline = activeCampaign.headline || `Festive Sale — Flat ${discountVal}% OFF`;
  const campaignName = activeCampaign.name || 'Special Promotional Offer';
  const description = activeCampaign.description || 'Celebrate with our handcrafted luxury artificial jewelry. Limited-time promotional discount applied to selected pieces.';
  const ctaText = activeCampaign.cta_text || 'SHOP THE SALE';
  const bannerImage = activeCampaign.image_url || activeCampaign.imageUrl || null;
  const endsAtStr = activeCampaign.end_at ? formatISTDateTime(activeCampaign.end_at) : null;

  // In preview mode inside admin container:
  if (preview) {
    const isMobileMode = previewDevice === 'mobile';

    return (
      <div className={`w-full flex items-center justify-center p-2 sm:p-4 ${isMobileMode ? 'max-w-sm mx-auto' : 'max-w-2xl mx-auto'}`}>
        <div className={`w-full bg-white rounded-3xl overflow-hidden border border-brand-gold/40 shadow-2xl relative text-stone-900 ${
          isMobileMode ? 'flex flex-col' : 'grid grid-cols-1 md:grid-cols-12'
        }`}>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md flex items-center justify-center transition-all"
            aria-label="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Graphic Column */}
          <div className={`${isMobileMode ? 'h-36' : 'md:col-span-5 h-56 md:h-auto'} relative bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 p-6 flex flex-col items-center justify-center text-center overflow-hidden`}>
            {bannerImage ? (
              <img 
                src={bannerImage} 
                alt={campaignName} 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#CFA45C_1px,transparent_1px)] [background-size:16px_16px]" />
            )}
            
            {/* Elegant overlay badge */}
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-[0.25em] text-brand-gold bg-stone-900/80 px-3 py-1 rounded-full border border-brand-gold/30">
                <Sparkles className="w-3 h-3 text-brand-gold" /> ELLA CREATIONS
              </span>
              <div className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
                FLAT <span className="rose-gradient-text">{discountVal}%</span>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-stone-300 font-semibold">OFF SELECTED JEWELRY</p>
            </div>
          </div>

          {/* Content Column */}
          <div className={`${isMobileMode ? 'p-5' : 'md:col-span-7 p-6 sm:p-8'} flex flex-col justify-between bg-gradient-to-b from-brand-cream/60 via-white to-brand-cream/30 space-y-4`}>
            <div className="space-y-2">
              <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-rose bg-brand-rose/10 px-2.5 py-0.5 rounded-full">
                {campaignName}
              </div>
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 leading-snug">
                {headline}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {endsAtStr && (
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-brand-gold" />
                <span>Valid until: <strong className="text-stone-700">{endsAtStr}</strong></span>
              </div>
            )}

            <button
              onClick={handleCtaClick}
              className="w-full bg-gradient-to-r from-stone-900 via-brand-charcoal to-stone-900 hover:from-brand-rose hover:to-rose-800 text-white font-semibold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-soft-rose flex items-center justify-center gap-2 group"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-brand-gold" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full Storefront Modal (Responsive: Desktop modal card, Mobile bottom-sheet or compact dialog)
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-popup-headline"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-lg md:max-w-2xl bg-white rounded-3xl overflow-hidden border border-brand-gold/40 shadow-2xl z-10 transform transition-all duration-300 ${
          isClosing ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-md flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold"
          aria-label="Close promotional announcement"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Visual Column / Banner */}
          <div className="md:col-span-5 relative bg-gradient-to-br from-stone-950 via-rose-950 to-stone-900 p-6 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden min-h-[160px] md:min-h-[320px]">
            {bannerImage ? (
              <img 
                src={bannerImage} 
                alt={campaignName} 
                className="absolute inset-0 w-full h-full object-cover opacity-50 filter brightness-90"
              />
            ) : (
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#CFA45C_1px,transparent_1px)] [background-size:20px_20px]" />
            )}

            {/* Subtle Brand Watermark */}
            <img src="/logo.png" alt="" className="w-24 h-24 opacity-10 absolute pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.25em] text-brand-gold bg-stone-900/90 px-3 py-1 rounded-full border border-brand-gold/40 shadow-sm">
                <Sparkles className="w-3 h-3 text-brand-gold animate-pulse" /> ELLA CREATIONS
              </div>

              <div className="pt-2">
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-stone-300 font-semibold block">FESTIVE PROMOTION</span>
                <div className="text-4xl sm:text-5xl font-serif font-black text-white tracking-tight leading-none mt-1">
                  FLAT <span className="text-brand-gold">{discountVal}%</span>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-stone-200 font-bold block mt-1">OFF</span>
              </div>
            </div>
          </div>

          {/* Promotional Details & Action Column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-brand-cream/50 via-white to-brand-cream/30 space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-rose bg-brand-rose/10 px-2.5 py-1 rounded-full border border-brand-rose/20">
                <Tag className="w-3 h-3" />
                <span>{campaignName}</span>
              </div>

              <h2 id="promo-popup-headline" className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                {headline}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {endsAtStr && (
              <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <span className="truncate">Limited Time Offer: Valid till <strong className="text-stone-800">{endsAtStr}</strong></span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                onClick={handleCtaClick}
                className="w-full bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 hover:from-brand-rose hover:via-rose-700 hover:to-brand-rose text-white font-semibold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-soft-rose flex items-center justify-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-rose"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-brand-gold" />
              </button>

              <button
                onClick={handleClose}
                className="w-full text-center text-[11px] text-stone-400 hover:text-stone-600 py-1 transition-colors font-medium cursor-pointer"
              >
                No thanks, continue browsing
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
