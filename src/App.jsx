import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductQuickView from './components/ProductQuickView';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import PromotionPopup from './components/PromotionPopup';
import SEOHead from './components/SEOHead';
import AnimatedBackground from './components/AnimatedBackground';
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailView from './views/ProductDetailView';
import CheckoutView from './views/CheckoutView';
import AdminView from './views/AdminView';
import TermsView from './views/TermsView';
import PrivacyView from './views/PrivacyView';
import RefundPolicyView from './views/RefundPolicyView';
import ShippingPolicyView from './views/ShippingPolicyView';
import BrandGuidelinesView from './views/BrandGuidelinesView';
import SitemapView from './views/SitemapView';
import BlogView from './views/BlogView';
import AccountView from './views/AccountView';
import NotFoundView from './views/NotFoundView';
import { Sparkles, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { currentView, toast, isAuthModalOpen, setIsAuthModalOpen } = useStore();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent text-brand-charcoal relative selection:bg-brand-rose selection:text-white">
      
      {/* Ambient Live Animated Gradient & Aurora Mesh Background */}
      <AnimatedBackground />

      {/* Dynamic SEO Engine */}
      <SEOHead />

      {/* Show Storefront Header on non-admin views */}
      {currentView !== 'admin' && <Header />}

      {/* Main View Router with 404 Fallback */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'product' && <ProductDetailView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'admin' && <AdminView />}
        {(currentView === 'blog' || currentView === 'blog-detail') && <BlogView />}
        {currentView === 'terms' && <TermsView />}
        {currentView === 'privacy' && <PrivacyView />}
        {currentView === 'refund-policy' && <RefundPolicyView />}
        {currentView === 'shipping-policy' && <ShippingPolicyView />}
        {currentView === 'brand-guidelines' && <BrandGuidelinesView />}
        {currentView === 'sitemap' && <SitemapView />}
        {currentView === '404' && <NotFoundView />}
        {![
          'home', 'shop', 'product', 'checkout', 'account', 'admin', 
          'blog', 'blog-detail', 'terms', 'privacy', 'refund-policy', 'shipping-policy', 'brand-guidelines', 'sitemap', '404'
        ].includes(currentView) && <NotFoundView />}
      </main>

      {/* Show Storefront Footer on non-admin views */}
      {currentView !== 'admin' && <Footer />}

      {/* Floating Modals & Drawers */}
      <ProductQuickView />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      {currentView !== 'admin' && <PromotionPopup />}

      {/* Floating Global Toast Notification (Success, Error & Info with Safe Area) */}
      {toast && (
        <div className="fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-[99999] flex justify-center sm:justify-end pointer-events-none">
          <div className={`pointer-events-auto flex items-center gap-2.5 sm:gap-3 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold border backdrop-blur-md transition-all animate-bounce ${
            toast.type === 'error' 
              ? 'bg-rose-950/95 text-rose-100 border-rose-500/80 shadow-rose-950/50' 
              : toast.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/80 shadow-emerald-950/50'
              : toast.type === 'info'
              ? 'bg-stone-900/95 text-stone-100 border-stone-600 shadow-stone-950/50'
              : 'bg-stone-900/95 text-brand-cream border-brand-gold/50 shadow-gold-glow'
          }`}>
            {toast.type === 'error' ? (
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
            ) : toast.type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : toast.type === 'info' ? (
              <div className="w-6 h-6 rounded-full bg-stone-700 text-stone-300 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <span className="leading-snug">{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
