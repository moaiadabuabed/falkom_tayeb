import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-white flex flex-col justify-between font-sans">
      {!isAdminRoute && (
        <header className="border-b border-amber-900/30 px-10 py-5 flex justify-between items-center bg-[#0B0C10]/80 backdrop-blur-md sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">❖</div>
            <div>
              <h1 className="text-xl font-serif-luxury tracking-widest text-amber-200 uppercase font-semibold">FALKOM TAYYEB</h1>
              <p className="text-[9px] tracking-[0.2em] text-amber-500/80 uppercase">EVENTS . EXHIBITION . CONFERENCE</p>
            </div>
          </Link>

          <nav className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-gray-300 items-center">
            <Link to="/" className="hover:text-amber-400 transition">HOME</Link>
            <Link to="/services" className="hover:text-amber-400 transition">SERVICES</Link>
            <Link to="/gallery" className="hover:text-amber-400 transition">GALLERY & FEEDBACKS</Link>
            <Link to="/packages" className="hover:text-amber-400 transition">PACKAGES</Link>
            <Link to="/contact" className="hover:text-amber-400 transition">CONTACT</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/book-event')}
              className="border border-amber-500/60 text-amber-300 hover:bg-amber-500/10 px-5 py-2 text-xs tracking-wider uppercase transition font-semibold"
            >
              REQUEST AN EVENT →
            </button>

            {token && user ? (
              <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                <div className="flex items-center gap-1.5 text-amber-200 text-xs" title={user.username}>
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="capitalize font-medium">{user.username || 'User'}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 p-1 transition border-l border-amber-500/20 ml-1 pl-2"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-xs text-gray-300 hover:text-amber-400 tracking-widest uppercase px-3 py-2 transition font-medium"
              >
                LOG IN
              </Link>
            )}
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {!isAdminRoute && (
        <footer className="border-t border-amber-900/30 bg-[#050507] py-6 px-10 text-xs text-gray-400">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-amber-200/80 text-[11px]">PHONE</p>
                <p>+971 50 664 2554</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-amber-200/80 text-[11px]">EMAIL</p>
                <p>falkomtayeb2024@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-amber-200/80 text-[11px]">LOCATION</p>
                <p>Abu Dhabi, UAE</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-amber-200/80 text-[11px]">WORKING HOURS</p>
                <p>Every day 24/7</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 pt-4 border-t border-amber-900/20 text-[10px] tracking-[0.3em] text-amber-500/60 uppercase">
            ✦ WE PLAN. WE CREATE. YOU CELEBRATE. ✦
          </div>
        </footer>
      )}
    </div>
  );
}