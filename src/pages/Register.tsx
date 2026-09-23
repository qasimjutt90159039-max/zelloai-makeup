import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('0311-');
  const [city, setCity] = useState('Karachi');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password) {
        throw new Error('Please fill in all required fields');
      }
      await register({ name, email, password, phone, city });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 bg-[#FAF7F2]">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 bg-[#EFE8DC] text-[#8C5D3D] rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-[#E8D5CE]">
          <Sparkles className="w-7 h-7" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Zoellas Beauty Salon
        </span>
        <h1 className="font-serif text-3xl font-normal text-stone-900">
          Create Your Account
        </h1>
        <p className="text-xs text-stone-500">
          Unlock instant booking management, exclusive discounts, and order tracking.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sana Malik"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0311-1802834"
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating...' : 'Register Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          Already registered?{' '}
          <Link to="/login" className="text-[#8C5D3D] font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
