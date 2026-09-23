import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Check, Copy, Tag, MessageCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Offer } from '../types';

export const Offers: React.FC = () => {
  const { openAppointmentModal, showToast } = useCart();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOffers()
      .then((res) => setOffers(res))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const promoCodes = [
    {
      code: 'ZOELLAS10',
      discount: '10% OFF',
      description: 'Applicable across all retail boutique products and salon visits.',
    },
    {
      code: 'GLAM20',
      discount: '20% OFF',
      description: 'Exclusive 20% discount on cart orders above Rs. 8,000.',
    },
    {
      code: 'TARIQROAD',
      discount: 'Rs. 500 FLAT',
      description: 'Direct discount voucher for Karachi residents on their first salon booking.',
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code ${code} copied to clipboard!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Exclusive Privileges
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Special Salon Packages & Deals
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Indulge in curated treatment combinations and limited-time beauty bundle savings at our Tariq Road studio.
        </p>
      </div>

      {/* Active Promo Codes */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#8C5D3D]" />
          <h2 className="font-serif text-2xl font-normal text-stone-900">Current Promotional Codes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promoCodes.map((pc) => (
            <div
              key={pc.code}
              className="p-4 rounded-xl border border-dashed border-[#8C5D3D]/50 bg-[#FAF7F2] flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8C5D3D] tracking-wider uppercase">
                  {pc.discount}
                </span>
                <div className="font-mono text-base font-bold text-stone-900">{pc.code}</div>
                <p className="text-[11px] text-stone-500 leading-tight">{pc.description}</p>
              </div>

              <button
                onClick={() => handleCopyCode(pc.code)}
                className="p-2.5 rounded-lg bg-white border border-stone-300 hover:bg-[#EFE8DC] text-stone-700 transition-colors shrink-0"
                title="Copy coupon code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-normal text-stone-900 border-b border-[#E8D5CE] pb-3">
          Curated Treatment Packages
        </h2>

        {loading ? (
          <div className="text-center py-20 text-stone-500">Loading exclusive packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer) => {
              const savings = offer.originalPrice - offer.offerPrice;
              return (
                <div
                  key={offer.id}
                  className="rounded-3xl bg-white border border-[#E8D5CE] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-16/10 relative overflow-hidden">
                      <img
                        src={offer.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80'}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-[#1A1A1A] text-[#C5A880] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {offer.badge}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Save Rs. {savings.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif text-xl font-normal text-stone-900">{offer.title}</h3>
                        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{offer.description}</p>
                      </div>

                      <div className="space-y-2 border-t border-stone-100 pt-3">
                        <span className="text-[11px] font-semibold text-stone-900 uppercase tracking-wider">
                          Package Includes:
                        </span>
                        {offer.includedServices.map((srv, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="flex items-center justify-between py-4 border-t border-stone-100">
                      <div>
                        <span className="text-xs text-stone-400 line-through block">
                          Rs. {offer.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xl font-bold text-stone-900">
                          Rs. {offer.offerPrice.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => openAppointmentModal()}
                        className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Book Package</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* WhatsApp Custom Package Notice */}
      <section className="bg-[#1A1A1A] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
            Custom Bridal & Group Celebrations
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            Need a Tailored Party or Mehndi Package?
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
            We curate bespoke bridal party packages for groups of 3 or more brides and bridesmaids. Message us directly on WhatsApp with your event date.
          </p>
        </div>

        <a
          href={BUSINESS_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3.5 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Inquire on WhatsApp: 03111802834</span>
        </a>
      </section>
    </div>
  );
};
