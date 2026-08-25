import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/register', { username, email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/event-type');
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-[#0B0C10] rounded-2xl overflow-hidden border border-amber-900/40 shadow-2xl">
        <div className="p-10 flex flex-col justify-between bg-black/40 border-r border-amber-900/30">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">❖</div>
              <h1 className="text-sm font-serif text-amber-200 tracking-widest">FALKOM TAYYEB</h1>
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">CREATE YOUR <br /><span className="text-amber-400">ACCOUNT</span></h2>
            <p className="text-gray-400 text-xs leading-relaxed">Join Falkom Tayyeb and let's create extraordinary events together.</p>
          </div>
        </div>

        <div className="p-10 flex flex-col justify-center">
          <h3 className="text-xl font-serif text-amber-300 text-center mb-1">SIGN UP</h3>
          <p className="text-xs text-gray-400 text-center mb-6">Create your account to get started</p>

          {error && <div className="mb-4 p-2.5 rounded bg-red-950/50 border border-red-500/50 text-red-300 text-xs text-center">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs text-gray-300 block mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-amber-500/60" />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username" 
                  className="w-full bg-black/60 border border-amber-900/40 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-amber-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-amber-500/60" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full bg-black/60 border border-amber-900/40 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-amber-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-amber-500/60" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password" 
                  className="w-full bg-black/60 border border-amber-900/40 rounded-lg pl-10 pr-10 py-2 text-xs text-white focus:border-amber-500 outline-none" 
                />
                {showPassword ? (
                  <EyeOff className="w-4 h-4 absolute right-3 top-3 text-amber-400 cursor-pointer" onClick={() => setShowPassword(false)} />
                ) : (
                  <Eye className="w-4 h-4 absolute right-3 top-3 text-gray-500 cursor-pointer" onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs tracking-wider uppercase transition mt-4 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'CREATE ACCOUNT →'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account? <Link to="/login" className="text-amber-400 hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}