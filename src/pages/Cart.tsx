import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ChevronLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';

export const Cart: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    discount, 
    shippingFee, 
    total, 
    promoCode, 
    promoError, 
    applyPromoCode, 
    removePromoCode 
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode.trim());
      setInputCode('');
    }
  };

  const freeShippingThreshold = BUSINESS_INFO.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 bg-[#FAF7F2]">
        <div className="w-20 h-20 bg-[#EFE8DC] text-[#8C5D3D] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-normal text-stone-900">Your Shopping Bag is Empty</h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            Explore our curated salon cosmetics, restorative hair treatments, and beauty elixirs.
          </p>
        </div>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
          >
            <span>Explore Beauty Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF7F2]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8D5CE] gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">Your Shopping Bag</h1>
          <p className="text-xs text-stone-500 mt-1">Review your selected items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-rose-600 transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Entire Bag</span>
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8D5CE] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-stone-800">
            <Sparkles className="w-4 h-4 text-[#8C5D3D]" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-bold">You qualify for FREE delivery across Karachi!</span>
            ) : (
              <span>Add <strong>Rs. {remainingForFreeShipping.toLocaleString()}</strong> more to unlock FREE Karachi delivery</span>
            )}
          </span>
          <span className="font-bold text-stone-900 text-xs">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8C5D3D] rounded-full transition-all duration-300"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Content Columns: Items Table + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs divide-y divide-[#E8D5CE]">
          {cart.map((item) => {
            const itemPrice = item.product.discountPrice || item.product.price;
            return (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={item.product.image || (item.product.images && item.product.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-stone-200 bg-[#FAF7F2] shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C5D3D] font-medium">
                    {item.product.category}
                  </span>
                  <Link to={`/product/${item.product.slug || item.product.id}`}>
                    <h3 className="text-sm font-semibold text-stone-900 hover:text-[#8C5D3D] transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  {item.selectedVariant && (
                    <p className="text-[11px] text-stone-500">Shade / Option: {item.selectedVariant}</p>
                  )}
                  <p className="text-xs font-bold text-stone-900">
                    Rs. {itemPrice.toLocaleString()} each
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:bg-stone-100 text-stone-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:bg-stone-100 text-stone-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal for line item */}
                  <div className="text-right min-w-[5rem]">
                    <span className="text-sm font-bold text-stone-900">
                      Rs. {(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount ({promoCode})</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Karachi Standard Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    `Rs. ${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-stone-900">
                <span>Estimated Total</span>
                <span className="text-xl font-serif text-[#8C5D3D]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-stone-100">
              {promoCode ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-800">{promoCode} Applied</span>
                    <p className="text-[11px] text-emerald-600">Saved Rs. {discount.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700">
                    Promo Code (Try ZOELLAS10 or TARIQROAD)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Enter coupon"
                      className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-600">{promoError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Checkout Button */}
            <div className="space-y-2 pt-2">
              <Link
                to="/checkout"
                className="w-full py-4 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/shop"
                className="w-full py-2.5 text-center text-xs text-stone-500 hover:text-stone-900 transition-colors block"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Security Badges */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <span>Safe & Secure Cash on Delivery in Karachi</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
