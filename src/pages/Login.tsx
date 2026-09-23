import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0311-');
  const [city, setCity] = useState('Karachi');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          throw new Error('Please fill in all required fields');
        }
        await register({ name, email, password, phone, city });
      } else {
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }
        await login(email, password);
      }
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'admin' | 'customer') => {
    switchDemoUser(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 bg-[#FAF7F2]">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 bg-[#EFE8DC] text-[#8C5D3D] rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-[#E8D5CE]">
          <Sparkles className="w-7 h-7" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Zoellas Beauty Salon
        </span>
        <h1 className="font-serif text-3xl font-normal text-stone-900">
          {isRegister ? 'Join Zoellas Club' : 'Sign in to Account'}
        </h1>
        <p className="text-xs text-stone-500">
          Manage your salon appointments, track cosmetics orders, and save your beauty wishlist.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-6">
        
        {/* Toggle between Login and Register */}
        <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] rounded-xl border border-stone-200">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              !isRegister ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              isRegister ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
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
                  required={isRegister}
                />
              </div>
            </div>
          )}

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

          {isRegister && (
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
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block text-center">
            Instant Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-2 px-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-medium hover:bg-[#FAF7F2] transition-colors"
            >
              Demo Client
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-3 rounded-xl border border-[#8C5D3D] text-[#8C5D3D] text-xs font-semibold hover:bg-[#EFE8DC] transition-colors"
            >
              Salon Admin
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
