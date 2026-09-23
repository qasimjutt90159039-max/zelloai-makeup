import React, { useState } from 'react';
import { Sparkles, Calendar, X, Eye, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export const Gallery: React.FC = () => {
  const { openAppointmentModal } = useCart();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const tags = ['All', 'Bridal', 'Hair', 'Skin', 'Nails', 'Studio'];

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      title: 'Traditional Royal Barat Bride',
      category: 'Bridal',
      image: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80',
      description: 'Classic crimson red bridal glam, sculpted matte contour, and royal gold accents.',
    },
    {
      id: 'g2',
      title: 'Dewy Walima Reception Glow',
      category: 'Bridal',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      description: 'Pastel champagne hues, luminous skin finish, and romantic textured curls.',
    },
    {
      id: 'g3',
      title: 'Nano-Keratin Smoothing Result',
      category: 'Hair',
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
      description: 'Silky glass-hair finish after organic formaldehyde-free keratin treatment.',
    },
    {
      id: 'g4',
      title: 'Dimensional Honey Balayage',
      category: 'Hair',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      description: 'Hand-painted sunlit ribbons on dark brunette hair base.',
    },
    {
      id: 'g5',
      title: 'Hydro-Oxygen Glass Skin Facial',
      category: 'Skin',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      description: 'Clinical dermaplaning and antioxidant infusion for immediate radiance.',
    },
    {
      id: 'g6',
      title: 'Russian Gel French Almond Nails',
      category: 'Nails',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      description: 'Ultra-clean dry e-file cuticle detailing with long-lasting gel overlay.',
    },
    {
      id: 'g7',
      title: 'Intricate Nikkah Henna & Manicure',
      category: 'Nails',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      description: 'Delicate floral Mehendi patterns with soft blush nude gel manicure.',
    },
    {
      id: 'g8',
      title: 'Zoellas Tariq Road Styling Stations',
      category: 'Studio',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      description: 'Serene warm aesthetic with illuminated mirrors and private consultation stations.',
    },
    {
      id: 'g9',
      title: 'Glam Evening Smokey Eyes',
      category: 'Bridal',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      description: 'Sophisticated bronze smokey eye with individual featherweight lashes.',
    },
  ];

  const filteredItems = galleryItems.filter(
    (item) => selectedTag === 'All' || item.category === selectedTag
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Visual Portfolio
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Zoellas Beauty Gallery
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          A glimpse into our recent bridal looks, precision haircuts, clinical skin transformations, and manicure artistry created at Tariq Road, Karachi.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedTag === tag
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-[#EFE8DC]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8D5CE] shadow-xs cursor-pointer aspect-4/5"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880]">
                {item.category}
              </span>
              <h3 className="font-serif text-xl font-normal text-white">{item.title}</h3>
              <p className="text-xs text-stone-300 line-clamp-2">{item.description}</p>
              <div className="pt-2 flex items-center gap-1.5 text-xs text-[#C5A880] font-medium">
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Photo</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-800">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-4/3 overflow-hidden bg-black">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
                  {activeItem.category}
                </span>
                <h3 className="font-serif text-2xl font-normal text-stone-900 mt-1">{activeItem.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{activeItem.description}</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setActiveItem(null);
                    openAppointmentModal();
                  }}
                  className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>Book This Look</span>
                </button>

                <button
                  onClick={() => setActiveItem(null)}
                  className="px-5 py-3 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-medium text-stone-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
