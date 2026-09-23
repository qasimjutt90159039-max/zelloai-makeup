import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Printer, 
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Service } from '../types';

export const SalonMenu: React.FC = () => {
  const { openAppointmentModal } = useCart();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then((res) => setServices(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Hair', 'Skin', 'Makeup', 'Bridal', 'Nails', 'Beauty Care', 'Other Salon Services'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-[#E8D5CE] pb-8">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Zoellas Beauty Salon · Karachi
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-normal">
          Salon Service Menu & Price List
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan · Direct line: 03111802834
        </p>

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={() => openAppointmentModal()}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Menu</span>
          </button>
        </div>
      </div>

      {/* Menu Categories */}
      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading salon menu...</div>
      ) : (
        <div className="space-y-12">
          {categories.map((cat) => {
            const catServices = services.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
            if (catServices.length === 0) return null;

            return (
              <section key={cat} className="space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-stone-900 pb-2">
                  <h2 className="font-serif text-2xl font-normal text-stone-900 tracking-wide uppercase">
                    {cat} Rituals
                  </h2>
                  <span className="text-xs text-stone-400">({catServices.length} offerings)</span>
                </div>

                <div className="divide-y divide-[#E8D5CE]/70 bg-white rounded-2xl border border-[#E8D5CE] overflow-hidden shadow-xs">
                  {catServices.map((srv) => (
                    <div key={srv.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF7F2] transition-colors">
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <Link to={`/services/${srv.slug || srv.id}`} className="font-serif text-base font-medium text-stone-900 hover:text-[#8C5D3D]">
                            {srv.name}
                          </Link>
                          {srv.popular && (
                            <span className="text-[10px] bg-[#EFE8DC] text-[#8C5D3D] font-bold px-2 py-0.5 rounded-full uppercase">
                              Client Favorite
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed">{srv.description}</p>
                        <div className="flex items-center gap-1 text-[11px] text-stone-400 pt-0.5">
                          <Clock className="w-3 h-3 text-[#8C5D3D]" />
                          <span>Duration: {srv.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        <div className="text-left sm:text-right">
                          <span className="text-sm font-bold text-stone-900">
                            Rs. {srv.price.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => openAppointmentModal(srv)}
                          className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Footer Notes */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8D5CE] text-xs text-stone-600 space-y-2">
        <h4 className="font-semibold text-stone-900 uppercase tracking-wider">Salon Menu Policies:</h4>
        <p>• Prices include standard consultation, preparation, and styling amenities.</p>
        <p>• Bridal & event appointments require advance deposit to guarantee time reservations.</p>
        <p>• For group bookings, bridal party trials, or custom requests, kindly call 03111802834 or visit our salon on Tariq Road, Karachi.</p>
      </div>
    </div>
  );
};
