import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, ThumbsUp, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Review } from '../types';

export const Reviews: React.FC = () => {
  const { showToast } = useCart();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'service' | 'product'>('all');
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [name, setName] = useState('');
  const [city, setCity] = useState('Karachi');
  const [targetType, setTargetType] = useState<'service' | 'product'>('service');
  const [targetName, setTargetName] = useState('Signature Salon Experience');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getReviews()
      .then((res) => setReviews(res))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === 'all') return true;
    return r.targetType === selectedFilter;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setSubmitting(true);
    try {
      const newRev = await api.createReview({
        targetId: `custom-${Date.now()}`,
        targetType,
        targetName,
        userName: name,
        userCity: city,
        rating,
        comment,
        verifiedPurchase: true,
      });
      setReviews([newRev, ...reviews]);
      setName('');
      setComment('');
      showToast('Thank you! Your verified review has been posted.');
    } catch (err: any) {
      alert(err.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Verified Testimonials
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Client Reviews & Experiences
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Read genuine feedback from brides, styling guests, and skincare clients at Zoellas Beauty Salon in Tariq Road, Karachi.
        </p>
      </div>

      {/* Ratings Aggregate Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-5xl font-serif text-stone-900 font-normal">{averageRating}</span>
            <div className="flex items-center text-amber-500 text-xs justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">Average Score</p>
          </div>

          <div className="h-14 w-px bg-stone-200 hidden sm:block" />

          <div className="space-y-1">
            <h3 className="font-serif text-xl text-stone-900 font-normal">Trusted Across Karachi</h3>
            <p className="text-xs text-stone-500">
              Total of <strong>{reviews.length}</strong> verified reviews collected from bridal appointments and online orders.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              selectedFilter === 'all'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#EFE8DC]'
            }`}
          >
            All Feedback ({reviews.length})
          </button>
          <button
            onClick={() => setSelectedFilter('service')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              selectedFilter === 'service'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#EFE8DC]'
            }`}
          >
            Salon Services
          </button>
          <button
            onClick={() => setSelectedFilter('product')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              selectedFilter === 'product'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#FAF7F2] text-stone-700 hover:bg-[#EFE8DC]'
            }`}
          >
            Cosmetics Shop
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-[#E8D5CE] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-500 text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified Client
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-stone-900">{rev.userName}</h4>
                <p className="text-[11px] text-[#8C5D3D]">{rev.userCity || 'Karachi'} · {rev.targetName}</p>
              </div>
              <span className="text-[10px] text-stone-400">{rev.createdAt?.split('T')[0] || 'Recent'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
            Share Your Experience
          </span>
          <h2 className="font-serif text-2xl font-normal text-stone-900">Leave a Client Review</h2>
          <p className="text-xs text-stone-500">Your feedback helps us continuously elevate our salon artistry.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mahnoor Khan"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Karachi"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Feedback Category</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              >
                <option value="service">Salon Service / Appointment</option>
                <option value="product">Retail Beauty Product</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Service / Product Name</label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                placeholder="e.g. Barat Bridal Makeup"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Rating</label>
            <div className="flex gap-2">
              {[5, 4, 3, 2, 1].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setRating(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    rating === num
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-[#FAF7F2] text-stone-700 border-stone-200'
                  }`}
                >
                  {num} ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review Comments *</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience at Zoellas Beauty Salon..."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
          >
            {submitting ? 'Submitting Review...' : 'Publish Verified Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
