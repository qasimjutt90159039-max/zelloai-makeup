import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShoppingBag, Calendar } from 'lucide-react';

export const Categories: React.FC = () => {
  const productCategories = [
    {
      name: 'Hair Care',
      description: 'Strengthening organic shampoos, keratin masks, argan oils, and scalping elixirs.',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
      count: '8 Products',
      path: '/shop?category=Hair+Care',
    },
    {
      name: 'Skin Care',
      description: 'Vitamin C radiance serums, deep-hydration hyaluronic creams, and gentle cleansers.',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      count: '9 Products',
      path: '/shop?category=Skin+Care',
    },
    {
      name: 'Makeup',
      description: 'Luminous liquid foundations, velvety matte lip pigments, and setting powders.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      count: '7 Products',
      path: '/shop?category=Makeup',
    },
    {
      name: 'Nail Care',
      description: 'Strengthening cuticle oils, peel-off bases, and high-shine gel polishes.',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      count: '5 Products',
      path: '/shop?category=Nail+Care',
    },
    {
      name: 'Beauty Tools',
      description: 'Ultra-soft vegan makeup brushes, rose quartz face rollers, and sectioning clips.',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
      count: '4 Products',
      path: '/shop?category=Beauty+Tools',
    },
    {
      name: 'Body Care',
      description: 'Exfoliating rose sugar scrubs, hydrating shea soufflés, and body mists.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      count: '4 Products',
      path: '/shop?category=Body+Care',
    },
    {
      name: 'Salon Essentials',
      description: 'Professional color bowls, microfiber salon wraps, and precision spatulas.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      count: '3 Products',
      path: '/shop?category=Salon+Essentials',
    },
  ];

  const serviceCategories = [
    {
      name: 'Hair Services',
      description: 'Balayage coloring, organic nanokeratin smoothing, haircut restyling, and blowouts.',
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
      path: '/services?category=Hair',
    },
    {
      name: 'Skin & Facial Rituals',
      description: 'Hydro-oxygen glass skin facials, 24K cellular renewal, and deep pore cleansing.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      path: '/services?category=Skin',
    },
    {
      name: 'Bridal & Barat Makeovers',
      description: 'Complete royal barat, walima, and nikah transformations with dupatta setting.',
      image: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80',
      path: '/services?category=Bridal',
    },
    {
      name: 'Russian Gel Nails',
      description: 'Dry e-file manicure, sculpted gel extensions, French tips, and luxury pedicure.',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      path: '/services?category=Nails',
    },
    {
      name: 'Makeup Artistry',
      description: 'HD party makeup, evening reception styling, and airbrush glam.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      path: '/services?category=Makeup',
    },
    {
      name: 'Beauty Care & Grooming',
      description: 'Full body waxing, herbal threading, henna artistry, and eyelash lifting.',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
      path: '/services?category=Beauty+Care',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Discover Zoellas
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Explore All Categories
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Browse our boutique retail products and in-salon beauty treatments designed for your distinct care needs.
        </p>
      </div>

      {/* 1. Retail Product Collections */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8D5CE] pb-3">
          <div>
            <h2 className="font-serif text-2xl font-normal text-stone-900">Boutique Beauty Collections</h2>
            <p className="text-xs text-stone-500">Formulated for salon perfection at home</p>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-[#8C5D3D] hover:underline flex items-center gap-1">
            <span>Shop All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productCategories.map((c) => (
            <Link
              key={c.name}
              to={c.path}
              className="group bg-white rounded-2xl border border-[#E8D5CE] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden relative">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-stone-800 px-2 py-0.5 rounded-md">
                    {c.count}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-normal text-stone-900 group-hover:text-[#8C5D3D] transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-0">
                <span className="text-xs font-semibold text-[#8C5D3D] flex items-center gap-1 group-hover:underline">
                  Browse Collection <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Salon Treatment Services */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8D5CE] pb-3">
          <div>
            <h2 className="font-serif text-2xl font-normal text-stone-900">Salon Treatment Services</h2>
            <p className="text-xs text-stone-500">Performed by master stylists at our Tariq Road studio</p>
          </div>
          <Link to="/services" className="text-xs font-semibold text-[#8C5D3D] hover:underline flex items-center gap-1">
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((s) => (
            <Link
              key={s.name}
              to={s.path}
              className="group bg-white rounded-2xl border border-[#E8D5CE] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-normal text-stone-900 group-hover:text-[#8C5D3D] transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {s.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-0">
                <span className="text-xs font-semibold text-[#8C5D3D] flex items-center gap-1 group-hover:underline">
                  Book This Service <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
