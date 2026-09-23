import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  Search, 
  SlidersHorizontal, 
  ShoppingBag, 
  Heart, 
  Star, 
  X, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Product } from '../types';

const CATEGORIES = [
  'All',
  'Hair Care',
  'Skin Care',
  'Makeup',
  'Nail Care',
  'Beauty Tools',
  'Body Care',
  'Salon Essentials',
];

const BRANDS = [
  'All',
  'Zoellas Atelier',
  'Zoellas Cosmetics',
  'Dermacare Studio',
  'Radiance Lab',
  'Botanical Haircare',
  'Pro Tools Co.',
  'Nail Atelier',
];

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>(searchParam);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
      setCurrentPage(1);
    }
    const q = searchParams.get('search');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Synchronize category click with URL
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Filtered & Sorted items
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'All' && item.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Price filter
      const effectivePrice = item.discountPrice || item.price;
      if (effectivePrice > maxPrice) {
        return false;
      }
      // Stock filter
      if (inStockOnly && item.stock <= 0) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesTag = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesTag) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return (b.reviews || 0) - (a.reviews || 0);
      if (sortBy === 'bestseller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBrand, maxPrice, inStockOnly, searchTerm, sortBy]);

  // Pagination slices
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSearchTerm('');
    setMaxPrice(10000);
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
              Zoellas Beauty Store · Karachi
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
              Salon-Grade Beauty Catalog
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Cruelty-free botanical formulas, haircare elixirs, professional tools, and couture makeup curated for Karachi clients.
            </p>
          </div>

          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5 pointer-events-none" />
              <input
                id="shop-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products or ingredients..."
                className="w-full pl-9 pr-8 py-2.5 bg-[#FAF7F2] rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:border-[#8C5D3D]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8D5CE] shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#8C5D3D]" />
                  Filters
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-[#8C5D3D] hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold text-stone-900 mb-2 uppercase tracking-wider">
                  Product Category
                </h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-[#EFE8DC] text-[#8C5D3D] font-bold'
                          : 'text-stone-600 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="border-t border-stone-100 pt-4">
                <h4 className="text-xs font-semibold text-stone-900 mb-2 uppercase tracking-wider">
                  Brand / Line
                </h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 py-2 px-2.5 focus:outline-hidden focus:border-[#8C5D3D] bg-white text-stone-800"
                >
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter Slider */}
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-900 uppercase tracking-wider">Max Price</span>
                  <span className="font-bold text-[#8C5D3D]">Rs. {maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8C5D3D]"
                />
              </div>

              {/* In-Stock Toggle */}
              <div className="border-t border-stone-100 pt-4">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded-sm text-[#8C5D3D] focus:ring-[#8C5D3D]"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>

            </div>
          </aside>

          {/* MAIN PRODUCT LIST */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Control Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#E8D5CE] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 bg-[#FAF7F2] border border-stone-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-stone-700"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <span className="text-xs text-stone-500">
                  Showing <strong>{filteredProducts.length}</strong> beauty items
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs rounded-lg border border-stone-300 py-1.5 px-2.5 focus:outline-hidden focus:border-[#8C5D3D] bg-white text-stone-800"
                  >
                    <option value="featured">Featured First</option>
                    <option value="bestseller">Best Sellers</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Reviews</option>
                  </select>
                </div>

                <div className="hidden sm:flex items-center border border-stone-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-stone-500 hover:bg-stone-100'}`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-[#1A1A1A] text-white' : 'text-stone-500 hover:bg-stone-100'}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            {loading ? (
              <div className="text-center py-20 text-stone-500">Loading catalog items...</div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-3">
                <h3 className="font-serif text-xl text-stone-800">No products match your criteria</h3>
                <p className="text-xs text-stone-500">Try loosening your search query or reset your price filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-[#8C5D3D] text-white text-xs font-semibold rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paginatedProducts.map((p) => {
                  const inWish = isInWishlist(p.id);
                  const effectivePrice = p.discountPrice || p.price;
                  return (
                    <div
                      key={p.id}
                      className="group rounded-2xl bg-white border border-[#E8D5CE] p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative"
                    >
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 shadow-xs hover:bg-white text-stone-600 transition-colors"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      <div>
                        <Link to={`/product/${p.slug || p.id}`} className="block overflow-hidden rounded-xl bg-[#FAF7F2] mb-3">
                          <img
                            src={p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                            alt={p.name}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </Link>
                        <span className="text-[10px] uppercase tracking-wider text-[#8C5D3D] font-medium">
                          {p.category}
                        </span>
                        <Link to={`/product/${p.slug || p.id}`}>
                          <h3 className="text-sm font-semibold text-stone-900 mt-1 line-clamp-1 hover:text-[#8C5D3D] transition-colors">
                            {p.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 text-amber-500 text-xs mt-1.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold text-stone-800">{p.rating.toFixed(1)}</span>
                          <span className="text-stone-400">({p.reviews})</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-sm font-bold text-stone-900">
                            Rs. {effectivePrice.toLocaleString()}
                          </span>
                          {p.discountPrice && (
                            <span className="text-xs text-stone-400 line-through block -mt-1">
                              Rs. {p.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((p) => {
                  const inWish = isInWishlist(p.id);
                  const effectivePrice = p.discountPrice || p.price;
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-[#E8D5CE] p-4 flex flex-col sm:flex-row items-center gap-5 hover:shadow-md transition-shadow relative"
                    >
                      <img
                        src={p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        className="w-full sm:w-36 aspect-square object-cover rounded-xl bg-[#FAF7F2] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="flex-1 space-y-1.5 text-center sm:text-left">
                        <span className="text-[10px] uppercase tracking-wider text-[#8C5D3D] font-medium">
                          {p.category} · {p.brand}
                        </span>
                        <Link to={`/product/${p.slug || p.id}`}>
                          <h3 className="text-base font-semibold text-stone-900 hover:text-[#8C5D3D]">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-stone-500 line-clamp-2">{p.description}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-semibold text-stone-800">{p.rating.toFixed(1)}</span>
                          <span className="text-stone-400">({p.reviews} verified reviews)</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center sm:items-end justify-between gap-3 shrink-0 sm:border-l sm:border-stone-100 sm:pl-5">
                        <div className="text-center sm:text-right">
                          <span className="text-lg font-bold text-stone-900 block">
                            Rs. {effectivePrice.toLocaleString()}
                          </span>
                          {p.discountPrice && (
                            <span className="text-xs text-stone-400 line-through">
                              Rs. {p.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="p-2 border border-stone-200 rounded-lg text-stone-500 hover:text-rose-600"
                          >
                            <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg border border-stone-300 bg-white text-stone-700 disabled:opacity-40"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold ${
                        currentPage === pageNum
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-white border border-stone-300 text-stone-700 hover:bg-[#EFE8DC]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg border border-stone-300 bg-white text-stone-700 disabled:opacity-40"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* MOBILE FILTER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg text-stone-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-stone-900 mb-2">Category</h4>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      handleCategorySelect(c);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-md ${
                      selectedCategory === c ? 'bg-[#EFE8DC] font-bold text-[#8C5D3D]' : 'text-stone-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
