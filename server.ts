import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SERVICES,
  INITIAL_OFFERS,
  INITIAL_BLOG_POSTS,
  INITIAL_REVIEWS, 
  INITIAL_USERS, 
  INITIAL_ORDERS, 
  INITIAL_APPOINTMENTS 
} from './src/data/initialData';
import { 
  Product, 
  Service, 
  Offer, 
  BlogPost, 
  Review, 
  User, 
  Order, 
  Appointment,
  AdminStats 
} from './src/types';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// CORS Support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Normalize request URL if /api was stripped or rewritten
app.use((req, _res, next) => {
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/assets')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// In-Memory & File-backed Database Store for reliable persistence
interface SalonDatabase {
  products: Product[];
  services: Service[];
  offers: Offer[];
  blog: BlogPost[];
  reviews: Review[];
  users: User[];
  orders: Order[];
  appointments: Appointment[];
}

const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'salon-database.json')
  : path.join(process.cwd(), 'salon-database.json');

function loadDatabase(): SalonDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read cached database from disk:', err);
  }


  return {
    products: [...INITIAL_PRODUCTS],
    services: [...INITIAL_SERVICES],
    offers: [...INITIAL_OFFERS],
    blog: [...INITIAL_BLOG_POSTS],
    reviews: [...INITIAL_REVIEWS],
    users: [...INITIAL_USERS],
    orders: [...INITIAL_ORDERS],
    appointments: [...INITIAL_APPOINTMENTS],
  };
}

let db: SalonDatabase = loadDatabase();

// Sanitize images across all items
db.blog = db.blog.map((b) => ({
  ...b,
  image: b.image || b.featuredImage || 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80',
  featuredImage: b.featuredImage || b.image || 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80',
  excerpt: b.excerpt || b.summary,
}));

db.products = db.products.map((p) => ({
  ...p,
  image: p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
}));

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist database to disk:', err);
  }
}

// Only persist to disk when running full local server
if (!process.env.VERCEL) {
  saveDatabase();
}

/* -------------------------------------------------------------
   HEALTH CHECK ROUTE (/api/health & /api)
------------------------------------------------------------- */
app.get('/api', (_req: Request, res: Response) => {
  res.json({ status: 'ok', name: 'Zoellas Beauty Salon API', version: '1.0.0' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* -------------------------------------------------------------
   AUTH API ROUTES (/api/auth)
------------------------------------------------------------- */
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Token simulation
  const token = `zbs_token_${user.id}_${Date.now()}`;
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      address: user.address,
      city: user.city,
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password, address, city } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone number are required' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    phone,
    role: 'customer',
    address: address || '',
    city: city || 'Karachi',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDatabase();

  const token = `zbs_token_${newUser.id}_${Date.now()}`;
  return res.status(201).json({ token, user: newUser });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const parts = token.split('_');
  const userId = parts[2];

  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found or session expired' });
  }

  return res.json({ user });
});

/* -------------------------------------------------------------
   PRODUCTS API ROUTES (/api/products)
------------------------------------------------------------- */
app.get('/api/products', (req: Request, res: Response) => {
  const { category, brand, featured, bestSeller, search, sort, maxPrice, inStockOnly } = req.query;

  let results = [...db.products];

  if (category && category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (brand && brand !== 'All') {
    results = results.filter((p) => p.brand.toLowerCase() === String(brand).toLowerCase());
  }

  if (featured === 'true') {
    results = results.filter((p) => p.featured);
  }

  if (bestSeller === 'true') {
    results = results.filter((p) => p.bestSeller || p.isBestSeller);
  }

  if (inStockOnly === 'true') {
    results = results.filter((p) => p.stock > 0);
  }

  if (maxPrice) {
    const num = Number(maxPrice);
    if (!isNaN(num)) {
      results = results.filter((p) => (p.discountPrice || p.price) <= num);
    }
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price-low') {
    results.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sort === 'price-high') {
    results.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    results.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  } else if (sort === 'newest') {
    results.reverse();
  }

  return res.json(results);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const product = db.products.find((p) => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.price) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: data.category || 'Hair Care',
    itemType: 'product',
    description: data.description || '',
    price: Number(data.price),
    discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
    originalPrice: data.originalPrice ? Number(data.originalPrice) : Number(data.price),
    images: data.images?.length ? data.images : [data.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
    image: data.image || (data.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'),
    galleryImages: data.images || [],
    stock: Number(data.stock ?? 15),
    stockCount: Number(data.stock ?? 15),
    rating: data.rating ? Number(data.rating) : 5.0,
    reviews: 0,
    reviewsCount: 0,
    brand: data.brand || 'Zoellas Atelier',
    featured: Boolean(data.featured),
    bestSeller: Boolean(data.bestSeller),
    tags: Array.isArray(data.tags) ? data.tags : ['Salon Grade'],
    ingredients: data.ingredients || 'Natural Botanical Extracts',
    howToUse: data.howToUse || 'Apply as directed on packaging.',
    isDemoNotice: 'Catalog demo specification. Contact 03111802834 for live inventory status.',
  };

  db.products.unshift(newProduct);
  saveDatabase();
  return res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    stockCount: req.body.stock !== undefined ? Number(req.body.stock) : db.products[index].stockCount,
  };
  saveDatabase();
  return res.json(db.products[index]);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);

  if (db.products.length === initialLen) {
    return res.status(404).json({ error: 'Product not found' });
  }

  saveDatabase();
  return res.json({ message: 'Product deleted successfully', id });
});

/* -------------------------------------------------------------
   SERVICES API ROUTES (/api/services)
------------------------------------------------------------- */
app.get('/api/services', (req: Request, res: Response) => {
  const { category, featured, popular, search } = req.query;
  let list = [...db.services];

  if (category && category !== 'All') {
    list = list.filter((s) => s.category.toLowerCase() === String(category).toLowerCase());
  }

  if (featured === 'true') {
    list = list.filter((s) => s.featured);
  }

  if (popular === 'true') {
    list = list.filter((s) => s.popular);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  return res.json(list);
});

app.get('/api/services/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const service = db.services.find((s) => s.id === id || s.slug === id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  return res.json(service);
});

app.post('/api/services', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.price) {
    return res.status(400).json({ error: 'Service name and price are required' });
  }

  const newService: Service = {
    id: `srv-${Date.now()}`,
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: data.category || 'Hair',
    description: data.description || '',
    duration: data.duration || '60 mins',
    price: Number(data.price),
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    benefits: Array.isArray(data.benefits) ? data.benefits : ['Signature Salon Treatment'],
    prep: data.prep || 'Arrive 10 minutes prior.',
    aftercare: data.aftercare || 'Follow stylist instructions.',
    image: data.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
    featured: Boolean(data.featured),
    popular: Boolean(data.popular),
  };

  db.services.push(newService);
  saveDatabase();
  return res.status(201).json(newService);
});

app.put('/api/services/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.services.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  db.services[index] = {
    ...db.services[index],
    ...req.body,
  };
  saveDatabase();
  return res.json(db.services[index]);
});

app.delete('/api/services/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = db.services.length;
  db.services = db.services.filter((s) => s.id !== id);

  if (db.services.length === initialLen) {
    return res.status(404).json({ error: 'Service not found' });
  }

  saveDatabase();
  return res.json({ message: 'Service deleted successfully', id });
});

/* -------------------------------------------------------------
   CATEGORIES API ROUTES (/api/categories)
------------------------------------------------------------- */
app.get('/api/categories', (req: Request, res: Response) => {
  const productCategories = Array.from(new Set(db.products.map((p) => p.category)));
  const serviceCategories = Array.from(new Set(db.services.map((s) => s.category)));

  return res.json({
    productCategories,
    serviceCategories,
  });
});

/* -------------------------------------------------------------
   OFFERS API ROUTES (/api/offers)
------------------------------------------------------------- */
app.get('/api/offers', (req: Request, res: Response) => {
  return res.json(db.offers);
});

app.get('/api/offers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const offer = db.offers.find((o) => o.id === id || o.slug === id);
  if (!offer) {
    return res.status(404).json({ error: 'Offer not found' });
  }
  return res.json(offer);
});

app.post('/api/offers', (req: Request, res: Response) => {
  const data = req.body;
  const newOffer: Offer = {
    id: `off-${Date.now()}`,
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description || '',
    includedServices: data.includedServices || [],
    originalPrice: Number(data.originalPrice || 0),
    offerPrice: Number(data.offerPrice || 0),
    discountPercent: Number(data.discountPercent || 15),
    validity: data.validity || 'Valid this month',
    image: data.image || 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80',
    badge: data.badge || 'Special Offer',
  };

  db.offers.push(newOffer);
  saveDatabase();
  return res.status(201).json(newOffer);
});

app.put('/api/offers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.offers.findIndex((o) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  db.offers[index] = { ...db.offers[index], ...req.body };
  saveDatabase();
  return res.json(db.offers[index]);
});

app.delete('/api/offers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.offers = db.offers.filter((o) => o.id !== id);
  saveDatabase();
  return res.json({ message: 'Offer deleted' });
});

/* -------------------------------------------------------------
   BLOG API ROUTES (/api/blog)
------------------------------------------------------------- */
app.get('/api/blog', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let list = [...db.blog];

  if (category && category !== 'All') {
    list = list.filter((b) => b.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((b) => b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q));
  }

  return res.json(list);
});

app.get('/api/blog/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const post = db.blog.find((b) => b.id === id || b.slug === id);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  return res.json(post);
});

app.post('/api/blog', (req: Request, res: Response) => {
  const data = req.body;
  const newPost: BlogPost = {
    id: `blog-${Date.now()}`,
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80',
    category: data.category || 'Beauty Tips',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: data.author || 'Zoellas Beauty Editorial',
    summary: data.summary || '',
    content: data.content || '',
    readTime: data.readTime || '4 min read',
    tags: data.tags || ['Beauty Tips'],
  };

  db.blog.unshift(newPost);
  saveDatabase();
  return res.status(201).json(newPost);
});

/* -------------------------------------------------------------
   APPOINTMENTS API ROUTES (/api/appointments)
------------------------------------------------------------- */
app.get('/api/appointments', (req: Request, res: Response) => {
  const { userId, status, date } = req.query;
  let results = [...db.appointments];

  if (userId) {
    results = results.filter((a) => a.userId === userId);
  }

  if (status && status !== 'all') {
    results = results.filter((a) => a.status === status);
  }

  if (date) {
    results = results.filter((a) => a.date === date || a.appointmentDate === date);
  }

  // Sort by date descending
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(results);
});

app.get('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const appt = db.appointments.find((a) => a.id === id || a.bookingId === id);
  if (!appt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  return res.json(appt);
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const { 
    customerName,
    clientName, 
    phone,
    clientPhone, 
    email,
    clientEmail, 
    serviceId, 
    serviceName, 
    serviceCategory, 
    date,
    appointmentDate, 
    timeSlot,
    appointmentTime, 
    notes,
    specialRequests,
    price,
    estimatedPrice,
    userId 
  } = req.body;

  const resolvedName = customerName || clientName;
  const resolvedPhone = phone || clientPhone;
  const resolvedDate = date || appointmentDate;
  const resolvedTime = timeSlot || appointmentTime;

  if (!resolvedName || !resolvedPhone || !resolvedDate || !resolvedTime) {
    return res.status(400).json({ error: 'Name, phone number, date, and time slot are required' });
  }

  const nextCount = db.appointments.length + 1;
  const bookingId = `ZBS-2026-${String(nextCount).padStart(4, '0')}`;

  const newAppt: Appointment = {
    id: `appt-${Date.now()}`,
    bookingId,
    appointmentNumber: bookingId,
    userId: userId || undefined,
    customerName: resolvedName,
    clientName: resolvedName,
    phone: resolvedPhone,
    clientPhone: resolvedPhone,
    email: email || clientEmail || '',
    clientEmail: email || clientEmail || '',
    serviceId: serviceId || 'srv-custom',
    serviceName: serviceName || 'Bespoke Beauty Consultation',
    serviceCategory: serviceCategory || 'Hair & Makeup',
    date: resolvedDate,
    appointmentDate: resolvedDate,
    timeSlot: resolvedTime,
    appointmentTime: resolvedTime,
    price: Number(price || estimatedPrice || 3500),
    estimatedPrice: Number(price || estimatedPrice || 3500),
    notes: notes || specialRequests || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.appointments.unshift(newAppt);
  saveDatabase();
  return res.status(201).json(newAppt);
});

app.put('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.appointments.findIndex((a) => a.id === id || a.bookingId === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.appointments[index] = {
    ...db.appointments[index],
    ...req.body,
  };
  saveDatabase();
  return res.json(db.appointments[index]);
});

app.delete('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = db.appointments.length;
  db.appointments = db.appointments.filter((a) => a.id !== id && a.bookingId !== id);

  if (db.appointments.length === initialLen) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  saveDatabase();
  return res.json({ message: 'Appointment deleted successfully', id });
});

/* -------------------------------------------------------------
   ORDERS API ROUTES (/api/orders)
------------------------------------------------------------- */
app.get('/api/orders', (req: Request, res: Response) => {
  const { userId, status } = req.query;
  let results = [...db.orders];

  if (userId) {
    results = results.filter((o) => o.userId === userId);
  }

  if (status && status !== 'all') {
    results = results.filter((o) => o.orderStatus === status || o.status === status);
  }

  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(results);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = db.orders.find((o) => o.id === id || o.orderNumber === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.items || !data.items.length) {
    return res.status(400).json({ error: 'Cart is empty. Items required to place order.' });
  }

  const nextNum = db.orders.length + 1;
  const orderNumber = `ZBS-ORD-2026-${String(nextNum).padStart(3, '0')}`;

  const customerData = data.customer || data.shippingAddress || {
    fullName: data.customerName || 'Customer',
    phone: data.customerPhone || '03111802834',
    address: '867c Tariq Rd, PECHS, Karachi',
    city: 'Karachi',
    postalCode: '75400',
  };

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    userId: data.userId || undefined,
    customer: customerData,
    customerName: customerData.fullName,
    customerPhone: customerData.phone,
    shippingAddress: customerData,
    items: data.items,
    subtotal: Number(data.subtotal || 0),
    discount: Number(data.discount || 0),
    shippingFee: Number(data.shippingFee || 0),
    total: Number(data.total || 0),
    paymentMethod: data.paymentMethod || 'cod',
    paymentStatus: data.paymentStatus || 'pending',
    orderStatus: 'pending',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Decrement product inventory
  for (const it of newOrder.items) {
    const prod = db.products.find((p) => p.id === it.product.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - it.quantity);
      prod.stockCount = prod.stock;
    }
  }

  db.orders.unshift(newOrder);
  saveDatabase();
  return res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  db.orders[index] = {
    ...db.orders[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();
  return res.json(db.orders[index]);
});

app.delete('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== id && o.orderNumber !== id);

  if (db.orders.length === initialLen) {
    return res.status(404).json({ error: 'Order not found' });
  }

  saveDatabase();
  return res.json({ message: 'Order deleted successfully', id });
});

/* -------------------------------------------------------------
   REVIEWS API ROUTES (/api/reviews)
------------------------------------------------------------- */
app.get('/api/reviews', (req: Request, res: Response) => {
  const { targetId } = req.query;
  let results = [...db.reviews];
  if (targetId) {
    results = results.filter((r) => r.targetId === targetId);
  }
  return res.json(results);
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { targetId, targetName, userName, userCity, rating, comment } = req.body;
  if (!targetId || !userName || !rating || !comment) {
    return res.status(400).json({ error: 'Target ID, user name, rating, and comment are required' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    targetId,
    targetName: targetName || 'Salon Service / Product',
    userName,
    userCity: userCity || 'Karachi',
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
    verified: true,
  };

  db.reviews.unshift(newReview);
  saveDatabase();
  return res.status(201).json(newReview);
});

app.delete('/api/reviews/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.reviews = db.reviews.filter((r) => r.id !== id);
  saveDatabase();
  return res.json({ message: 'Review deleted', id });
});

/* -------------------------------------------------------------
   ADMIN STATS API ROUTE (/api/stats)
------------------------------------------------------------- */
app.get('/api/stats', (req: Request, res: Response) => {
  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = db.orders.length;
  const totalAppointments = db.appointments.length;
  const totalProducts = db.products.length;
  const totalCustomers = db.users.filter((u) => u.role === 'customer').length;
  const pendingOrders = db.orders.filter((o) => (o.orderStatus || o.status) === 'pending').length;
  const pendingAppointments = db.appointments.filter((a) => a.status === 'pending').length;

  const stats: AdminStats = {
    totalRevenue,
    totalOrders,
    totalAppointments,
    totalProducts,
    totalCustomers,
    pendingOrders,
    pendingAppointments,
    recentOrders: db.orders.slice(0, 5),
    recentAppointments: db.appointments.slice(0, 5),
  };

  return res.json(stats);
});

/* -------------------------------------------------------------
   RESET / SEED API ROUTE (/api/seed)
------------------------------------------------------------- */
app.post('/api/seed', (req: Request, res: Response) => {
  db = {
    products: [...INITIAL_PRODUCTS],
    services: [...INITIAL_SERVICES],
    offers: [...INITIAL_OFFERS],
    blog: [...INITIAL_BLOG_POSTS],
    reviews: [...INITIAL_REVIEWS],
    users: [...INITIAL_USERS],
    orders: [...INITIAL_ORDERS],
    appointments: [...INITIAL_APPOINTMENTS],
  };
  saveDatabase();
  return res.json({ message: 'Database reset to initial Zoellas Beauty Salon catalog successfully' });
});

/* -------------------------------------------------------------
   VITE DEV SERVER / STATIC ASSETS INTEGRATION
------------------------------------------------------------- */
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vitePkg = 'vite';
    const { createServer: createViteServer } = await import(vitePkg);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌸 Zoellas Beauty Salon Server listening on port ${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
