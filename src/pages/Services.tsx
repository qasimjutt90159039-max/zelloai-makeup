import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  Check, 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Service } from '../types';

export const Services: React.FC = () => {
  const { openAppointmentModal } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const list = await api.getServices();
        setServices(list);
      } catch (e) {
        console.error('Failed to load services', e);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const categories = [
    'All',
    'Hair',
    'Skin',
    'Makeup',
    'Nails',
    'Bridal',
    'Beauty Care',
    'Other Salon Services',
  ];

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-12 py-10 bg-[#FAF7F2]">
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8D5CE] shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#8C5D3D] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Zoellas Atelier Menu
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
              Salon Services & Rituals
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Explore our complete suite of hair cutting, organic smoothing, clinical facials, Russian gel manicures, and bespoke bridal packages at our Tariq Road studio in Karachi.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#8C5D3D]" />
                <span>867c Tariq Rd, Block 2 P.E.C.H.S., Karachi</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#8C5D3D]" />
                <a href={BUSINESS_INFO.phoneTel} className="font-medium hover:text-[#8C5D3D]">
                  {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-[#EFE8DC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-20 text-stone-500">Loading salon services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
            <h3 className="font-serif text-xl text-stone-800">No services found in this category</h3>
            <p className="text-xs text-stone-500 mt-1">Please select another category or call 03111802834 for custom requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group rounded-2xl bg-white border border-[#E8D5CE] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="aspect-16/10 relative overflow-hidden bg-stone-100">
                    <img
                      src={service.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80'}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-[#1A1A1A]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
                      {service.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-stone-500 text-xs mb-2">
                      <Clock className="w-3.5 h-3.5 text-[#8C5D3D]" />
                      <span>{service.duration}</span>
                    </div>

                    <Link to={`/services/${service.slug || service.id}`}>
                      <h3 className="font-serif text-xl font-normal text-stone-900 group-hover:text-[#8C5D3D] transition-colors">
                        {service.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-4 space-y-1.5 border-t border-stone-100 pt-3">
                      {service.benefits.slice(0, 3).map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between py-3 border-t border-stone-100">
                    <div>
                      <span className="text-xs text-stone-400 block -mb-0.5">Price</span>
                      <span className="text-base font-bold text-stone-900">
                        Rs. {service.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/services/${service.slug || service.id}`}
                        className="px-3 py-2 border border-stone-300 hover:border-stone-500 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        Details
                      </Link>

                      <button
                        onClick={() => openAppointmentModal(service)}
                        className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Book</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Bottom WhatsApp Inquiries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-[#EFE8DC]/60 rounded-2xl p-6 sm:p-8 border border-[#E8D5CE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg text-stone-900 font-normal">Need a Custom Hair or Bridal Consultation?</h4>
            <p className="text-xs text-stone-600 mt-1">Our senior artists are available on WhatsApp to answer inquiries and schedule private trials.</p>
          </div>
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp: {BUSINESS_INFO.phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
