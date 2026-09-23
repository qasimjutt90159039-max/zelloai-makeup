import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  Calendar,
  Heart,
  ArrowRight
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useCart } from '../context/CartContext';

export const About: React.FC = () => {
  const { openAppointmentModal } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-[#FAF7F2]">
      
      {/* 1. Hero & Mission */}
      <section className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E8D5CE] shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#8C5D3D] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> About Zoellas Beauty Salon
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal leading-tight">
            Refined Salon Artistry & Care in Tariq Road, Karachi.
          </h1>
          <p className="text-stone-600 text-xs sm:text-base leading-relaxed">
            Welcome to <strong>Zoellas Beauty Salon</strong>, situated at 867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan. Our salon was created to bring premium personalized hair rituals, clinical skincare, Russian gel nail care, and bespoke bridal makeovers to Karachi.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#8C5D3D]" />
              <span>{BUSINESS_INFO.address}</span>
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
      </section>

      {/* 2. Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-[#E8D5CE] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#8C5D3D] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-normal text-stone-900">Personalized Consultations</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every styling session begins with an individualized hair and skin assessment to tailor formulations for your texture and occasion.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8D5CE] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#8C5D3D] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-normal text-stone-900">Hygiene & Sterilization</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We adhere to strict autoclaved tool sanitization protocols, disposable linens, and clinical hygiene standards for all clients.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8D5CE] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#8C5D3D] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-normal text-stone-900">Salon Tested Formulas</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All retail products and treatment elixirs are cruelty-free and curated directly by salon professionals for lasting results.
          </p>
        </div>
      </section>

      {/* 3. Salon Team Section (Explicitly marked as editable placeholder data per user constraints) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
            Dedicated Team
          </span>
          <h2 className="font-serif text-3xl font-normal text-stone-900">Our Artists & Stylists</h2>
          <p className="text-xs text-stone-500">
            [Editable placeholder structure: update with your official staff biographies and portraits]
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8D5CE] text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
              alt="Lead Stylist Placeholder"
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#8C5D3D]"
            />
            <div>
              <h3 className="font-serif text-lg font-normal text-stone-900">Lead Bridal Specialist</h3>
              <p className="text-xs text-[#8C5D3D] font-medium">Zoellas Atelier</p>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              [Staff bio placeholder: Specializes in modern South Asian bridal artistry, dupatta drapery, and dewy makeup.]
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8D5CE] text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
              alt="Senior Hair Stylist Placeholder"
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#8C5D3D]"
            />
            <div>
              <h3 className="font-serif text-lg font-normal text-stone-900">Master Hair Colorist</h3>
              <p className="text-xs text-[#8C5D3D] font-medium">Zoellas Hair Suite</p>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              [Staff bio placeholder: Specializes in balayage, organic nanokeratin smoothing, and precision cuts.]
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8D5CE] text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80"
              alt="Skin Aesthetician Placeholder"
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#8C5D3D]"
            />
            <div>
              <h3 className="font-serif text-lg font-normal text-stone-900">Skin Aesthetician</h3>
              <p className="text-xs text-[#8C5D3D] font-medium">Zoellas Derma Lounge</p>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              [Staff bio placeholder: Oversees clinical facial protocols, hydro-oxygen treatments, and skin prep.]
            </p>
          </div>
        </div>
      </section>

      {/* 4. Visit the Salon CTA */}
      <section className="bg-[#1A1A1A] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
            Tariq Road · Block 2 P.E.C.H.S., Karachi
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal">
            Ready to Experience Zoellas?
          </h3>
          <p className="text-xs text-stone-400 max-w-md">
            Schedule an appointment online or contact our reception team directly at 03111802834.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => openAppointmentModal()}
            className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#b0936b] text-stone-900 font-semibold text-xs rounded-xl uppercase tracking-wider transition-colors"
          >
            Book Appointment
          </button>
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </section>

    </div>
  );
};
