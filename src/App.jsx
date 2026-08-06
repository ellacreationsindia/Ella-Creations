import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductQuickView from './components/ProductQuickView';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import SEOHead from './components/SEOHead';
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailView from './views/ProductDetailView';
import AdminView from './views/AdminView';
import { Sparkles, AlertCircle, Info } from 'lucide-react';

function AppContent() {
  const { currentView, toast, isAuthModalOpen, setIsAuthModalOpen } = useStore();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-cream text-brand-charcoal">
      
      {/* Dynamic SEO Engine */}
      <SEOHead />

      {/* Show Storefront Header on non-admin views */}
      {currentView !== 'admin' && <Header />}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'product' && <ProductDetailView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      {/* Show Storefront Footer on non-admin views */}
      {currentView !== 'admin' && <Footer />}

      {/* Floating Modals & Drawers */}
      <ProductQuickView />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border ${
            toast.type === 'error' 
              ? 'bg-rose-900 text-white border-rose-700' 
              : toast.type === 'info'
              ? 'bg-stone-900 text-white border-stone-700'
              : 'bg-stone-900 text-brand-cream border-brand-gold/40 shadow-gold-glow'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-stone-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-brand-gold" />
            )}
            <span>{toast.message}</span>
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
