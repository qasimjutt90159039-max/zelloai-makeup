import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Heart, Calendar, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useCart } from '../context/CartContext';

export const OurStory: React.FC = () => {
  const { openAppointmentModal } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Heritage & Vision
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          The Story of Zoellas
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
          Founded in the lively beauty and commercial district of Tariq Road, Karachi.
        </p>
      </div>

      {/* Narrative Section 1 */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs space-y-6">
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            At <strong>Zoellas Beauty Salon</strong>, we believe beauty rituals are not merely about aesthetics — they are personal moments of restoration, confidence, and self-care. Situated at <strong>867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi</strong>, our studio was created to offer an oasis from the bustling city rhythm.
          </p>

          <p>
            Every space in our atelier is designed with intention: gentle warm lighting, comfortable styling chairs, quiet private facial booths, and dedicated stations for dry Russian manicures and bridal artistry.
          </p>
        </div>

        <div className="aspect-16/9 rounded-2xl overflow-hidden shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1200&q=80"
            alt="Zoellas Salon Interior Tariq Road"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed pt-2">
          <h2 className="font-serif text-2xl text-stone-900 font-normal">
            Our Philosophy: Care, Chemistry & Craft
          </h2>
          <p>
            We combine high-performance organic ingredients with precision styling techniques. Whether it is formulating a formaldehyde-free keratin blend to shield hair from Karachi's coastal humidity, or applying pure hyaluronic serums in clinical facials, our craft is rooted in scientific care and gentle beauty.
          </p>
          <p>
            For brides on their Barat, Walima, and Nikkah celebrations, we take time to understand their vision, outfit tones, jewelry weight, and skin preferences — delivering enduring glam that lasts effortlessly through tears, photography, and festivities.
          </p>
        </div>
      </div>

      {/* Location and Contact Summary */}
      <div className="p-6 rounded-2xl bg-[#EFE8DC]/70 border border-[#E8D5CE] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-lg text-stone-900">Visit Our Atelier</h3>
          <p className="text-xs text-stone-600">867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi · Phone: 03111802834</p>
        </div>

        <button
          onClick={() => openAppointmentModal()}
          className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
        >
          Book Your Visit
        </button>
      </div>
    </div>
  );
};
