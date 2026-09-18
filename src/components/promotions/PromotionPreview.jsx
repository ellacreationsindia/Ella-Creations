import React, { useState } from 'react';
import { Monitor, Smartphone, X, Sparkles, Eye } from 'lucide-react';
import PromotionPopup from '../PromotionPopup';

export default function PromotionPreview({ 
  campaign, 
  isOpen = false, 
  onClose = () => {} 
}) {
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'mobile'

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Preview Control Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>Popup Live Preview</span>
                <span className="text-[10px] uppercase font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full border border-brand-gold/20">
                  {campaign.name || 'Untitled Campaign'}
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Interactive preview using the exact storefront modal component.
              </p>
            </div>
          </div>

          {/* Device Viewport Toggle & Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-stone-900 rounded-xl p-1 border border-stone-800">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  device === 'desktop'
                    ? 'bg-brand-rose text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  device === 'mobile'
                    ? 'bg-brand-rose text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Simulation Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-stone-950/60 [background-image:radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]">
          {device === 'mobile' ? (
            /* Mobile Frame */
            <div className="w-[375px] max-w-full rounded-[40px] border-4 border-stone-700 bg-brand-cream/10 p-3 shadow-2xl relative">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-stone-800 rounded-full mx-auto mb-2" />
              
              <div className="rounded-[32px] overflow-hidden bg-white/95 backdrop-blur-md">
                <PromotionPopup 
                  preview={true}
                  previewCampaign={campaign}
                  previewDevice="mobile"
                  onClosePreview={onClose}
                />
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-28 h-1 bg-stone-700 rounded-full mx-auto mt-3" />
            </div>
          ) : (
            /* Desktop Canvas */
            <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-brand-gold/30">
              <PromotionPopup 
                preview={true}
                previewCampaign={campaign}
                previewDevice="desktop"
                onClosePreview={onClose}
              />
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Active Device Mode: <strong className="text-stone-200 capitalize">{device}</strong></span>
          <span className="text-brand-gold">Discounts & pricing update dynamically</span>
        </div>

      </div>
    </div>
  );
}
