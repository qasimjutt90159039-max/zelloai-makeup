import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Package, 
  ShoppingBag, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Search, 
  X, 
  Save, 
  Sparkles,
  Phone,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Product, Order, Appointment, Review } from '../types';
import { BUSINESS_INFO } from '../data/business';

const PRODUCT_CATEGORIES = [
  'Hair Care',
  'Skin Care',
  'Makeup',
  'Nail Care',
  'Beauty Tools',
  'Body Care',
  'Salon Essentials',
];

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, switchDemoUser } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState<'kpi' | 'products' | 'orders' | 'appointments' | 'reviews'>('kpi');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Search Filter
  const [searchTerm, setSearchTerm] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [p, o, a, r] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getAppointments(),
        api.getReviews(),
      ]);
      setProducts(p);
      setOrders(o);
      setAppointments(a);
      setReviews(r);
    } catch (err) {
      console.error('Failed loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Stats
  const totalSales = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalPendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalUpcomingAppointments = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length;

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      showToast(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  // Appointment status update
  const handleUpdateAppointmentStatus = async (apptId: string, newStatus: Appointment['status']) => {
    try {
      await api.updateAppointment(apptId, { status: newStatus });
      setAppointments((prev) => prev.map((a) => (a.id === apptId ? { ...a, status: newStatus } : a)));
      showToast(`Appointment status updated to ${newStatus}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update appointment');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the salon catalog?')) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product removed from catalog.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Save product modal
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    try {
      if (editingProduct.id) {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast('Product updated successfully.');
      } else {
        const created = await api.createProduct({
          ...editingProduct,
          slug: editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          rating: 5.0,
          reviews: 0,
          images: [editingProduct.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'],
          brand: editingProduct.brand || 'Zoellas Atelier',
        } as any);
        setProducts((prev) => [created, ...prev]);
        showToast('New product added to boutique shop.');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 bg-[#FAF7F2]">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl text-stone-900">Salon Administrator Access Required</h2>
        <p className="text-xs text-stone-500">
          Sign in as the salon management administrator to access real-time bookings and store inventory.
        </p>
        <button
          onClick={() => switchDemoUser('admin')}
          className="px-6 py-2.5 bg-[#8C5D3D] text-white text-xs font-semibold rounded-xl uppercase tracking-wider shadow-sm hover:bg-[#72482E]"
        >
          Sign In as Salon Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF7F2]">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-[#C5A880] text-[10px] font-bold uppercase tracking-wider">
              Management Portal
            </span>
            <span className="text-xs text-stone-400">Tariq Road Studio · Karachi</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-stone-900 mt-1">
            Zoellas Salon Operations
          </h1>
          <p className="text-xs text-stone-500">
            Live management of appointments, client orders, product stock, and verified reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingProduct({
                name: '',
                category: 'Hair Care',
                price: 2500,
                stock: 20,
                description: '',
                image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
              });
              setIsProductModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C5A880]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'kpi' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-stone-600 hover:bg-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Operations KPI</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'appointments' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-stone-600 hover:bg-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-stone-600 hover:bg-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>E-Commerce Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'products' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-stone-600 hover:bg-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'reviews' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-stone-600 hover:bg-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Client Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Tab 1: KPI Stats */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Online Revenue</span>
              <div className="font-serif text-3xl font-normal text-stone-900">
                Rs. {totalSales.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600">From {orders.length} retail store orders</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Salon Appointments</span>
              <div className="font-serif text-3xl font-normal text-stone-900">
                {appointments.length}
              </div>
              <p className="text-[11px] text-[#8C5D3D]">{totalUpcomingAppointments} pending or confirmed</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Active Catalog Items</span>
              <div className="font-serif text-3xl font-normal text-stone-900">
                {products.length}
              </div>
              <p className="text-[11px] text-stone-400">Across 7 product categories</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Client Feedback</span>
              <div className="font-serif text-3xl font-normal text-stone-900">
                {reviews.length}
              </div>
              <p className="text-[11px] text-amber-600">Average 4.9 ★ rating</p>
            </div>
          </div>

          {/* Quick Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-normal text-stone-900">Recent Salon Bookings</h3>
              <div className="space-y-3">
                {appointments.slice(0, 4).map((apt) => (
                  <div key={apt.id} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8D5CE] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{apt.customerName || apt.clientName}</p>
                      <p className="text-stone-500">{apt.serviceName} · {apt.date || apt.appointmentDate} at {apt.timeSlot || apt.appointmentTime}</p>
                    </div>
                    <span className="font-semibold text-stone-900">
                      Rs. {(apt.price || apt.estimatedPrice || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-normal text-stone-900">Recent Store Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8D5CE] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{o.orderNumber} · {o.shippingAddress?.fullName}</p>
                      <p className="text-stone-500">{o.items?.length || 1} items · {o.shippingAddress?.city}</p>
                    </div>
                    <span className="font-semibold text-stone-900">Rs. {o.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-4">
          <h2 className="font-serif text-xl font-normal text-stone-900">Salon Bookings Roster</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {appointments.map((a) => {
                  const clientPhone = a.phone || a.clientPhone || '03111802834';
                  return (
                    <tr key={a.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-stone-900">{a.bookingId || a.id}</td>
                      <td className="p-3">
                        <span className="font-semibold text-stone-900 block">{a.customerName || a.clientName}</span>
                        <span className="text-stone-400">{clientPhone}</span>
                      </td>
                      <td className="p-3 text-stone-800">{a.serviceName}</td>
                      <td className="p-3 text-stone-600">{a.date || a.appointmentDate} · {a.timeSlot || a.appointmentTime}</td>
                      <td className="p-3 font-semibold text-stone-900">Rs. {(a.price || a.estimatedPrice || 0).toLocaleString()}</td>
                      <td className="p-3">
                        <select
                          value={a.status}
                          onChange={(e) => handleUpdateAppointmentStatus(a.id, e.target.value as any)}
                          className="text-xs p-1.5 rounded-lg border border-stone-300 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <a
                          href={`https://wa.me/92${clientPhone.replace(/^0/, '')}?text=Hello from Zoellas Beauty Salon regarding your booking #${a.bookingId || a.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#25D366] font-semibold hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-4">
          <h2 className="font-serif text-xl font-normal text-stone-900">Store Orders</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Delivery Address</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                    <td className="p-3">
                      <span className="font-semibold text-stone-900 block">{o.shippingAddress?.fullName}</span>
                      <span className="text-stone-400">{o.shippingAddress?.phone}</span>
                    </td>
                    <td className="p-3 text-stone-600 max-w-xs truncate">{o.shippingAddress?.address}, {o.shippingAddress?.city}</td>
                    <td className="p-3 font-semibold text-stone-900">Rs. {o.total.toLocaleString()}</td>
                    <td className="p-3 uppercase text-stone-700">{o.paymentMethod}</td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                        className="text-xs p-1.5 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <a
                        href={`https://wa.me/92${(o.shippingAddress?.phone || '').replace(/^0/, '')}?text=Hello from Zoellas Beauty Salon regarding your order ${o.orderNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#25D366] font-semibold hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-serif text-xl font-normal text-stone-900">Boutique Catalog Inventory</h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-[#FAF7F2]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">In Stock</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products
                  .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg bg-[#FAF7F2]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <span className="font-semibold text-stone-900">{p.name}</span>
                      </td>
                      <td className="p-3 text-stone-600">{p.category}</td>
                      <td className="p-3 font-semibold text-stone-900">Rs. {p.price.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3 text-stone-700">{p.rating.toFixed(1)} ★ ({p.reviews})</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs space-y-4">
          <h2 className="font-serif text-xl font-normal text-stone-900">Verified Client Reviews</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D5CE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{r.userName}</span>
                    <span className="text-stone-400">({r.userCity || 'Karachi'})</span>
                    <span className="text-amber-500 font-bold">{r.rating} ★</span>
                  </div>
                  <p className="text-stone-700 italic">"{r.comment}"</p>
                  <p className="text-[10px] text-[#8C5D3D]">For: {r.targetName}</p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm('Delete this review?')) {
                      await api.deleteReview(r.id);
                      setReviews((prev) => prev.filter((item) => item.id !== r.id));
                      showToast('Review removed.');
                    }
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                  title="Remove review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E8D5CE]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-2xl font-normal text-stone-900">
                {editingProduct?.id ? 'Edit Product' : 'Add New Salon Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Botanical Moisture Elixir"
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingProduct?.category || 'Hair Care'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct?.brand || 'Zoellas Atelier'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    value={editingProduct?.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={editingProduct?.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="e.g. 2900"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct?.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct?.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Describe texture, salon benefits, and active botanicals..."
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl font-semibold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
