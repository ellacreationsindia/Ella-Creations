import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQty, 
    cartSubtotal, 
    promotionalSavings = 0,
    activeCoupon, 
    applyCoupon, 
    removeCoupon,
    coupons,
    setIsCheckoutOpen,
    user,
    requireAuthForAction,
    navigateTo
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  // Lock background scrolling when cart drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Support Escape key to dismiss drawer
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 999;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 99);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const discountAmount = activeCoupon ? (cartSubtotal * activeCoupon.discountPercent) / 100 : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleProceedToCheckout = () => {
    requireAuthForAction(() => {
      setIsCartOpen(false);
      navigateTo('checkout');
    }, 'Please sign in or create an account to proceed to checkout.');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full justify-end">
        <div 
          className="w-full sm:max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-brand-gold/30"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-200 bg-brand-cream flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-rose" />
              <h2 id="cart-drawer-heading" className="font-serif text-xl font-bold text-stone-900">
                Shopping Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              aria-label="Close Shopping Bag"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Dynamic Free Shipping Threshold Progress Banner */}
          {cart.length > 0 && (
            <div className="px-5 sm:px-6 py-2.5 bg-brand-sand/40 border-b border-brand-gold/20 text-xs">
              {isFreeShipping ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You've unlocked <strong>FREE Insured Express Delivery</strong>!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-stone-700">
                    <span>Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more for <strong>FREE Delivery</strong></span>
                    <span className="text-[10px] text-brand-rose font-bold">{Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-brand-rose to-brand-gold h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-cream mx-auto flex items-center justify-center text-brand-rose">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Your bag is currently empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our luxury artificial jewelry collection and add your favorite pieces.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-brand-rose text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-brand-rose/90 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.id}-${item.finish}-${idx}`}
                  className="flex gap-4 p-3 bg-brand-card rounded-xl border border-stone-200/60 relative group"
                >
                  <img
                    src={item.image}
                    alt={`${item.title} - Selected Shopping Bag Item`}
                    className="w-20 h-20 object-contain p-1 bg-white rounded-lg border border-brand-gold/20 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-semibold text-stone-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 items-center mt-1">
                        <span className="text-[11px] font-medium text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-md inline-block">
                          Finish: {item.finish}
                        </span>
                      </div>
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="space-y-0.5 mt-1.5">
                          {item.selectedAddons.map((addon, aIdx) => (
                            <div key={aIdx} className="text-[10px] text-stone-600 bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 rounded-md flex justify-between items-center">
                              <span>+ {addon.name}</span>
                              <span className="font-bold text-brand-rose font-sans">+{formatPrice(addon.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateCartQty(idx, item.qty - 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm text-stone-600 font-bold hover:bg-stone-100 active:bg-stone-200 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 sm:px-3 text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(idx, item.qty + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm text-stone-600 font-bold hover:bg-stone-100 active:bg-stone-200 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className={`font-bold text-sm ${item.hasPromo ? 'text-brand-rose' : 'text-stone-900'}`}>
                            {formatPrice(item.price * item.qty)}
                          </span>
                          {item.hasPromo && item.originalPrice && (
                            <span className="text-xs line-through text-stone-400">
                              {formatPrice(item.originalPrice * item.qty)}
                            </span>
                          )}
                        </div>
                        {item.hasPromo && (
                          <span className="text-[9px] font-bold text-brand-rose bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded inline-block mt-0.5">
                            SALE -{item.discountPercent}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 space-y-4 safe-pb">
              {/* Coupon Form */}
              <div>
                {activeCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Code <strong>{activeCoupon.code}</strong> Applied (-{activeCoupon.discountPercent}%)</span>
                    </div>
                    <button onClick={removeCoupon} className="text-stone-500 hover:text-rose-600 text-[11px] underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. ELLA10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-brand-rose uppercase font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {/* Dynamically Filtered Eligible Coupons (Only rendered if coupon active AND order meets minSpend) */}
                {coupons && coupons.length > 0 && !activeCoupon && (
                  (() => {
                    const eligible = coupons.filter(c => c.active !== false && (Number(c.minSpend) || 0) <= cartSubtotal);
                    if (eligible.length === 0) return null;
                    return (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {eligible.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => applyCoupon(c.code)}
                            className="text-[10px] bg-brand-pink/30 text-stone-800 font-semibold px-2.5 py-1 rounded-lg border border-brand-rose/30 hover:bg-brand-rose hover:text-white transition-all flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3 text-brand-rose" />
                            Use {c.code} ({c.discountPercent}% OFF{c.minSpend > 0 ? ` over ${formatPrice(c.minSpend)}` : ''})
                          </button>
                        ))}
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {promotionalSavings > 0 && (
                  <div className="flex justify-between text-rose-700 font-semibold bg-rose-50/80 px-2 py-1 rounded-md border border-rose-200">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand-gold" /> Promotional Sale Savings
                    </span>
                    <span>-{formatPrice(promotionalSavings)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({activeCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Estimated Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                      FREE (Orders over ₹999)
                    </span>
                  ) : (
                    <span className="font-semibold text-stone-900">{formatPrice(shippingCost)}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="text-brand-rose">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full min-h-[48px] bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-soft-rose transition-all transform active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
