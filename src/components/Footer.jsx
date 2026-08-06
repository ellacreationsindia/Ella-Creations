import React from 'react';
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
  Crown
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function Footer() {
  const { navigateTo, isAdmin } = useStore();

  return (
    <footer className="w-full bg-stone-950 text-stone-200 pt-16 pb-12 border-t border-brand-gold/30 relative z-30 block">
      {/* Brand Assurances Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-rose/20 flex items-center justify-center text-brand-rose mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">100% Anti-Tarnish</h4>
            <p className="text-xs text-stone-400">Handcrafted with premium protective e-coating for lasting shine.</p>
          </div>

          <div className="flex flex-col items-center sm:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold mb-2">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">Express Shipping</h4>
            <p className="text-xs text-stone-400">Complimentary priority delivery on all orders exceeding {formatPrice(2500)}.</p>
          </div>

          <div className="flex flex-col items-center sm:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pink mb-2">
              <Gift className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">Luxury Gift Packaging</h4>
            <p className="text-xs text-stone-400">Every order arrives in our signature velvet jewellery keepsake box.</p>
          </div>

          <div className="flex flex-col items-center sm:items-start space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold mb-2">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">Dedicated Support</h4>
            <p className="text-xs text-stone-400">24/7 Concierge assistance for styling guidance & custom orders.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Bio with Enlarged Logo */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Ella Creations Logo" className="h-14 sm:h-16 w-auto object-contain filter drop-shadow" />
              <span className="font-serif text-2xl font-bold text-white">Ella Creations</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400">
              Ella Creations is a contemporary artificial jewelry brand crafted for the modern, confident and elegant woman. Our pieces are designed to add a touch of timeless beauty and sparkle to every moment.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-brand-rose text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-brand-rose text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-brand-rose text-white flex items-center justify-center transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-serif text-sm font-semibold tracking-wider text-brand-gold uppercase">Collections</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Royal Kundan Chokers</button></li>
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Rose Gold CZ Drops</button></li>
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Solitaire Rings</button></li>
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Floral Charm Cuffs</button></li>
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Bridal & Festive Sets</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-serif text-sm font-semibold tracking-wider text-brand-gold uppercase">Customer Care</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Jewelry Care Guide</button></li>
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Size & Fit Chart</button></li>
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Shipping & Returns</button></li>
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Track Order Status</button></li>
              
              {/* ADMIN PANEL LINK: ONLY VISIBLE IF LOGGED IN AS ADMIN */}
              {isAdmin && (
                <li>
                  <button 
                    onClick={() => navigateTo('admin')} 
                    className="text-brand-gold font-bold hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    <Crown className="w-3.5 h-3.5 text-brand-gold" /> Admin Dashboard Access
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-serif text-sm font-semibold tracking-wider text-brand-gold uppercase">VIP Sparkle Club</h5>
            <p className="text-xs text-stone-400">Subscribe to receive exclusive preview access to new artificial jewelry drops and 15% off your first order.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to VIP Sparkle Club!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="bg-stone-800 text-xs px-3.5 py-2.5 rounded-lg border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-brand-gold flex-1"
              />
              <button
                type="submit"
                className="bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Join <Sparkles className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Ella Creations. All Rights Reserved. Crafted with <Heart className="w-3.5 h-3.5 text-brand-rose inline mx-0.5 fill-current" /> for artificial jewelry lovers.</p>
        <div className="flex space-x-4 text-stone-400">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-white">Brand Guidelines</a>
        </div>
      </div>
    </footer>
  );
}
