import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    total, 
    shippingFee 
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(0, BUSINESS_INFO.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / BUSINESS_INFO.freeShippingThreshold) * 100);

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#E8D5CE] animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E8D5CE] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <h3 className="font-serif font-normal text-lg text-stone-900">Your Shopping Bag</h3>
                <p className="text-[11px] text-stone-500">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-[#EFE8DC]/50 border-b border-[#E8D5CE] text-xs">
            <div className="flex items-center justify-between mb-1.5 text-stone-700">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#8C5D3D]" />
                {freeShippingNeeded === 0 ? (
                  <span className="text-emerald-700 font-bold">You unlocked FREE Karachi delivery!</span>
                ) : (
                  <span>Add <strong>Rs. {freeShippingNeeded.toLocaleString()}</strong> for Free Delivery</span>
                )}
              </span>
              <span className="text-[11px] font-bold text-stone-800">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8C5D3D] rounded-full transition-all duration-300" 
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8D5CE]">
            {cart.length === 0 ? (
              <div id="empty-cart-drawer-view" className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#EFE8DC] rounded-full flex items-center justify-center mx-auto text-[#8C5D3D]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-normal text-stone-900">Your Bag is Empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore curated salon hair care, skin serums, makeup essentials, and beauty tools.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block px-6 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white text-xs font-semibold transition-colors"
                >
                  Explore Beauty Shop
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.id} className="py-4 flex gap-3">
                    <img
                      src={item.product.image || (item.product.images && item.product.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0 bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <p className="text-[11px] text-[#8C5D3D] font-medium uppercase tracking-wider">{item.product.category}</p>
                          <h4 className="text-xs font-semibold text-stone-900 truncate">{item.product.name}</h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-stone-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-1 hover:bg-stone-100 text-stone-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-stone-900">
                            Rs. {(itemPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8D5CE] bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Karachi Delivery</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `Rs. ${shippingFee}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-bold text-stone-900">
                  <span>Estimated Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-2.5 text-center border border-stone-300 hover:border-stone-400 text-xs font-semibold text-stone-700 rounded-xl transition-colors"
                >
                  View Full Bag
                </Link>

                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-2 py-2.5 flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>Cash on Delivery & Secure Bank Transfer Available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
