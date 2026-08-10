import React, { useState, useRef } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  LayoutDashboard, 
  Sparkles, 
  ChevronRight,
  User,
  LogOut,
  Crown
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
    showToast
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
      <div className="bg-gradient-to-r from-brand-charcoal via-stone-800 to-brand-charcoal text-white text-[11px] sm:text-xs py-2 px-3 text-center tracking-wider font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin hidden sm:inline" style={{ animationDuration: '6s' }} />
        <span>COMPLIMENTARY LUXURY GIFT BOX & EXPRESS SHIPPING OVER {formatPrice(2500)} | CODE: <strong className="text-brand-gold font-bold">ELLA10</strong></span>
        <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin hidden sm:inline" style={{ animationDuration: '6s' }} />
      </div>

      {/* Main Navigation Bar (3-Column Layout with Perfectly Contained Centered Logo) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-2">
          
          {/* LEFT COLUMN: Mobile Menu & Desktop Navigation Links */}
          <div className="flex items-center justify-start flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-stone-800 hover:text-brand-rose focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                className={`hover:text-brand-rose transition-colors py-1 relative ${currentView === 'shop' ? 'text-brand-rose font-bold border-b-2 border-brand-rose' : ''}`}
              >
                Shop Collections
              </button>
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
            </nav>
          </div>

          {/* CENTER COLUMN: PERFECTLY STRUCTURED CENTERED BRAND LOGO */}
          <div className="flex flex-col items-center justify-center text-center px-2">
            <div 
              onClick={handleLogoClick} 
              className="cursor-pointer flex flex-col items-center group"
              title="Ella Creations Monogram (Click 4 times continuously to open Admin Portal)"
            >
              <img 
                src="/logo.png" 
                alt="Ella Creations Monogram Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-sm"
              />
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-brand-charcoal group-hover:text-brand-rose transition-colors leading-tight mt-0.5">
                Ella Creations
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-brand-gold font-bold leading-none">
                Artificial Jewelry India
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: User Action Icons (Search, Wishlist, Cart Drawer, User Profile, Admin) */}
          <div className="flex items-center justify-end space-x-1 sm:space-x-3 flex-1">
            
            {/* Live Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone-700 hover:text-brand-rose transition-colors relative"
              title="Search Jewelry"
              aria-label="Search Jewelry"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('shop')}
              className="p-2 text-stone-700 hover:text-brand-rose transition-colors relative"
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-brand-rose text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-stone-700 hover:text-brand-rose transition-colors relative"
              title="View Cart"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Auth Profile Menu */}
            <div className="relative">
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

              {/* User Dropdown */}
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

                  {isAdmin && (
                    <button
                      onClick={() => { navigateTo('admin'); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-brand-rose hover:bg-brand-cream flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Open Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => { signOutUser(); setIsUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* ADMIN PANEL HEADER BUTTON: VISIBLE ONLY FOR LOGGED IN ADMIN */}
            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-300 ${
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

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => { navigateTo('home'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left font-medium text-stone-800 py-2.5 border-b border-stone-100"
          >
            Home Page
          </button>
          <button
            onClick={() => { navigateTo('shop', null, 'All'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left font-medium text-stone-800 py-2.5 border-b border-stone-100"
          >
            Shop All Jewelry Catalog
          </button>
          <button
            onClick={() => { navigateTo('shop', null, 'Necklaces'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left font-medium text-stone-800 py-2.5 border-b border-stone-100"
          >
            Necklaces
          </button>
          <button
            onClick={() => { navigateTo('shop', null, 'Earrings'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left font-medium text-stone-800 py-2.5 border-b border-stone-100"
          >
            Earrings
          </button>
          <button
            onClick={() => { navigateTo('shop', null, 'Bridal Sets'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left font-medium text-stone-800 py-2.5 border-b border-stone-100"
          >
            Bridal Sets
          </button>

          {!user && (
            <button
              onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
              className="block w-full text-left font-semibold text-brand-rose py-2.5 border-b border-stone-100"
            >
              Sign In / Register
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => { navigateTo('admin'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left font-bold text-brand-gold py-2.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Crown className="w-4 h-4" /> Admin Dashboard Access
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Instant Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-brand-gold/30 relative">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-brand-rose" />
                <input
                  type="text"
                  placeholder="Search by necklace, earrings, kundan, crystal, rose gold..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-base outline-none font-medium text-stone-800 placeholder:text-stone-400"
                />
              </div>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Results Preview */}
            <div className="mt-4 max-h-96 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-stone-400">
                  <p className="text-sm">Type to search handcrafted jewelry pieces...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  <p>No jewelry items found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        navigateTo('product', product.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-brand-cream rounded-xl cursor-pointer transition-colors border border-stone-100"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-14 h-14 object-cover rounded-lg border border-brand-gold/20"
                      />
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-semibold text-stone-800">{product.title}</h4>
                        <p className="text-xs text-stone-500">{product.category} • {product.stoneType}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-sm text-brand-rose">{formatPrice(product.price)}</span>
                        {product.comparePrice && (
                          <span className="block text-xs line-through text-stone-400">{formatPrice(product.comparePrice)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
