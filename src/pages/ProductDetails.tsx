import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Check, 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  User,
  Minus,
  Plus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Product, Review } from '../types';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, showToast, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'usage' | 'reviews'>('desc');
  const [loading, setLoading] = useState<boolean>(true);

  // Review Form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewCity] = useState('Karachi');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await api.getProductById(id);
        setProduct(prod);
        setSelectedImage(prod.images && prod.images.length > 0 ? prod.images[0] : prod.image);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0].name);
        }
        
        // Fetch reviews
        const revs = await api.getReviews(prod.id);
        setReviews(revs);

        // Fetch related products
        const allProds = await api.getProducts({ category: prod.category });
        setRelatedProducts(allProds.filter((p) => p.id !== prod.id).slice(0, 4));
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-24 text-stone-500">Loading beauty product...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="font-serif text-2xl text-stone-900">Product Not Found</h2>
        <Link to="/shop" className="inline-block text-xs font-semibold text-[#8C5D3D] underline">
          Back to boutique shop
        </Link>
      </div>
    );
  }

  const effectivePrice = product.discountPrice || product.price;
  const inWish = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) return;

    setSubmittingReview(true);
    try {
      const newRev = await api.createReview({
        targetId: product.id,
        targetType: 'product',
        targetName: product.name,
        userName: reviewerName,
        userCity: reviewerCity,
        rating: reviewerRating,
        comment: reviewerComment,
        verifiedPurchase: true,
      });
      setReviews([newRev, ...reviews]);
      setReviewerName('');
      setReviewerComment('');
      showToast('Thank you! Your verified review has been published.');
    } catch (err: any) {
      alert('Could not submit review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/92${BUSINESS_INFO.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
    `Hi Zoellas Beauty Salon! I'm asking about ${product.name} (SKU: ${product.sku || 'N/A'}, Price: Rs. ${effectivePrice.toLocaleString()}). Is it in stock at your Tariq Road studio?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-[#FAF7F2]">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to="/shop" className="hover:text-stone-900">Shop</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-stone-900">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-[#E8D5CE] shadow-sm relative">
            <img
              src={selectedImage || product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {product.discountPrice && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Sale
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    selectedImage === img ? 'border-[#8C5D3D]' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
                {product.brand} · {product.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-stone-200/50 text-stone-500 transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2 rounded-full hover:bg-stone-200/50 text-stone-500 transition-colors"
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-800">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-stone-400">({reviews.length} verified reviews)</span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-emerald-700 font-medium">In Stock ({product.stock} units)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8D5CE] shadow-xs flex items-baseline justify-between">
            <div>
              <span className="text-xs text-stone-400 block mb-0.5">Karachi Retail Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif text-stone-900 font-normal">
                  Rs. {effectivePrice.toLocaleString()}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700">Tax Included</span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                Select Shade / Option: <span className="text-[#8C5D3D]">{selectedVariant}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      selectedVariant === v.name
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-stone-100 text-stone-600 rounded-lg"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2 hover:bg-stone-100 text-stone-600 rounded-lg"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(product, quantity, selectedVariant);
                  setIsCartOpen(true);
                }}
                className="flex-1 py-3 px-6 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                <span>Add to Bag</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 px-4 bg-[#8C5D3D] hover:bg-[#72482E] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors text-center"
              >
                Instant Buy Now
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-5 rounded-xl text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Delivery & Authenticity Highlights */}
          <div className="p-4 rounded-xl bg-white border border-[#E8D5CE] divide-y divide-stone-100 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-3 pb-2">
              <Truck className="w-4 h-4 text-[#8C5D3D] shrink-0" />
              <span>Standard Karachi Delivery in 1–3 business days. Free shipping over Rs. 4,000.</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#8C5D3D] shrink-0" />
              <span>100% Genuine product formulated for professional salon results.</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section: Description, Ingredients, How to Use, Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs space-y-8">
        <div className="flex border-b border-stone-200 gap-6 text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'desc' ? 'border-[#8C5D3D] text-[#8C5D3D]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'ingredients' ? 'border-[#8C5D3D] text-[#8C5D3D]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'usage' ? 'border-[#8C5D3D] text-[#8C5D3D]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            How to Use
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'reviews' ? 'border-[#8C5D3D] text-[#8C5D3D]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Client Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
            <p>{product.description}</p>
            {product.features && product.features.length > 0 && (
              <div className="pt-2 space-y-2">
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-xs">Highlights</h4>
                <ul className="space-y-1.5">
                  {product.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Ingredients */}
        {activeTab === 'ingredients' && (
          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-xs">Formula & Components</h4>
            <p>
              {product.ingredients || 'Aqua, Organic Botanical Extracts, Hydrolyzed Keratin, Hyaluronic Acid, Vitamin E, Glycerin, Rosa Damascena Flower Water, Phenoxyethanol.'}
            </p>
          </div>
        )}

        {/* Tab 3: Usage */}
        {activeTab === 'usage' && (
          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-xs">Application Instructions</h4>
            <p>
              {product.howToUse || 'Apply evenly to clean skin or damp hair. Follow standard salon protocol for optimal results. Suitable for daily use.'}
            </p>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-stone-500">No reviews yet for this product. Be the first to share your thoughts!</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D5CE] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-stone-900">{r.userName}</span>
                        <span className="text-[10px] text-stone-400">({r.userCity || 'Karachi'})</span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600">{r.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a review form */}
            <div className="border-t border-stone-200 pt-6 max-w-xl space-y-4">
              <h4 className="font-serif text-lg text-stone-900">Add a Verified Review</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Ayesha Siddiqui"
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      value={reviewerCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Rating</label>
                  <select
                    value={reviewerRating}
                    onChange={(e) => setReviewerRating(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value={5}>5 Stars - Outstanding Quality</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Below Expectations</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder="Share how this product felt, texture, effectiveness..."
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-normal text-stone-900">Complementary Beauty Picks</h3>
            <Link to="/shop" className="text-xs font-semibold text-[#8C5D3D] hover:underline">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#E8D5CE] p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <Link to={`/product/${p.slug || p.id}`} className="block overflow-hidden rounded-xl bg-[#FAF7F2] mb-3">
                    <img
                      src={p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                      alt={p.name}
                      className="w-full aspect-square object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </Link>
                  <span className="text-[10px] uppercase text-[#8C5D3D] font-medium">{p.category}</span>
                  <Link to={`/product/${p.slug || p.id}`}>
                    <h4 className="text-xs font-semibold text-stone-900 mt-1 line-clamp-1 hover:text-[#8C5D3D]">
                      {p.name}
                    </h4>
                  </Link>
                </div>

                <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    Rs. {(p.discountPrice || p.price).toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="p-1.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-lg"
                    title="Add to bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
