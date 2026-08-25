import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {API} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      const user = res.data.user;
      const token = res.data.token;

      login(user, token);

      const userRole = user.ROLE || user.role;
      if (userRole === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/event-details', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'بيانات الدخول غير صحيحة، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 text-white">
      <div className="max-w-md w-full bg-[#0B0C10] border border-amber-900/40 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-serif text-amber-200 uppercase tracking-wider">LOG IN</h2>
          <p className="text-xs text-gray-400 mt-1">مرحباً بك مجدداً في فالكم طيب</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-amber-200/80 mb-2 uppercase tracking-wider">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#050507] border border-amber-900/40 rounded-lg px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-amber-200/80 uppercase tracking-wider">
                كلمة المرور
              </label>
              <Link to="/forgot-password" className="text-[11px] text-amber-400 hover:underline transition">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#050507] border border-amber-900/40 rounded-lg px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-lg text-xs tracking-widest uppercase transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          ليس لديك حساب؟{' '}
          <Link to="/signup" className="text-amber-400 hover:underline font-medium">
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
}