import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Search, 
  Calendar, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  LogOut, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO } from '../data/business';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { totalItems, wishlist, setIsCartOpen, openAppointmentModal } = useCart();
  const { user, isAuthenticated, isAdmin, logout, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Salon Menu', path: '/salon-menu' },
    { name: 'Shop', path: '/shop' },
    { name: 'Offers', path: '/offers' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Beauty Tips', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8D5CE]/60">
      {/* Top Announcement Bar */}
      <div className="bg-[#1A1A1A] text-[#FAF7F2] py-2 px-4 text-xs font-normal">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[#C5A880] tracking-wide uppercase text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" /> Block 2 P.E.C.H.S., Tariq Road, Karachi
            </span>
            <span className="hidden md:inline text-stone-300">
              · Near Tariq Center
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-300">
            <a 
              href={BUSINESS_INFO.phoneTel} 
              className="flex items-center gap-1 hover:text-[#C5A880] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C5A880]" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <span className="text-white/20">|</span>
            <a 
              href={BUSINESS_INFO.whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-[#4EFE97] hover:text-white transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline text-[#E8D5CE]">
              Free Karachi Delivery Over Rs. 4,000
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#1A1A1A] hover:bg-[#EFE8DC] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
            <Link to="/" className="group flex flex-col items-center lg:items-start text-center">
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[#1A1A1A] group-hover:text-[#8C5D3D] transition-colors">
                ZOELLAS
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C5D3D] font-medium -mt-1">
                Beauty Salon · Karachi
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[13px] tracking-wide font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'border-[#8C5D3D] text-[#8C5D3D] font-semibold'
                      : 'border-transparent text-[#2C2C2C] hover:text-[#8C5D3D]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              id="desktop-search-toggle-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#2C2C2C] hover:text-[#8C5D3D] transition-colors"
              title="Search salon services & products"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#2C2C2C] hover:text-[#8C5D3D] transition-colors hidden sm:block"
              title="Saved items"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute 1 top-1 -right-0.5 w-4 h-4 bg-[#8C5D3D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Drawer Trigger */}
            <button
              id="cart-drawer-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#2C2C2C] hover:text-[#8C5D3D] transition-colors"
              title="Shopping bag"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute 1 top-1 -right-0.5 w-4 h-4 bg-[#8C5D3D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  id="user-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#EFE8DC] transition-colors border border-[#E8D5CE]"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80';
                    }}
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-[#2C2C2C] hover:text-[#8C5D3D] transition-colors"
                  title="Sign In / Register"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && isAuthenticated && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E8D5CE] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-500">Signed in as</p>
                    <p className="text-sm font-semibold text-stone-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#8C5D3D] font-medium capitalize mt-0.5">{user?.role} Account</p>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#8C5D3D]"
                  >
                    My Profile & Settings
                  </Link>
                  <Link
                    to="/my-appointments"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#8C5D3D]"
                  >
                    My Salon Bookings
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#8C5D3D]"
                  >
                    My Product Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#8C5D3D]"
                  >
                    My Wishlist
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-[#8C5D3D] hover:bg-[#FAF7F2] border-t border-stone-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="border-t border-stone-100 mt-1 pt-1 px-4 py-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">Demo Role:</span>
                    <button
                      onClick={() => switchDemoUser(isAdmin ? 'customer' : 'admin')}
                      className="text-[#8C5D3D] font-medium hover:underline flex items-center gap-1"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      Switch to {isAdmin ? 'Customer' : 'Admin'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-stone-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Book Appointment CTA */}
            <button
              id="nav-book-appointment-btn"
              onClick={() => openAppointmentModal()}
              className="hidden md:inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-all shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-[#E8D5CE] bg-white px-4 py-3 shadow-inner">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                id="site-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, services, bridal packages, or hair treatments..."
                className="w-full pl-10 pr-24 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-hidden focus:border-[#8C5D3D] focus:ring-1 focus:ring-[#8C5D3D]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1.5 bg-[#8C5D3D] text-white text-xs font-medium rounded-md hover:bg-[#72482E] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8D5CE] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salon & store..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 text-xs bg-white focus:outline-hidden focus:border-[#8C5D3D]"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md ${
                  location.pathname === link.path
                    ? 'bg-[#EFE8DC] text-[#8C5D3D] font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openAppointmentModal();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-2.5 rounded-lg text-xs font-medium"
            >
              <Calendar className="w-4 h-4 text-[#C5A880]" />
              Book Salon Appointment
            </button>

            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg text-xs font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
