import { 
  Product, 
  Service,
  Offer,
  BlogPost,
  Order, 
  Appointment, 
  Review, 
  User, 
  AdminStats 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SERVICES,
  INITIAL_OFFERS,
  INITIAL_BLOG_POSTS,
  INITIAL_REVIEWS, 
  INITIAL_USERS, 
  INITIAL_ORDERS, 
  INITIAL_APPOINTMENTS 
} from '../data/initialData';

const API_BASE = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('zbs_auth_token') || localStorage.getItem('hf_auth_token');
}

async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // PRODUCTS
  async getProducts(params: {
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
    maxPrice?: number;
    inStockOnly?: boolean;
    featured?: boolean;
    bestSeller?: boolean;
  } = {}): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set('category', params.category);
      if (params.brand) searchParams.set('brand', params.brand);
      if (params.search) searchParams.set('search', params.search);
      if (params.sort) searchParams.set('sort', params.sort);
      if (params.maxPrice) searchParams.set('maxPrice', String(params.maxPrice));
      if (params.inStockOnly) searchParams.set('inStockOnly', 'true');
      if (params.featured) searchParams.set('featured', 'true');
      if (params.bestSeller) searchParams.set('bestSeller', 'true');

      const queryString = searchParams.toString();
      return await fetchJSON<Product[]>(`${API_BASE}/products${queryString ? `?${queryString}` : ''}`);
    } catch (err) {
      console.warn('API fetch failed, falling back to local dataset', err);
      let list = [...INITIAL_PRODUCTS];
      if (params.category && params.category !== 'All') {
        list = list.filter((p) => p.category === params.category);
      }
      if (params.brand && params.brand !== 'All') {
        list = list.filter((p) => p.brand === params.brand);
      }
      if (params.featured) {
        list = list.filter((p) => p.featured);
      }
      if (params.bestSeller) {
        list = list.filter((p) => p.bestSeller || p.isBestSeller);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      return list;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      return await fetchJSON<Product>(`${API_BASE}/products/${id}`);
    } catch {
      const found = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
      if (!found) throw new Error('Product not found');
      return found;
    }
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return fetchJSON<Product>(`${API_BASE}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return fetchJSON<Product>(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
  },

  // SERVICES
  async getServices(params: {
    category?: string;
    featured?: boolean;
    popular?: boolean;
    search?: string;
  } = {}): Promise<Service[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set('category', params.category);
      if (params.featured) searchParams.set('featured', 'true');
      if (params.popular) searchParams.set('popular', 'true');
      if (params.search) searchParams.set('search', params.search);

      const queryString = searchParams.toString();
      return await fetchJSON<Service[]>(`${API_BASE}/services${queryString ? `?${queryString}` : ''}`);
    } catch (err) {
      console.warn('API services fetch failed, using fallback', err);
      let list = [...INITIAL_SERVICES];
      if (params.category && params.category !== 'All') {
        list = list.filter((s) => s.category.toLowerCase() === params.category?.toLowerCase());
      }
      return list;
    }
  },

  async getServiceById(id: string): Promise<Service> {
    try {
      return await fetchJSON<Service>(`${API_BASE}/services/${id}`);
    } catch {
      const found = INITIAL_SERVICES.find((s) => s.id === id || s.slug === id);
      if (!found) throw new Error('Service not found');
      return found;
    }
  },

  async createService(data: Partial<Service>): Promise<Service> {
    return fetchJSON<Service>(`${API_BASE}/services`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    return fetchJSON<Service>(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteService(id: string): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
    });
  },

  // OFFERS
  async getOffers(): Promise<Offer[]> {
    try {
      return await fetchJSON<Offer[]>(`${API_BASE}/offers`);
    } catch {
      return INITIAL_OFFERS;
    }
  },

  async getOfferById(id: string): Promise<Offer> {
    try {
      return await fetchJSON<Offer>(`${API_BASE}/offers/${id}`);
    } catch {
      const found = INITIAL_OFFERS.find((o) => o.id === id || o.slug === id);
      if (!found) throw new Error('Offer not found');
      return found;
    }
  },

  // BLOG
  async getBlogPosts(params: { category?: string; search?: string } = {}): Promise<BlogPost[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set('category', params.category);
      if (params.search) searchParams.set('search', params.search);
      const q = searchParams.toString();
      return await fetchJSON<BlogPost[]>(`${API_BASE}/blog${q ? `?${q}` : ''}`);
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  },

  async getBlogPostById(id: string): Promise<BlogPost> {
    try {
      return await fetchJSON<BlogPost>(`${API_BASE}/blog/${id}`);
    } catch {
      const found = INITIAL_BLOG_POSTS.find((b) => b.id === id || b.slug === id);
      if (!found) throw new Error('Blog post not found');
      return found;
    }
  },

  // APPOINTMENTS
  async getAppointments(params: { userId?: string; status?: string } = {}): Promise<Appointment[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.userId) searchParams.set('userId', params.userId);
      if (params.status) searchParams.set('status', params.status);
      const queryString = searchParams.toString();
      return await fetchJSON<Appointment[]>(`${API_BASE}/appointments${queryString ? `?${queryString}` : ''}`);
    } catch (err) {
      console.warn('API appointments fetch failed, using fallback', err);
      return INITIAL_APPOINTMENTS;
    }
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    return fetchJSON<Appointment>(`${API_BASE}/appointments/${id}`);
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    return fetchJSON<Appointment>(`${API_BASE}/appointments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    return fetchJSON<Appointment>(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    return fetchJSON<Appointment>(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async deleteAppointment(id: string): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  // ORDERS
  async getOrders(params: { userId?: string; status?: string } = {}): Promise<Order[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.userId) searchParams.set('userId', params.userId);
      if (params.status) searchParams.set('status', params.status);
      const queryString = searchParams.toString();
      return await fetchJSON<Order[]>(`${API_BASE}/orders${queryString ? `?${queryString}` : ''}`);
    } catch (err) {
      console.warn('API orders fetch failed, using fallback', err);
      return INITIAL_ORDERS;
    }
  },

  async getOrderById(id: string): Promise<Order> {
    return fetchJSON<Order>(`${API_BASE}/orders/${id}`);
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return fetchJSON<Order>(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    return fetchJSON<Order>(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return fetchJSON<Order>(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus: status, status }),
    });
  },

  async deleteOrder(id: string): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/orders/${id}`, {
      method: 'DELETE',
    });
  },

  // BLOGS
  async getBlogs(): Promise<BlogPost[]> {
    try {
      return await fetchJSON<BlogPost[]>(`${API_BASE}/blog`);
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  },

  async getBlogById(id: string): Promise<BlogPost> {
    try {
      return await fetchJSON<BlogPost>(`${API_BASE}/blog/${id}`);
    } catch {
      const found = INITIAL_BLOG_POSTS.find((b) => b.id === id || b.slug === id);
      if (!found) throw new Error('Blog article not found');
      return found;
    }
  },

  // REVIEWS
  async getReviews(targetId?: string): Promise<Review[]> {
    try {
      const q = targetId ? `?targetId=${targetId}` : '';
      return await fetchJSON<Review[]>(`${API_BASE}/reviews${q}`);
    } catch {
      return targetId ? INITIAL_REVIEWS.filter((r) => r.targetId === targetId) : INITIAL_REVIEWS;
    }
  },

  async createReview(data: Partial<Review>): Promise<Review> {
    return fetchJSON<Review>(`${API_BASE}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteReview(id: string): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // CATEGORIES
  async getCategories(): Promise<{ productCategories: string[]; serviceCategories: string[] }> {
    try {
      return await fetchJSON<{ productCategories: string[]; serviceCategories: string[] }>(`${API_BASE}/categories`);
    } catch {
      return {
        productCategories: ['Hair Care', 'Skin Care', 'Makeup', 'Nail Care', 'Beauty Tools', 'Body Care', 'Salon Essentials'],
        serviceCategories: ['Hair', 'Skin', 'Makeup', 'Nails', 'Bridal', 'Beauty Care', 'Other Salon Services'],
      };
    }
  },

  // AUTH
  async login(credentials: { email: string; password?: string }): Promise<{ token: string; user: User }> {
    const res = await fetchJSON<{ token: string; user: User }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('zbs_auth_token', res.token);
    return res;
  },

  async register(data: { name: string; email: string; phone: string; password?: string; address?: string; city?: string }): Promise<{ token: string; user: User }> {
    const res = await fetchJSON<{ token: string; user: User }>(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('zbs_auth_token', res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return fetchJSON<{ user: User }>(`${API_BASE}/auth/me`);
  },

  // STATS
  async getStats(): Promise<AdminStats> {
    return fetchJSON<AdminStats>(`${API_BASE}/stats`);
  },

  // SEED / RESET
  async resetDatabase(): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/seed`, {
      method: 'POST',
    });
  },
};
