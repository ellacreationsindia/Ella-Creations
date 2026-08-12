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

  if (!isCartOpen) return null;

  const discountAmount = activeCoupon ? (cartSubtotal * activeCoupon.discountPercent) / 100 : 0;
  const shippingCost = cart.length === 0 ? 0 : 99;
  const grandTotal = cartSubtotal - discountAmount + shippingCost;

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-brand-gold/30">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 bg-brand-cream flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-rose" />
              <h2 className="font-serif text-xl font-bold text-stone-900">Shopping Bag ({cart.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Insured Delivery Banner */}
          <div className="px-6 py-2.5 bg-brand-sand/50 border-b border-brand-gold/20 flex items-center justify-between text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Insured courier packaging & fast delivery
            </span>
          </div>

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
                    alt={item.title}
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
                      <span className="text-[11px] font-medium text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-md inline-block mt-1">
                        Finish: {item.finish}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                          onClick={() => updateCartQty(idx, item.qty - 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 font-bold hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(idx, item.qty + 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 font-bold hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-sm text-stone-900">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
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
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({activeCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-stone-900">{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="text-brand-rose">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-soft-rose transition-all transform active:scale-95 text-xs uppercase tracking-wider"
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
