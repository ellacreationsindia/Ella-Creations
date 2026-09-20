import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  LayoutDashboard, 
  Sparkles, 
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
  Crown,
  Package,
  ShieldCheck,
  Truck,
  Instagram,
  Globe
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function Header() {
  const { 
    products, 
    cartItemsCount, 
    wishlist, 
    currentView, 
    navigateTo, 
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    user,
    isAdmin,
    setIsAuthModalOpen,
    setIsSecretAdminModalOpen,
    signOutUser,
    showToast,
    activePopupCampaign,
    selectedCategory
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Lock background body scroll when mobile navigation drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Hidden 4-Click Logo Listener State
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef(null);

  const handleLogoClick = () => {
    logoClickCountRef.current += 1;

    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }

    if (logoClickCountRef.current >= 4) {
      logoClickCountRef.current = 0;
      showToast('🔒 Hidden Admin Security Trigger Activated!', 'info');
      setIsSecretAdminModalOpen(true);
      navigateTo('admin');
      return;
    }

    logoClickTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 2000);

    // Standard logo action: Go to Home
    navigateTo('home');
  };

  const searchResults = searchQuery.trim() 
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.stoneType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-gold/20 shadow-sm transition-all">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-charcoal via-stone-800 to-brand-charcoal text-white text-[10px] sm:text-xs py-2 px-2.5 sm:px-3 text-center tracking-wider font-medium flex items-center justify-center gap-1.5 sm:gap-2 leading-tight">
        {activePopupCampaign ? (
          <button
            onClick={() => navigateTo('shop', null, 'Sale')}
            className="hover:text-amber-200 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer w-full text-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin flex-shrink-0" style={{ animationDuration: '6s' }} />
            <span className="truncate max-w-[90vw] sm:max-w-none">
              <strong className="text-amber-300 font-bold uppercase tracking-wider">{activePopupCampaign.headline || activePopupCampaign.name}: FLAT {activePopupCampaign.discount_percentage || activePopupCampaign.discountPercentage || 0}% OFF</strong>
              <span className="hidden sm:inline text-stone-300"> — TAP TO EXPLORE FESTIVE SALE</span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin flex-shrink-0" style={{ animationDuration: '6s' }} />
          </button>
        ) : (
          <>
            <Sparkles className="w-3 h-3 text-brand-gold animate-spin hidden sm:inline flex-shrink-0" style={{ animationDuration: '6s' }} />
            <span className="truncate max-w-[92vw] sm:max-w-none">INSURED EXPRESS COURIER DISPATCH ACROSS INDIA | ELLA CREATIONS FINE ARTIFICIAL JEWELRY</span>
            <Sparkles className="w-3 h-3 text-brand-gold animate-spin hidden sm:inline flex-shrink-0" style={{ animationDuration: '6s' }} />
          </>
        )}
      </div>

      {/* Main Navigation Bar (3-Column Layout with Perfectly Contained Centered Logo) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          
          {/* LEFT COLUMN: Mobile Hamburger & Search / Desktop Navigation Links */}
          <div className="flex items-center justify-start flex-1 gap-1">
            {/* Mobile Menu Button (Accessible 44px touch target) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-11 h-11 rounded-xl text-stone-800 hover:text-brand-rose hover:bg-brand-cream/60 focus:outline-none flex items-center justify-center transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Search Button (Direct 1-tap search access on mobile) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden w-11 h-11 rounded-xl text-stone-700 hover:text-brand-rose hover:bg-brand-cream/60 flex items-center justify-center transition-colors"
              aria-label="Search Jewelry"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-6 font-medium text-xs uppercase tracking-wider text-stone-700">
              <button 
                onClick={() => navigateTo('home')} 
                className={`hover:text-brand-rose transition-colors py-1 relative ${currentView === 'home' ? 'text-brand-rose font-bold border-b-2 border-brand-rose' : ''}`}
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo('shop', null, 'All')} 
                className={`hover:text-brand-rose transition-colors py-1 relative ${currentView === 'shop' && selectedCategory !== 'Sale' ? 'text-brand-rose font-bold border-b-2 border-brand-rose' : ''}`}
              >
                Shop Collections
              </button>
              {activePopupCampaign && (
                <button 
                  onClick={() => navigateTo('shop', null, 'Sale')} 
                  className={`transition-colors py-1 relative flex items-center gap-1 font-bold ${
                    currentView === 'shop' && selectedCategory === 'Sale'
                      ? 'text-rose-600 border-b-2 border-rose-600'
                      : 'text-rose-600 hover:text-rose-700'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-brand-gold animate-pulse" />
                  <span>Sale</span>
                  <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {activePopupCampaign.discount_percentage || activePopupCampaign.discountPercentage || 0}% OFF
                  </span>
                </button>
              )}
              <button 
                onClick={() => navigateTo('shop', null, 'Necklaces')} 
                className="hover:text-brand-rose transition-colors py-1"
              >
                Necklaces
              </button>
              <button 
                onClick={() => navigateTo('shop', null, 'Earrings')} 
                className="hover:text-brand-rose transition-colors py-1"
              >
                Earrings
              </button>
              <button 
                onClick={() => navigateTo('shop', null, 'Bridal Sets')} 
                className="hover:text-brand-rose transition-colors py-1"
              >
                Bridal Sets
              </button>
              <button 
                onClick={() => navigateTo('blog')} 
                className={`hover:text-brand-rose transition-colors py-1 relative ${currentView === 'blog' || currentView === 'blog-detail' ? 'text-brand-rose font-bold border-b-2 border-brand-rose' : ''}`}
              >
                Ella Journal
              </button>
            </nav>
          </div>

          {/* CENTER COLUMN: PERFECTLY STRUCTURED CENTERED BRAND LOGO */}
          <div className="flex flex-col items-center justify-center text-center px-1 flex-shrink-0">
            <div 
              onClick={handleLogoClick} 
              className="cursor-pointer flex flex-col items-center group"
              title="Ella Creations Monogram (Click 4 times continuously to open Admin Portal)"
            >
              <img 
                src="/logo.png" 
                alt="Ella Creations Monogram Logo" 
                className="h-8 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-sm"
              />
              <span className="font-serif text-base sm:text-xl font-bold tracking-wider text-brand-charcoal group-hover:text-brand-rose transition-colors leading-tight mt-0.5">
                Ella Creations
              </span>
              <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-brand-gold font-bold leading-none">
                Artificial Jewelry India
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: User Action Icons (Wishlist, Cart Drawer, Search on Desktop, Profile) */}
          <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-1">
            
            {/* Desktop-Only Live Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex w-11 h-11 rounded-xl text-stone-700 hover:text-brand-rose hover:bg-brand-cream/60 transition-colors items-center justify-center"
              title="Search Jewelry"
              aria-label="Search Jewelry"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger (Comfortable 44px touch area) */}
            <button
              onClick={() => navigateTo('account')}
              className="w-11 h-11 rounded-xl text-stone-700 hover:text-brand-rose hover:bg-brand-cream/60 transition-colors relative flex items-center justify-center"
              title="Wishlist & Account"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-rose text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger (Comfortable 44px touch area) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-11 h-11 rounded-xl text-stone-700 hover:text-brand-rose hover:bg-brand-cream/60 transition-colors relative flex items-center justify-center"
              title="View Cart"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Auth Profile Menu (Desktop) */}
            <div className="relative hidden lg:block">
              {user ? (
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-brand-cream transition-colors border border-brand-gold/30"
                  title="Account Settings"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-rose text-white flex items-center justify-center text-xs font-bold">
                      {(user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-brand-rose p-2 transition-colors"
                  title="Sign In / Register"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden xl:inline">Sign In</span>
                </button>
              )}

              {/* Desktop User Dropdown */}
              {isUserDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 z-50">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900 truncate">{user.user_metadata?.full_name || 'Customer'}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="mt-1 bg-brand-gold/20 text-brand-gold-dark border border-brand-gold/40 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Crown className="w-3 h-3" /> VERIFIED ADMIN
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => { navigateTo('account'); setIsUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center gap-2 border-b border-stone-100"
                  >
                    <Package className="w-4 h-4 text-brand-rose" /> My Orders & Live Tracking
                  </button>

                  <button
                    onClick={() => { navigateTo('account'); setIsUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-stone-500" /> Account Register & Profile
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => { navigateTo('admin'); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-brand-rose hover:bg-brand-cream flex items-center gap-2 border-t border-stone-100"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Open Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => { signOutUser(); setIsUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-stone-100"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* ADMIN PANEL HEADER BUTTON (Desktop) */}
            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-300 ${
                  currentView === 'admin'
                    ? 'bg-brand-rose text-white shadow-soft-rose'
                    : 'bg-brand-gold text-stone-900 shadow-gold-glow hover:bg-stone-900 hover:text-white'
                }`}
                title="Admin Panel (Authorized)"
              >
                <Crown className="w-3.5 h-3.5 text-amber-900" />
                <span className="hidden xl:inline">ADMIN</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* APP-LIKE SLIDE-OUT MOBILE NAVIGATION DRAWER (PORTALED TO BODY TO PREVENT HEADER CLIPPING) */}
      {isMobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] lg:hidden flex">
          {/* Dark Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content Panel (Slides in from left) */}
          <div className="relative w-[85vw] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto border-r border-brand-gold/30 animate-slideRight">
            
            {/* Drawer Top Header */}
            <div>
              <div className="p-4 border-b border-brand-gold/20 bg-brand-cream/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Ella Creations Logo" className="h-8 w-auto object-contain" />
                  <div>
                    <span className="font-serif text-base font-bold text-stone-900 block leading-none">Ella Creations</span>
                    <span className="text-[8px] uppercase tracking-widest text-brand-gold font-bold">Artificial Jewelry</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Items */}
              <nav className="p-4 space-y-1.5 text-xs font-semibold">
                
                {/* Home */}
                <button
                  onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                    currentView === 'home' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-800 hover:bg-brand-cream'
                  }`}
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                {/* Active Promotional Sale Ribbon Item */}
                {activePopupCampaign && (
                  <button
                    onClick={() => { navigateTo('shop', null, 'Sale'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-brand-rose text-white font-bold transition-all shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                      <span>Promotional Sale</span>
                    </div>
                    <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      FLAT {activePopupCampaign.discount_percentage || activePopupCampaign.discountPercentage || 0}% OFF
                    </span>
                  </button>
                )}

                {/* Expandable Shop Collections Section */}
                <div className="pt-1 pb-1">
                  <button
                    onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-stone-800 hover:bg-brand-cream transition-colors flex items-center justify-between font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-brand-gold" /> Shop Categories
                    </span>
                    <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isMobileShopOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMobileShopOpen && (
                    <div className="pl-6 pr-2 py-1 space-y-1 bg-brand-cream/30 rounded-xl my-1 border-l-2 border-brand-rose/40">
                      <button
                        onClick={() => { navigateTo('shop', null, 'All'); setIsMobileMenuOpen(false); }}
                        className="w-full text-left py-2 px-2 text-stone-700 hover:text-brand-rose text-xs font-medium flex items-center justify-between"
                      >
                        <span>All Jewelry</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                      {[
                        { label: 'Necklace', cat: 'Necklace' },
                        { label: 'Pendant Set', cat: 'Pendant Set' },
                        { label: 'Rings', cat: 'Rings' },
                        { label: 'Earring', cat: 'Earring' },
                        { label: 'Bridal Sets', cat: 'Bridal Sets' },
                        { label: 'Bracelets / Bangles', cat: 'Bracelets/Bangles' },
                        { label: 'Others', cat: 'Others' }
                      ].map((item) => (
                        <button
                          key={item.cat}
                          onClick={() => { navigateTo('shop', null, item.cat); setIsMobileMenuOpen(false); }}
                          className="w-full text-left py-2 px-2 text-stone-700 hover:text-brand-rose text-xs font-medium flex items-center justify-between"
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ella Journal */}
                <button
                  onClick={() => { navigateTo('blog'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                    currentView === 'blog' ? 'bg-brand-rose text-white shadow-soft-rose' : 'text-stone-800 hover:bg-brand-cream'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>📖</span> Ella Journal & Styling Advice
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                {/* Divider */}
                <div className="border-t border-stone-200 my-2 pt-2" />

                {/* Account & Orders Links */}
                <button
                  onClick={() => { navigateTo('account'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-stone-800 hover:bg-brand-cream transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-rose" /> My Orders & Live Tracking
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => { navigateTo('account'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-stone-800 hover:bg-brand-cream transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-rose" /> Saved Wishlist ({wishlist.length})
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                {!user ? (
                  <button
                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-brand-rose bg-rose-50 border border-rose-200 transition-colors flex items-center justify-between font-bold mt-2"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Sign In / Create Account
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ) : (
                  <div className="pt-2">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 mb-2">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.user_metadata?.full_name || 'Logged In Customer'}</p>
                      <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => { signOutUser(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}

                {/* Admin Portal Access (Only for Admin) */}
                {isAdmin && (
                  <button
                    onClick={() => { navigateTo('admin'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-stone-900 text-brand-gold font-bold transition-colors flex items-center justify-between shadow-md mt-2"
                  >
                    <span className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-brand-gold" /> Open Admin Portal
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </nav>
            </div>

            {/* Drawer Footer with Assurances */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 safe-pb space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-stone-600 font-medium">
                <Truck className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>Insured Express Delivery across India</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-rose flex-shrink-0" />
                <span>Handcrafted Luxury Artificial Jewelry</span>
              </div>
              <div className="pt-1 text-[10px] text-stone-400">
                &copy; {new Date().getFullYear()} Ella Creations India
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* MOBILE-OPTIMIZED INSTANT SEARCH OVERLAY (PORTALED TO BODY) */}
      {isSearchOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] bg-stone-950/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-brand-gold/30 relative max-h-[85vh] flex flex-col">
            
            {/* Search Input Bar */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 gap-3">
              <div className="flex items-center gap-2.5 flex-1">
                <Search className="w-5 h-5 text-brand-rose flex-shrink-0" />
                <input
                  type="search"
                  placeholder="Search choker, earrings, kundan, rings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-sm sm:text-base outline-none font-medium text-stone-800 placeholder:text-stone-400 bg-transparent"
                />
              </div>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Suggestions */}
            {searchQuery.trim() === '' && (
              <div className="pt-3 pb-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">Popular Searches:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Kundan Choker', 'CZ Drop Earrings', 'Solitaire Rings', 'Bridal Sets', 'Meenakari'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="text-xs px-2.5 py-1 rounded-full bg-brand-cream text-stone-700 border border-brand-gold/30 hover:border-brand-rose transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Preview List */}
            <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-stone-400 space-y-1">
                  <p className="text-xs sm:text-sm">Type any jewelry style or stone to preview results instantly</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-stone-500 space-y-2">
                  <p className="text-xs sm:text-sm font-semibold">No jewelry items found matching "{searchQuery}"</p>
                  <p className="text-xs text-stone-400">Try searching for "Necklace", "Earrings", "Kundan", or "CZ"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{searchResults.length} Pieces Found</span>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        navigateTo('product', product.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2.5 hover:bg-brand-cream/60 active:bg-brand-cream rounded-2xl cursor-pointer transition-colors border border-stone-100"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-14 h-14 object-contain p-1 rounded-xl border border-brand-gold/20 bg-white flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs sm:text-sm font-semibold text-stone-900 truncate">{product.title}</h4>
                        <p className="text-[11px] text-stone-500">{product.category} • {product.stoneType}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-bold text-xs sm:text-sm text-brand-rose">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                          <span className="block text-[10px] line-through text-stone-400">{formatPrice(product.comparePrice)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

    </header>
  );
}

