import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Check, 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Sparkles,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Service } from '../types';

export const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openAppointmentModal } = useCart();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getServiceById(id)
        .then((res) => setService(res))
        .catch((err) => console.error('Failed to load service', err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-24 text-stone-500">Loading service details...</div>;
  }

  if (!service) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="font-serif text-2xl text-stone-900">Service Not Found</h2>
        <Link to="/services" className="inline-block text-xs font-semibold text-[#8C5D3D] underline">
          Back to all services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#FAF7F2]">
      {/* Breadcrumb */}
      <div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#8C5D3D] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Salon Services</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Visual */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl overflow-hidden border border-[#E8D5CE] shadow-md bg-white aspect-4/3">
            <img
              src={service.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80'}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8D5CE] flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8C5D3D]" />
              <span>Zoellas Beauty Salon, Tariq Road, Karachi</span>
            </div>
            <span className="font-medium text-stone-900">Block 2 P.E.C.H.S.</span>
          </div>
        </div>

        {/* Right Info & Booking Box */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#8C5D3D] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{service.category} Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
              {service.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-stone-500 mt-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#8C5D3D]" />
                <span>{service.duration} Session</span>
              </div>
              <span>·</span>
              <span className="text-emerald-700 font-medium">Appointments Available This Week</span>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8D5CE] shadow-xs space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Service Fee</span>
                <span className="text-3xl font-serif text-stone-900 font-normal">
                  Rs. {service.price.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-stone-500">Payable at salon counter</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => openAppointmentModal(service)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white py-3.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                <Calendar className="w-4 h-4 text-[#C5A880]" />
                <span>Book This Appointment</span>
              </button>

              <a
                href={`https://wa.me/92${BUSINESS_INFO.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(`Hi Zoellas Beauty Salon! I'm interested in booking ${service.name} (Rs. ${service.price.toLocaleString()}). Could you share available slots?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-5 rounded-xl text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-normal text-stone-900">Treatment Description</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-normal text-stone-900">Key Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preparation & Aftercare Accordion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E8D5CE] space-y-1">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Before Your Visit</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{service.prep || 'Arrive 10 minutes before your scheduled appointment time.'}</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8D5CE] space-y-1">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Post-Care Protocol</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{service.aftercare || 'Follow stylist recommendations for sustained beauty results.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
