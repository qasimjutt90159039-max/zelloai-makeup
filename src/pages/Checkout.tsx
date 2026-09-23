import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  MessageCircle, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Order, PaymentMethod } from '../types';

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, shippingFee, total, promoCode, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '0311-',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'Karachi',
    postalCode: '75400',
    deliveryNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add items before checking out.');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      setErrorMessage('Please complete all required shipping fields.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload: Partial<Order> = {
        userId: user?.id,
        items: cart,
        subtotal,
        discount,
        shippingFee,
        total,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.deliveryNotes,
        },
        paymentMethod,
        promoCodeApplied: promoCode || undefined,
      };

      const result = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/order-success/${result.id || result.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again or WhatsApp 03111802834.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4 bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl text-stone-900">Your bag is currently empty</h2>
        <p className="text-xs text-stone-500">Please add cosmetics or treatments before checking out.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
        >
          Return to Boutique Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF7F2]">
      
      {/* Header */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Checkout & Shipping
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Enter your Karachi delivery address and preferred payment method.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Shipping + Payment */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <MapPin className="w-4 h-4 text-[#8C5D3D]" />
              <h2 className="font-serif text-xl font-normal text-stone-900">1. Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sara Ahmed"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (Karachi) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0311-1802834"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="sara@example.com"
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Complete Street Address (House/Apartment, Block, Area) *
              </label>
              <textarea
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g. Flat 402, Block 2 P.E.C.H.S., Tariq Road, Karachi"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                name="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={handleInputChange}
                placeholder="e.g. Ring bell or leave with security"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Banknote className="w-4 h-4 text-[#8C5D3D]" />
              <h2 className="font-serif text-xl font-normal text-stone-900">2. Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* COD */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                paymentMethod === 'cod' ? 'border-[#8C5D3D] bg-[#FAF7F2]' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#8C5D3D] focus:ring-[#8C5D3D]"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#8C5D3D]" />
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-[11px] text-stone-500">Pay cash directly to the courier upon delivery at your doorstep in Karachi.</p>
                </div>
              </label>

              {/* Bank Transfer */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                paymentMethod === 'bank_transfer' ? 'border-[#8C5D3D] bg-[#FAF7F2]' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-[#8C5D3D] focus:ring-[#8C5D3D]"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#8C5D3D]" />
                    Direct Online Bank Transfer (IBFT)
                  </span>
                  <p className="text-[11px] text-stone-500">Transfer directly to our salon account and share receipt on WhatsApp 03111802834.</p>
                </div>
              </label>

              {/* JazzCash / EasyPaisa */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                paymentMethod === 'jazzcash' ? 'border-[#8C5D3D] bg-[#FAF7F2]' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 text-[#8C5D3D] focus:ring-[#8C5D3D]"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#8C5D3D]" />
                    JazzCash / EasyPaisa Mobile Wallet
                  </span>
                  <p className="text-[11px] text-stone-500">Fast wallet-to-wallet transfer to official salon number 03111802834.</p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Order Review & Place Order */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-100 pb-3">
              In Your Bag ({cart.length})
            </h2>

            {/* Compact items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-stone-100">
              {cart.map((item) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.product.image || (item.product.images && item.product.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#FAF7F2] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-stone-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-stone-900 shrink-0">
                      Rs. {(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({promoCode})</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Karachi Standard Delivery</span>
                <span>
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `Rs. ${shippingFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-xl font-serif text-[#8C5D3D]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
            >
              {submitting ? 'Processing Order...' : `Place Order · Rs. ${total.toLocaleString()}`}
            </button>

            <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <span>Zoellas Authenticity & Buyer Protection Guaranteed</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
