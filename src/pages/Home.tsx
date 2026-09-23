import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Heart, 
  Check, 
  MessageCircle, 
  Phone,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Product, Service, Offer, Review } from '../types';

export const Home: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, openAppointmentModal } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prods, srvs, offrs, revs] = await Promise.all([
          api.getProducts({ featured: true }),
          api.getServices({ featured: true }),
          api.getOffers(),
          api.getReviews(),
        ]);
        setFeaturedProducts(prods.slice(0, 4));
        setFeaturedServices(srvs.slice(0, 4));
        setOffers(offrs.slice(0, 3));
        setReviews(revs.slice(0, 3));
      } catch (e) {
        console.error('Failed to load home data', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const serviceCategories = [
    {
      name: 'Hair Care & Keratin',
      tagline: 'Precision Cuts, Organic Keratin & Balayage',
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
      category: 'Hair',
    },
    {
      name: 'Clinical Skin & Facials',
      tagline: 'Signature Hydro-Oxygen & 24K Gold Cellular',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      category: 'Skin',
    },
    {
      name: 'Royal Bridal & Barat',
      tagline: 'HD Bridal Makeovers, Dupatta & Jewelry Setting',
      image: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80',
      category: 'Bridal',
    },
    {
      name: 'Russian Gel Nails',
      tagline: 'Dry E-File Cuticle Prep & Sculpted Gel-X',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      category: 'Nails',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 bg-[#FAF7F2]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE4] to-[#FAF7F2] border-b border-[#E8D5CE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE8DC] border border-[#C5A880]/30 text-xs font-semibold text-[#8C5D3D] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#8C5D3D]" />
                <span>Premier Salon & Cosmetics · Karachi</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.15] font-normal">
                Beauty, Confidence & Care — <br className="hidden sm:inline" />
                <span className="italic text-[#8C5D3D]">All in One Place.</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Step into Zoellas Beauty Salon on Tariq Road, Block 2 P.E.C.H.S., Karachi. Experience bespoke hair artistry, clinical glass-skin facials, Russian gel manicures, and salon-grade cosmetics.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  id="hero-book-btn"
                  onClick={() => openAppointmentModal()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white px-7 py-3.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>Book Salon Appointment</span>
                </button>

                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 px-7 py-3.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#8C5D3D]" />
                  <span>Shop Salon Products</span>
                </Link>
              </div>

              {/* Real Business Address Banner */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-stone-500 border-t border-stone-200/80">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#8C5D3D] shrink-0" />
                  <span>867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi</span>
                </div>
                <span className="hidden sm:inline text-stone-300">·</span>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#8C5D3D] shrink-0" />
                  <a href={BUSINESS_INFO.phoneTel} className="font-semibold text-stone-800 hover:text-[#8C5D3D]">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1000&q=80"
                    alt="Zoellas Beauty Salon Styling Station"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#E8D5CE] max-w-xs hidden sm:flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8D5CE] flex items-center justify-center text-[#8C5D3D]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Karachi Salon Atelier</div>
                    <div className="text-[11px] text-stone-500">Tariq Rd, Block 2 P.E.C.H.S.</div>
                    <div className="text-[10px] text-[#8C5D3D] font-medium mt-0.5">Call: 03111802834</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SALON SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
            Crafted for Perfection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-2 font-normal">
            Signature Salon Rituals
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            From bridal couture makeovers to restorative keratin and Russian gel nail extensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((sc) => (
            <Link
              key={sc.name}
              to={`/services?category=${sc.category}`}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-[#E8D5CE]"
            >
              <div className="aspect-3/4 overflow-hidden relative">
                <img
                  src={sc.image}
                  alt={sc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">
                    {sc.category} Collection
                  </span>
                  <h3 className="font-serif text-xl font-normal text-white mt-1 group-hover:text-[#FAF7F2] transition-colors">
                    {sc.name}
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                    {sc.tagline}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-[#C5A880] font-medium group-hover:underline">
                    <span>Explore Rituals</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/salon-menu"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C5D3D] hover:text-stone-900 transition-colors uppercase tracking-wider"
          >
            <span>View Complete Salon Menu & Price List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. FEATURED BOUTIQUE PRODUCTS */}
      <section className="bg-white py-16 border-y border-[#E8D5CE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
                Salon Tested Formulations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1 font-normal">
                Curated Beauty Essentials
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C5D3D] hover:text-stone-900 uppercase tracking-wider"
            >
              <span>View All 40+ Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const inWish = isInWishlist(p.id);
              return (
                <div
                  key={p.id}
                  className="group rounded-2xl bg-[#FAF7F2] border border-[#E8D5CE] p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                >
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 shadow-xs hover:bg-white text-stone-600 transition-colors"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div>
                    <Link to={`/product/${p.slug || p.id}`} className="block overflow-hidden rounded-xl bg-white mb-3">
                      <img
                        src={p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </Link>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C5D3D] font-medium">
                      {p.category}
                    </span>
                    <Link to={`/product/${p.slug || p.id}`}>
                      <h3 className="text-sm font-semibold text-stone-900 mt-1 line-clamp-1 hover:text-[#8C5D3D] transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-amber-500 text-xs mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-stone-800">{p.rating.toFixed(1)}</span>
                      <span className="text-stone-400">({p.reviews})</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 mt-4 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-stone-900">
                        Rs. {(p.discountPrice || p.price).toLocaleString()}
                      </span>
                      {p.discountPrice && (
                        <span className="text-xs text-stone-400 line-through block -mt-1">
                          Rs. {p.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PROMOTIONAL PACKAGES & OFFERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
            Special Deals
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1 font-normal">
            Salon Packages & Combinations
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Carefully curated treatment combos at exclusive seasonal rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl bg-white border border-[#E8D5CE] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
            >
              <div>
                <div className="aspect-16/9 relative overflow-hidden">
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
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-normal text-stone-900">{offer.title}</h3>
                  <p className="text-xs text-stone-600 mt-1.5">{offer.description}</p>
                  
                  <div className="mt-4 space-y-1.5 text-xs text-stone-700">
                    {offer.includedServices.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between py-3 border-t border-stone-100">
                  <div>
                    <span className="text-xs text-stone-400 line-through block">
                      Rs. {offer.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-base font-bold text-stone-900">
                      Rs. {offer.offerPrice.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => openAppointmentModal()}
                    className="px-4 py-2 bg-[#8C5D3D] hover:bg-[#72482E] text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Reserve Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LOCATION & BOOKING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#1A1A1A] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                Visit Zoellas Beauty Salon
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
                Experience Luxury Care in Tariq Road, Karachi
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md">
                Located right near Tariq Center in Block 2 P.E.C.H.S., our salon offers a serene private sanctuary for all your styling, hair treatments, facials, and wedding preparation.
              </p>

              <div className="space-y-2 text-xs text-stone-300 pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <a href={BUSINESS_INFO.phoneTel} className="hover:text-[#C5A880] transition-colors font-medium">
                    Call: {BUSINESS_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span className="text-stone-400">{BUSINESS_INFO.hoursNotice}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => openAppointmentModal()}
                  className="bg-[#C5A880] hover:bg-[#b0936b] text-stone-900 font-semibold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
                >
                  Book Appointment
                </button>

                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp 03111802834</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Maps view */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-72 sm:h-80 shadow-lg">
              <iframe
                title="Zoellas Beauty Salon Tariq Road Karachi Map"
                src={BUSINESS_INFO.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1 font-normal">
            Loved by Karachi Clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-[#E8D5CE] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4">
                <h4 className="text-xs font-semibold text-stone-900">{rev.userName}</h4>
                <p className="text-[11px] text-[#8C5D3D]">{rev.userCity || 'Karachi'} · {rev.targetName}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
