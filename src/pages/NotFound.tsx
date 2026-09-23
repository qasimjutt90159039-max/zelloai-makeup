import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ShoppingBag, Calendar } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 bg-[#FAF7F2]">
      <div className="w-20 h-20 bg-[#EFE8DC] text-[#8C5D3D] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[#E8D5CE]">
        <Sparkles className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5D3D]">
          Error 404 • Page Not Found
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-stone-900">
          Looking for Something Beautiful?
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          The page you requested might have been moved or does not exist. Explore our salon services or boutique shop below.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-stone-300 bg-white text-stone-800 hover:bg-[#FAF7F2] font-semibold text-xs uppercase tracking-wider transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Boutique</span>
        </Link>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EFE8DC] text-[#8C5D3D] hover:bg-[#e4dbce] font-semibold text-xs uppercase tracking-wider transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>Salon Services</span>
        </Link>
      </div>
    </div>
  );
};
