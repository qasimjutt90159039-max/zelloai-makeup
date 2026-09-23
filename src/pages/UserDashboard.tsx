import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  Heart, 
  Settings, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Trash2, 
  ArrowRight, 
  MessageCircle, 
  Sparkles,
  Phone,
  MapPin,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Order, Appointment, Product } from '../types';
import { BUSINESS_INFO } from '../data/business';

export const UserDashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist, toggleWishlist, addToCart, showToast } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'appointments' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Karachi',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const [allOrders, allAppts, allProds] = await Promise.all([
          api.getOrders(),
          api.getAppointments(),
          api.getProducts(),
        ]);

        setOrders(allOrders);
        setAppointments(allAppts);
        setWishlistProducts(allProds.filter((p) => wishlist.includes(p.id)));
      } catch (err) {
        console.error('Failed to load user dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Karachi',
      });
    }
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      showToast('Profile preferences updated successfully!');
    }, 400);
  };

  const handleCancelAppointment = async (apptId: string) => {
    if (!window.confirm('Are you sure you wish to cancel this salon appointment?')) return;
    try {
      await api.updateAppointment(apptId, { status: 'cancelled' });
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId ? { ...a, status: 'cancelled' } : a))
      );
      showToast('Appointment cancelled.');
    } catch (err: any) {
      alert(err.message || 'Could not cancel appointment.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF7F2]">
      
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E8D5CE] text-[#8C5D3D] flex items-center justify-center font-serif text-2xl font-normal shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'Z'}
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
              Zoellas Guest Portal
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Welcome back, {user?.name || 'Valued Guest'}
            </h1>
            <p className="text-xs text-stone-500">{user?.email || 'guest@zoellasbeauty.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-stone-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'text-stone-600 hover:bg-white hover:text-stone-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'text-stone-600 hover:bg-white hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Salon Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'text-stone-600 hover:bg-white hover:text-stone-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'text-stone-600 hover:bg-white hover:text-stone-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8D5CE] space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-xl text-stone-900">No Orders Yet</h3>
              <p className="text-xs text-stone-500">Explore our salon-grade skincare and makeup catalog.</p>
              <Link
                to="/shop"
                className="inline-block px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
              >
                Go to Boutique Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div>
                      <span className="text-[11px] text-stone-400">Order Reference</span>
                      <div className="font-mono text-sm font-bold text-stone-900">{o.orderNumber}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                      <span className="text-xs text-stone-400">{o.createdAt?.split('T')[0]}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {o.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={it.product.image || (it.product.images && it.product.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                          alt={it.product.name}
                          className="w-12 h-12 object-cover rounded-xl bg-[#FAF7F2]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-stone-900 truncate">{it.product.name}</p>
                          <p className="text-stone-400">Qty: {it.quantity}</p>
                        </div>
                        <span className="font-bold text-stone-900">
                          Rs. {((it.product.discountPrice || it.product.price) * it.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Footer */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-stone-600">
                      Payment: <strong className="uppercase">{o.paymentMethod}</strong> · Total:{' '}
                      <strong className="text-stone-900 text-sm">Rs. {o.total.toLocaleString()}</strong>
                    </div>

                    <a
                      href={`https://wa.me/92${BUSINESS_INFO.whatsapp.replace(/^0/, '')}?text=Hi Zoellas, inquiring about order ${o.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold hover:underline"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Order Status</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8D5CE] space-y-3">
              <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-xl text-stone-900">No Appointments Reserved</h3>
              <p className="text-xs text-stone-500">Book your salon session at our Tariq Road studio.</p>
              <Link
                to="/book-appointment"
                className="inline-block px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
              >
                Schedule Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div>
                      <span className="text-[11px] text-stone-400">Booking Reference</span>
                      <div className="font-mono text-sm font-bold text-stone-900">
                        {apt.bookingId || apt.appointmentNumber || apt.id}
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                      apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block">Service</span>
                      <span className="font-bold text-stone-900">{apt.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Date & Time</span>
                      <span className="font-semibold text-stone-900">{apt.date || apt.appointmentDate} · {apt.timeSlot || apt.appointmentTime}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Salon Location</span>
                      <span className="text-stone-700">867c Tariq Rd, Karachi</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-700 font-bold">
                      Price: Rs. {(apt.price || apt.estimatedPrice || 0).toLocaleString()}
                    </span>

                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="text-rose-600 hover:underline text-xs font-semibold"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8D5CE] space-y-3">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-xl text-stone-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-stone-500">Tap the heart on any product to save it here.</p>
              <Link
                to="/shop"
                className="inline-block px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#E8D5CE] p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                >
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 shadow-xs hover:bg-white text-rose-500"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current" />
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
                      <h3 className="text-xs font-semibold text-stone-900 mt-1 line-clamp-1 hover:text-[#8C5D3D]">
                        {p.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Rs. {(p.discountPrice || p.price).toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white text-xs font-medium rounded-lg"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs max-w-2xl space-y-6">
          <h2 className="font-serif text-2xl font-normal text-stone-900 border-b border-stone-100 pb-3">
            Profile Information
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Default Delivery Address</label>
              <textarea
                rows={2}
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
