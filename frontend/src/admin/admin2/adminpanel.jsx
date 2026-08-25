import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Image as ImageIcon, Sparkles, Package, Mail, Users, LogOut, Search, Trash2, Loader2 } from 'lucide-react';
import RequestsManagement from './RequestsManagement';
import ManagePackages from './ManagePackages';

function AdminUsersSection() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت تأكد من رغبتك في حذف هذا المستخدم؟')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => (u.USER_ID || u.id) !== id));
    } catch (err) {
      alert('فشل حذف المستخدم');
    }
  };

  const filtered = users.filter(u => 
    `${u.USERNAME || u.username} ${u.EMAIL || u.email}`.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div className="text-center py-8 text-amber-400 text-xs flex justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> جاري تحميل المستخدمين...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-[#050507] p-3 rounded-lg border border-amber-900/40">
        <span className="text-xs text-amber-400 font-bold">{filtered.length} مستخدم</span>
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
          <input 
            type="text"
            placeholder="بحث..." 
            value={query} 
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-black border border-amber-900/40 rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(u => {
          const id = u.USER_ID || u.id;
          const name = u.USERNAME || u.username || 'بدون اسم';
          const email = u.EMAIL || u.email;
          const role = u.ROLE || u.role;

          return (
            <div key={id} className="bg-[#0B0C10] border border-amber-900/40 p-3 rounded-lg flex justify-between items-center text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold uppercase">
                  {name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{name}</h4>
                  <p className="text-gray-400 text-[11px]">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30">{role}</span>
                <button onClick={() => handleDelete(id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminContactSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/contacts');
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-amber-400 text-xs flex justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> جاري تحميل الرسائل...</div>;

  return (
    <div className="space-y-3">
      {messages.length === 0 ? (
        <div className="text-gray-500 text-xs text-center py-6">لا توجد رسائل جديدة.</div>
      ) : (
        messages.map((m) => {
          const id = m.CONTACT_ID || m.id;
          return (
            <div key={id} className="bg-[#0B0C10] border border-amber-900/40 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-amber-900/20 pb-2">
                <span className="font-bold text-amber-300">{m.NAME || m.name}</span>
                <span className="text-gray-500 text-[10px]">{m.EMAIL || m.email}</span>
              </div>
              <p className="text-gray-300">{m.MESSAGE || m.message}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

const ADMIN_TABS = [
  { id: 'requests', label: 'REQUESTS', icon: ClipboardList, component: RequestsManagement },
  { id: 'packages', label: 'PACKAGES', icon: Package, component: ManagePackages },
  { id: 'contact', label: 'CONTACT US', icon: Mail, component: AdminContactSection },
  { id: 'users', label: 'USERS', icon: Users, component: AdminUsersSection },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const CurrentComponent = ADMIN_TABS.find(t => t.id === activeTab)?.component || RequestsManagement;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/40 pb-6">
        <div>
          <p className="text-xs text-amber-400 uppercase tracking-widest">ADMIN PANEL</p>
          <h1 className="text-3xl font-serif text-white">CONTROL <b className="text-amber-400">CENTER</b></h1>
        </div>
        <button
          onClick={handleLogout}
          className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded text-xs flex items-center gap-2 transition font-bold"
        >
          <LogOut className="w-4 h-4" /> LOG OUT
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-amber-900/30 pb-3">
        {ADMIN_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                  : 'bg-[#0B0C10] text-gray-400 border border-amber-900/40 hover:text-amber-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-[#050507] border border-amber-900/40 p-6 rounded-2xl shadow-xl min-h-[400px]">
        <CurrentComponent />
      </div>
    </div>
  );
}