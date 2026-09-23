import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowLeft, Calendar, Share2, Sparkles, User, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { BlogPost } from '../types';

export const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { openAppointmentModal, showToast } = useCart();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getBlogs()
        .then((list) => {
          const found = list.find((p) => p.id === id || p.slug === id);
          if (found) {
            setPost(found);
          } else if (list.length > 0) {
            setPost(list[0]);
          }
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-24 text-stone-500">Loading article...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="font-serif text-2xl text-stone-900">Article Not Found</h2>
        <Link to="/blog" className="text-xs font-semibold text-[#8C5D3D] underline">
          Return to beauty journal
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#FAF7F2]">
      {/* Back button */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Post Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
            {post.category}
          </span>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-stone-200/50 text-stone-500 transition-colors"
            title="Share article"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-stone-500 pt-1 border-b border-stone-200 pb-4">
          <span>By {post.author || 'Zoellas Editorial Team'}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>
      </header>

      {/* Hero Visual */}
      <div className="aspect-16/9 rounded-3xl overflow-hidden shadow-sm bg-white border border-[#E8D5CE]">
        <img
          src={post.image || post.featuredImage || 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
        <p className="font-serif text-base sm:text-lg text-stone-900 italic leading-relaxed border-l-4 border-[#8C5D3D] pl-4">
          "{post.excerpt}"
        </p>

        <div className="space-y-4">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] bg-[#FAF7F2] text-stone-600 px-3 py-1 rounded-full border border-stone-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* In-Article Booking Banner */}
      <div className="bg-[#1A1A1A] text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
            Tariq Road, Karachi Studio
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-normal">
            Ready to Try This Treatment?
          </h3>
          <p className="text-xs text-stone-400">
            Book an appointment with our master stylists at Zoellas Beauty Salon.
          </p>
        </div>

        <button
          onClick={() => openAppointmentModal()}
          className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#b0936b] text-stone-900 font-semibold text-xs rounded-xl uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>
    </article>
  );
};
