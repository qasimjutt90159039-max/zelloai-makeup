export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export type ProductCategory = 
  | 'Hair Care'
  | 'Skin Care'
  | 'Makeup'
  | 'Nail Care'
  | 'Beauty Tools'
  | 'Body Care'
  | 'Salon Essentials'
  | 'Bridal Makeup Packages'
  | 'Party/Event Makeup'
  | 'Hair Styling & Treatments'
  | 'Facial & Skincare Services'
  | 'Gift Vouchers / Combo Deals';

export type ServiceCategory = 
  | 'Hair'
  | 'Skin'
  | 'Makeup'
  | 'Nails'
  | 'Bridal'
  | 'Beauty Care'
  | 'Other Salon Services';

export type ItemType = 'product' | 'service';

export interface ProductVariant {
  name: string;
  priceModifier?: number;
}

export interface Review {
  id: string;
  targetId: string; // productId or serviceId
  targetName: string;
  targetType?: 'service' | 'product';
  userName: string;
  userCity?: string;
  rating: number; // 1 to 5
  comment: string;
  date?: string;
  createdAt?: string;
  verified?: boolean;
  verifiedPurchase?: boolean;
  isDemoNotice?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory | string;
  itemType?: ItemType;
  description: string;
  shortDescription?: string;
  price: number; // PKR
  discountPrice?: number;
  originalPrice?: number;
  images: string[];
  image: string;
  galleryImages?: string[];
  stock: number;
  stockCount: number;
  inStock?: boolean;
  rating: number;
  reviews: number;
  reviewsCount?: number;
  brand: string;
  featured: boolean;
  bestSeller: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  tags: string[];
  ingredients: string[] | string;
  howToUse: string;
  details?: string[];
  features?: string[];
  sku?: string;
  howToUseOrPrep?: string;
  variants?: ProductVariant[];
  badge?: string;
  isDemoNotice?: string; // Clearly labeled demo catalog indicator
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory | string;
  description: string;
  duration: string;
  price: number; // PKR
  originalPrice?: number;
  benefits: string[];
  prep: string;
  aftercare: string;
  image: string;
  featured: boolean;
  popular: boolean;
  isDemoNotice?: string;
}

export interface Offer {
  id: string;
  title: string;
  slug: string;
  description: string;
  includedServices: string[];
  originalPrice: number;
  offerPrice: number;
  discountPercent: number;
  validity: string;
  image: string;
  badge: string;
  isDemoNotice?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  image?: string;
  category: string;
  date: string;
  author: string;
  summary: string;
  excerpt?: string;
  content: string;
  readTime: string;
  tags: string[];
  relatedPostIds?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'card' | 'bank_transfer' | 'easypaisa_jazzcash' | 'jazzcash_easypaisa' | 'jazzcash';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  area?: string; // e.g. "Block 2 P.E.C.H.S.", "Tariq Road", "Clifton", "Gulshan"
  city: string; // default "Karachi"
  postalCode: string; // e.g. "75400"
  instructions?: string;
  deliveryNotes?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: ShippingAddress;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  status?: OrderStatus;
  promoCodeApplied?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  bookingId: string; // e.g. "ZBS-2026-0001"
  appointmentNumber: string;
  userId?: string;
  customerName: string;
  clientName: string;
  phone: string;
  clientPhone: string;
  email: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  date: string; // YYYY-MM-DD
  appointmentDate: string;
  timeSlot: string; // e.g. "02:00 PM"
  appointmentTime: string;
  notes?: string;
  specialRequests?: string;
  price: number;
  estimatedPrice?: number;
  stylistName?: string;
  artistPreference?: string;
  numberOfPersons?: number;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalAppointments: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  pendingAppointments: number;
  recentOrders: Order[];
  recentAppointments: Appointment[];
}
