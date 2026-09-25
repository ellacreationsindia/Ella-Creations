import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Gift, 
  Instagram, 
  Facebook, 
  Globe, 
  Mail,
  Heart,
  Crown,
  ChevronDown
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function Footer() {
  const { navigateTo, isAdmin, subscribeNewsletter } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCustomerCareOpen, setIsCustomerCareOpen] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    const ok = await subscribeNewsletter(newsletterEmail, 'VIP Sparkle Club Footer');
    if (ok) setNewsletterEmail('');
  };

  return (
    <footer className="w-full bg-stone-950 text-stone-200 pt-6 sm:pt-12 pb-6 sm:pb-10 border-t border-brand-gold/30 relative z-30 block">
      {/* Brand Assurances Grid (Compact on Mobile, Expanded on Desktop) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-4 sm:pb-8 border-b border-stone-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-stone-900/40 sm:bg-transparent">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-brand-rose/20 flex items-center justify-center text-brand-rose shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-base font-bold text-white leading-tight">Handcrafted Quality</h4>
              <p className="hidden sm:block text-[10px] sm:text-xs text-stone-400 leading-snug mt-0.5">Handcrafted with premium finish for lasting beauty.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-stone-900/40 sm:bg-transparent">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-base font-bold text-white leading-tight">Insured Courier</h4>
              <p className="hidden sm:block text-[10px] sm:text-xs text-stone-400 leading-snug mt-0.5">Insured express courier dispatch across all India.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-stone-900/40 sm:bg-transparent">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pink shrink-0">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-base font-bold text-white leading-tight">Velvet Gift Box</h4>
              <p className="hidden sm:block text-[10px] sm:text-xs text-stone-400 leading-snug mt-0.5">Every order arrives in tamper-evident protective box.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-3 p-2 sm:p-0 rounded-xl bg-stone-900/40 sm:bg-transparent">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs sm:text-base font-bold text-white leading-tight">Stylist Support</h4>
              <p className="hidden sm:block text-[10px] sm:text-xs text-stone-400 leading-snug mt-0.5">Personal assistance for bridal styling & order updates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          
          {/* Brand Bio with Logo */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Ella Creations Logo" className="h-9 sm:h-11 w-auto object-contain filter drop-shadow" />
              <span className="font-serif text-lg sm:text-2xl font-bold text-white">Ella Creations</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 line-clamp-2 sm:line-clamp-none">
              Ella Creations is a contemporary artificial jewelry brand. Handcrafted Kundan, Cubic Zirconia crystal drops, and gold-polished statement heirlooms.
            </p>
            <div className="flex space-x-2 pt-0.5">
              <a 
                href="https://www.instagram.com/ellacreationsindia/" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 hover:bg-brand-rose text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a 
                href="https://www.instagram.com/ellacreationsindia/" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 hover:bg-brand-rose text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a 
                href="https://ella-creations.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Official Website"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-800 hover:bg-brand-rose text-white flex items-center justify-center transition-colors"
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Accordion on Mobile / Standard Column on Desktop */}
          <div className="lg:col-span-2 border-t border-stone-800/80 pt-2.5 lg:border-none lg:pt-0">
            <button
              type="button"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="w-full flex items-center justify-between text-left lg:pointer-events-none"
            >
              <h5 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-brand-gold uppercase">Shop Categories</h5>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform lg:hidden ${isCategoriesOpen ? 'rotate-180 text-brand-gold' : ''}`} />
            </button>
            <ul className={`text-xs text-stone-400 space-y-2 pt-2 ${isCategoriesOpen ? 'block' : 'hidden lg:block'}`}>
              <li><a href="/shop?category=Necklace" onClick={(e) => { e.preventDefault(); navigateTo('shop', null, 'Necklace'); }} className="hover:text-white transition-colors cursor-pointer">Necklaces</a></li>
              <li><a href="/shop?category=Earring" onClick={(e) => { e.preventDefault(); navigateTo('shop', null, 'Earring'); }} className="hover:text-white transition-colors cursor-pointer">Earrings & Drops</a></li>
              <li><a href="/shop?category=Rings" onClick={(e) => { e.preventDefault(); navigateTo('shop', null, 'Rings'); }} className="hover:text-white transition-colors cursor-pointer">Solitaire Rings</a></li>
              <li><a href="/shop?category=Bridal%20Sets" onClick={(e) => { e.preventDefault(); navigateTo('shop', null, 'Bridal Sets'); }} className="hover:text-white transition-colors cursor-pointer">Bridal Sets</a></li>
              <li><a href="/shop?category=Bracelets%2FBangles" onClick={(e) => { e.preventDefault(); navigateTo('shop', null, 'Bracelets/Bangles'); }} className="hover:text-white transition-colors cursor-pointer">Bracelets & Bangles</a></li>
            </ul>
          </div>

          {/* Customer Care Accordion on Mobile / Standard Column on Desktop */}
          <div className="lg:col-span-2 border-t border-stone-800/80 pt-2.5 lg:border-none lg:pt-0">
            <button
              type="button"
              onClick={() => setIsCustomerCareOpen(!isCustomerCareOpen)}
              className="w-full flex items-center justify-between text-left lg:pointer-events-none"
            >
              <h5 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-brand-gold uppercase">Customer Care</h5>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform lg:hidden ${isCustomerCareOpen ? 'rotate-180 text-brand-gold' : ''}`} />
            </button>
            <ul className={`text-xs text-stone-400 space-y-2 pt-2 ${isCustomerCareOpen ? 'block' : 'hidden lg:block'}`}>
              <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigateTo('blog'); }} className="hover:text-brand-rose text-white font-semibold transition-colors cursor-pointer">📖 Ella Journal & Blogs</a></li>
              <li><a href="/brand-guidelines" onClick={(e) => { e.preventDefault(); navigateTo('brand-guidelines'); }} className="hover:text-white transition-colors cursor-pointer">Jewelry Care Guide</a></li>
              <li><a href="/shipping-policy" onClick={(e) => { e.preventDefault(); navigateTo('shipping-policy'); }} className="hover:text-white transition-colors cursor-pointer">Shipping & Delivery Policy</a></li>
              <li><a href="/refund-policy" onClick={(e) => { e.preventDefault(); navigateTo('refund-policy'); }} className="hover:text-white transition-colors cursor-pointer">Refund & Cancellation Policy</a></li>
              <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }} className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</a></li>
              <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a href="/sitemap" onClick={(e) => { e.preventDefault(); navigateTo('sitemap'); }} className="hover:text-white transition-colors cursor-pointer">Sitemap Directory</a></li>
              
              {/* ADMIN PANEL LINK: ONLY VISIBLE IF LOGGED IN AS ADMIN */}
              {isAdmin && (
                <li>
                  <a 
                    href="/admin" 
                    onClick={(e) => { e.preventDefault(); navigateTo('admin'); }} 
                    className="text-brand-gold font-bold hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 text-brand-gold" /> Admin Dashboard
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 border-t border-stone-800/80 pt-3 lg:border-none lg:pt-0 space-y-2">
            <h5 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-brand-gold uppercase">VIP Sparkle Club</h5>
            <p className="text-xs text-stone-400">Subscribe for early access to new jewelry drops and secret festive discount codes.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-stone-800 text-xs px-3 py-2 rounded-xl border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-brand-gold flex-1"
              />
              <button
                type="submit"
                className="bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                Join <Sparkles className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Attribution Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 border-t border-stone-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Ella Creations India. All Rights Reserved. Crafted with <Heart className="w-3.5 h-3.5 text-brand-rose inline mx-0.5 fill-current" /> for jewelry lovers.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-stone-400 text-[11px] sm:text-xs">
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }} className="hover:text-white transition-colors cursor-pointer">Terms of Service</a>
            <span>•</span>
            <a href="/refund-policy" onClick={(e) => { e.preventDefault(); navigateTo('refund-policy'); }} className="hover:text-white transition-colors cursor-pointer">Refund & Cancellation</a>
            <span>•</span>
            <a href="/shipping-policy" onClick={(e) => { e.preventDefault(); navigateTo('shipping-policy'); }} className="hover:text-white transition-colors cursor-pointer">Shipping & Delivery</a>
            <span>•</span>
            <a href="/brand-guidelines" onClick={(e) => { e.preventDefault(); navigateTo('brand-guidelines'); }} className="hover:text-white transition-colors cursor-pointer">Jewelry Care</a>
            <span>•</span>
            <a href="/sitemap" onClick={(e) => { e.preventDefault(); navigateTo('sitemap'); }} className="hover:text-white transition-colors cursor-pointer">Sitemap</a>
          </div>
        </div>

        {/* REQUIRED ATTRIBUTION: Made by Tellora Media */}
        <div className="pt-3 border-t border-stone-900 flex items-center justify-center text-xs text-stone-400">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span>Made by</span>
            <a
              href="https://telloramediahq.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-200 hover:text-brand-gold font-medium group transition-colors"
            >
              <img
                src="https://telloramediahq.com/tellora-logo.png"
                alt="Tellora Media Logo"
                className="h-4 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="font-semibold text-white group-hover:text-brand-gold transition-colors">Tellora Media</span>
              <span className="text-[11px] text-stone-400 group-hover:text-stone-300 font-normal">(telloramediahq.com)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
