import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { ScrollToTop } from './components/ScrollToTop';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { SalonMenu } from './pages/SalonMenu';
import { Categories } from './pages/Categories';
import { Offers } from './pages/Offers';
import { BestSellers } from './pages/BestSellers';
import { AppointmentBooking } from './pages/AppointmentBooking';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { OrderSuccess } from './pages/OrderSuccess';
import { Gallery } from './pages/Gallery';
import { Blog } from './pages/Blog';
import { BlogDetails } from './pages/BlogDetails';
import { Reviews } from './pages/Reviews';
import { About } from './pages/About';
import { OurStory } from './pages/OurStory';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-stone-900 font-sans antialiased selection:bg-[#EFE8DC] selection:text-[#8C5D3D]">
            {/* Header Navigation */}
            <Navbar />

            {/* Main Content View */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetails />} />
                <Route path="/salon-menu" element={<SalonMenu />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/book-appointment" element={<AppointmentBooking />} />
                <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/about" element={<About />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/my-orders" element={<UserDashboard />} />
                <Route path="/my-appointments" element={<UserDashboard />} />
                <Route path="/wishlist" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Global Slide-Over Shopping Bag */}
            <CartDrawer />

            {/* Global Appointment Booking Modal */}
            <AppointmentBookingModal />

            {/* Toast System Notification */}
            <Toast />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
