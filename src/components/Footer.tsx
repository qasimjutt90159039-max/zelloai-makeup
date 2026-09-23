import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Mail, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Heart,
  ArrowUpRight
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#161616] text-[#FAF7F2] border-t border-stone-800">
      {/* Trust & Highlights Bar */}
      <div className="border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Salon Grade Artistry</h4>
              <p className="text-xs text-stone-400 mt-0.5">Professional stylists, hair masters & makeup artists.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Fast Karachi Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Dispatched directly across Karachi & Pakistan nationwide.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">100% Authentic Products</h4>
              <p className="text-xs text-stone-400 mt-0.5">Cruelty-free botanical formulas & salon tested formulas.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Bespoke Bridal Care</h4>
              <p className="text-xs text-stone-400 mt-0.5">Barat, Walima, Nikkah & luxury celebration makeovers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="font-serif text-3xl font-normal tracking-wide text-white block">
                ZOELLAS
              </span>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium">
                Beauty Salon · Karachi
              </p>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Discover refined salon craftsmanship, bespoke hair and skin rituals, and premium beauty products right in the heart of Tariq Road, Block 2 P.E.C.H.S., Karachi.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href={BUSINESS_INFO.phoneTel} className="hover:text-white transition-colors">
                  {BUSINESS_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span className="text-stone-400">{BUSINESS_INFO.hoursNotice}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span className="text-stone-400">{BUSINESS_INFO.emailNotice}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Salon Services */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-4">
              Salon Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Hair Styling & Cuts</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Organic Keratin Treatment</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Hydro-Oxygen Facial</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Barat & Bridal Packages</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Russian Gel Manicures</Link>
              </li>
              <li>
                <Link to="/salon-menu" className="text-[#C5A880] hover:underline flex items-center gap-1 font-medium">
                  View Full Salon Menu <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Boutique Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-4">
              Beauty Store
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/shop?category=Hair+Care" className="hover:text-white transition-colors">Hair Care</Link>
              </li>
              <li>
                <Link to="/shop?category=Skin+Care" className="hover:text-white transition-colors">Skin Care</Link>
              </li>
              <li>
                <Link to="/shop?category=Makeup" className="hover:text-white transition-colors">Luxury Cosmetics</Link>
              </li>
              <li>
                <Link to="/shop?category=Nail+Care" className="hover:text-white transition-colors">Nail Polishes & Kits</Link>
              </li>
              <li>
                <Link to="/shop?category=Beauty+Tools" className="hover:text-white transition-colors">Professional Brushes</Link>
              </li>
              <li>
                <Link to="/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link>
              </li>
              <li>
                <Link to="/offers" className="text-[#C5A880] hover:underline flex items-center gap-1 font-medium">
                  Exclusive Packages <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-4">
              Information & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Zoellas</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">Salon Photo Gallery</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">Beauty Tips & Editorial</Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition-colors">Client Testimonials</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">FAQs & Directions</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">Cancellation & Refunds</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer & Copyright */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8 bg-black/40 text-[11px] text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Zoellas Beauty Salon. 867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan.
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Contact: 03111802834</span>
            <span>·</span>
            <span>Karachi, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
