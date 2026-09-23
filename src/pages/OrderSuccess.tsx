import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Truck, MapPin, Phone, MessageCircle, ArrowRight, Printer } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getOrders()
        .then((list) => {
          const found = list.find((o) => o.id === id || o.orderNumber === id);
          if (found) {
            setOrder(found);
          } else if (list.length > 0) {
            setOrder(list[0]);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-24 text-stone-500">Loading order receipt...</div>;
  }

  const orderNumber = order?.orderNumber || id || 'ZBS-ORD-5012';
  const customerName = order?.shippingAddress?.fullName || 'Valued Client';
  const customerPhone = order?.shippingAddress?.phone || BUSINESS_INFO.phone;
  const deliveryAddress = order?.shippingAddress?.address || 'Karachi, Pakistan';
  const orderTotal = order?.total || 7500;

  const whatsappMessage = `Hi Zoellas Beauty Salon! I placed an order on your website:\nOrder #: ${orderNumber}\nClient: ${customerName} (${customerPhone})\nAddress: ${deliveryAddress}\nTotal: Rs. ${orderTotal.toLocaleString()}\nPayment: ${order?.paymentMethod?.toUpperCase() || 'COD'}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 bg-[#FAF7F2]">
      {/* Top Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Thank You for Shopping with Zoellas!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Your order has been recorded and will be prepared at our Tariq Road studio for prompt delivery.
        </p>
      </div>

      {/* Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-xs text-stone-500">Order Tracking Number</span>
            <div className="font-mono text-lg font-bold text-[#8C5D3D]">{orderNumber}</div>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Order Details */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Recipient Name</span>
            <span className="font-semibold text-stone-900">{customerName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Contact Number</span>
            <span className="font-semibold text-stone-900">{customerPhone}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Delivery Address</span>
            <span className="font-semibold text-stone-900 text-right max-w-xs">{deliveryAddress}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Payment Method</span>
            <span className="font-semibold text-stone-900 uppercase">{order?.paymentMethod || 'COD'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100 text-sm">
            <span className="text-stone-700 font-semibold">Total Payable</span>
            <span className="font-bold text-stone-900">Rs. {orderTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery Timelines */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D5CE] flex items-center gap-3 text-xs text-stone-600">
          <Truck className="w-5 h-5 text-[#8C5D3D] shrink-0" />
          <div>
            <p className="font-semibold text-stone-900">Karachi Delivery Window</p>
            <p className="text-stone-500 mt-0.5">Expect dispatch within 24 hours. Courier delivery in 1–3 business days.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={`https://wa.me/92${BUSINESS_INFO.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify Salon on WhatsApp</span>
          </a>

          <Link
            to="/my-orders"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
