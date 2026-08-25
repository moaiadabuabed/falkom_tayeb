import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CheckCircle, XCircle, Calendar, MapPin, User, Mail, Phone } from 'lucide-react';

export default function RequestsManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/requests');
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/admin/requests/${id}/status`, { status });
      setRequests(requests.map(r => (r.REQUEST_ID === id || r.request_id === id) ? { ...r, STATUS: status, status } : r));
      alert(`تم ${status === 'ACCEPTED' ? 'قبول' : 'رفض'} الطلب بنجاح`);
    } catch (err) {
      alert('فشل في تحديث حالة الطلب');
    }
  };

  if (loading) return <div className="text-center py-10 text-amber-400">جاري تحميل الطلبات...</div>;

  return (
    <div className="w-full text-white">
      <h3 className="text-amber-400 font-bold mb-6 text-base">إدارة طلبات الحجز (Requests Management)</h3>
      
      <div className="space-y-4">
        {requests.map((req) => {
          const id = req.REQUEST_ID || req.request_id;
          const status = req.STATUS || req.status;
          return (
            <div key={id} className="bg-[#0B0C10] border border-amber-900/40 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-amber-300 text-sm flex items-center gap-1">
                    <User className="w-4 h-4" /> {req.USERNAME || req.username}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-400">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {req.EMAIL || req.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {req.PHONE || req.phone}</span>
                  <span className="flex items-center gap-1 text-amber-200"><Calendar className="w-3.5 h-3.5" /> {req.EVENT_DATE || req.event_date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.LOCATION_NAME || req.location_name}</span>
                </div>

                <p className="text-gray-300 mt-1">
                  <strong>النوع/الباقة:</strong> {req.TYPE_NAME || req.type_name || 'عام'} - {req.PACKAGE_NAME || req.package_name || 'تخصيص حر'}
                </p>
                {(req.SPECIAL_REQUIREMENTS || req.special_requirements) && (
                  <p className="text-gray-400 italic bg-black/40 p-2 rounded border border-amber-900/20">
                    "{req.SPECIAL_REQUIREMENTS || req.special_requirements}"
                  </p>
                )}
              </div>

              {status === 'PENDING' && (
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleStatusChange(id, 'ACCEPTED')}
                    className="flex-1 md:flex-initial bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" /> قبول
                  </button>
                  <button
                    onClick={() => handleStatusChange(id, 'REJECTED')}
                    className="flex-1 md:flex-initial bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> رفض
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}