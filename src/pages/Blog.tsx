import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, BookOpen, Search } from 'lucide-react';
import { api } from '../services/api';
import { BlogPost } from '../types';

export const Blog: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogs()
      .then((res) => setPosts(res))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Hair Care', 'Skin Care', 'Bridal', 'Nail Art', 'Salon Guides'];

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== 'All' && post.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = (post.excerpt || post.summary || '').toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Salon Editorial & Advice
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Beauty Tips & Haircare Journal
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Expert recommendations, pre-wedding skin regimens, keratin aftercare, and seasonal beauty guides curated by Zoellas Beauty Salon in Karachi.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8D5CE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === c
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-[#EFE8DC]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading beauty journal...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <h3 className="font-serif text-xl text-stone-800">No articles found</h3>
          <p className="text-xs text-stone-500 mt-1">Please try another category or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-[#E8D5CE] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden relative">
                  <img
                    src={post.image || post.featuredImage || 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-[#1A1A1A]/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-stone-400">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link to={`/blog/${post.slug || post.id}`}>
                    <h2 className="font-serif text-xl font-normal text-stone-900 hover:text-[#8C5D3D] transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/blog/${post.slug || post.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C5D3D] hover:underline"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
