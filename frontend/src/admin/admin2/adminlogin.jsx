import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/admin-login', { email, password });
      const user = res.data.user;
      const token = res.data.token;

      const role = user.ROLE || user.role;
      if (role !== 'ADMIN') {
        setError('حسابك لا يمتلك صلاحيات المسؤول (ADMIN)');
        setLoading(false);
        return;
      }

      login(user, token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'بيانات دخول المسؤول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 text-white">
      <div className="max-w-md w-full bg-[#0B0C10] border border-amber-900/40 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-serif text-amber-200 uppercase tracking-wider">ADMIN ACCESS</h2>
          <p className="text-xs text-gray-400 mt-1">تسجيل الدخول إلى لوحة التحكم الإدارية</p>
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
              بريد المسؤول
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-amber-500/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@falkomtayyeb.com"
                className="w-full bg-[#050507] border border-amber-900/40 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-200/80 mb-2 uppercase tracking-wider">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-amber-500/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050507] border border-amber-900/40 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-lg text-xs tracking-widest uppercase transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          <Link to="/" className="text-amber-400 hover:underline">العودة إلى الصفحة الرئيسية</Link>
        </p>
      </div>
    </div>
  );
}