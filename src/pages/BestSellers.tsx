import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Product, Service } from '../types';

export const BestSellers: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, openAppointmentModal } = useCart();
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [bestServices, setBestServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, srvs] = await Promise.all([
          api.getProducts({ bestSeller: true }),
          api.getServices({ popular: true }),
        ]);
        setBestProducts(prods);
        setBestServices(srvs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Customer Favorites
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Zoellas Best Sellers
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          The most requested treatments and top-reviewed beauty products loved by clients across Karachi.
        </p>
      </div>

      {/* 1. Best-Selling Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8D5CE] pb-3">
          <div>
            <h2 className="font-serif text-2xl font-normal text-stone-900">Most Loved Beauty Products</h2>
            <p className="text-xs text-stone-500">Formulated for salon results at home</p>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-[#8C5D3D] hover:underline flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-stone-500">Loading best sellers...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestProducts.map((p) => {
              const inWish = isInWishlist(p.id);
              const effectivePrice = p.discountPrice || p.price;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#E8D5CE] p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                >
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 shadow-xs hover:bg-white text-stone-600"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div>
                    <Link to={`/product/${p.slug || p.id}`} className="block overflow-hidden rounded-xl bg-[#FAF7F2] mb-3">
                      <img
                        src={p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </Link>
                    <span className="text-[10px] uppercase text-[#8C5D3D] font-medium">{p.category}</span>
                    <Link to={`/product/${p.slug || p.id}`}>
                      <h3 className="text-sm font-semibold text-stone-900 mt-1 line-clamp-1 hover:text-[#8C5D3D]">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-amber-500 text-xs mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-stone-800">{p.rating.toFixed(1)}</span>
                      <span className="text-stone-400">({p.reviews})</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-stone-900">
                        Rs. {effectivePrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Most Requested Salon Rituals */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8D5CE] pb-3">
          <div>
            <h2 className="font-serif text-2xl font-normal text-stone-900">Trending In-Salon Treatments</h2>
            <p className="text-xs text-stone-500">Booked daily at our Tariq Road studio</p>
          </div>
          <Link to="/services" className="text-xs font-semibold text-[#8C5D3D] hover:underline flex items-center gap-1">
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-[#E8D5CE] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden">
                  <img
                    src={srv.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80'}
                    alt={srv.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#8C5D3D] uppercase tracking-wider">{srv.category}</span>
                    <span className="text-xs text-stone-400">{srv.duration}</span>
                  </div>
                  <Link to={`/services/${srv.slug || srv.id}`}>
                    <h3 className="font-serif text-lg font-normal text-stone-900 hover:text-[#8C5D3D]">{srv.name}</h3>
                  </Link>
                  <p className="text-xs text-stone-500 line-clamp-2">{srv.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between py-3 border-t border-stone-100">
                  <span className="text-sm font-bold text-stone-900">
                    Rs. {srv.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => openAppointmentModal(srv)}
                    className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-[#C5A880]" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
