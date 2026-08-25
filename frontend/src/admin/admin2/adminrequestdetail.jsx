import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ArrowLeft, Check, X, Calendar, MapPin, User, Mail, Phone, Loader2, Save } from 'lucide-react';

export default function AdminRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/requests/${id}`);
      const data = res.data;
      setRequest(data);
      setRemarks(data.ADMIN_REMARKS || data.admin_remarks || '');
    } catch (err) {
      console.error('Failed to load request details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      setSaving(true);
      await API.patch(`/admin/requests/${id}/status`, { status, adminRemarks: remarks });
      setRequest(prev => ({ ...prev, STATUS: status, status, ADMIN_REMARKS: remarks }));
      alert(`تم تحديث حالة الطلب إلى: ${status}`);
    } catch (err) {
      alert('فشل في حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  const saveRemarks = async () => {
    try {
      setSaving(true);
      await API.patch(`/admin/requests/${id}/remarks`, { adminRemarks: remarks });
      alert('تم حفظ الملاحظات الداخلية بنجاح');
    } catch (err) {
      alert('فشل في حفظ الملاحظات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-amber-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-xs">جاري تحميل تفاصيل الطلب...</span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-white text-center space-y-4">
        <p className="text-sm text-gray-400">لم يتم العثور على الطلب المطلوب.</p>
        <button
          onClick={() => navigate('/admin')}
          className="border border-amber-500 text-amber-400 px-4 py-2 rounded text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> العودة إلى لوحة التحكم
        </button>
      </div>
    );
  }

  const reqStatus = request.STATUS || request.status || 'PENDING';

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white space-y-6">
      <button
        onClick={() => navigate('/admin')}
        className="text-amber-400 hover:underline text-xs flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> العودة إلى قائمة الطلبات
      </button>

      <div className="bg-[#0B0C10] border border-amber-900/40 p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-amber-900/30 pb-4">
          <h2 className="text-lg font-serif text-amber-200 uppercase">REQUEST DETAILS</h2>
          <span className={`px-3 py-1 rounded text-xs font-bold ${
            reqStatus === 'ACCEPTED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            reqStatus === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {reqStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-amber-900/20">
            <p className="flex items-center gap-2 text-gray-300"><User className="w-4 h-4 text-amber-400" /> <strong>اسم العميل:</strong> {request.USERNAME || request.username || request.FULL_NAME}</p>
            <p className="flex items-center gap-2 text-gray-300"><Mail className="w-4 h-4 text-amber-400" /> <strong>البريد الإلكتروني:</strong> {request.EMAIL || request.email}</p>
            <p className="flex items-center gap-2 text-gray-300"><Phone className="w-4 h-4 text-amber-400" /> <strong>رقم الهاتف:</strong> {request.PHONE || request.phone}</p>
          </div>
          <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-amber-900/20">
            <p className="flex items-center gap-2 text-gray-300"><Calendar className="w-4 h-4 text-amber-400" /> <strong>تاريخ المناسبة:</strong> {request.EVENT_DATE || request.event_date}</p>
            <p className="flex items-center gap-2 text-gray-300"><MapPin className="w-4 h-4 text-amber-400" /> <strong>الموقع:</strong> {request.LOCATION_NAME || request.location_name}</p>
            <p className="text-gray-300"><strong>نوع الفعالية / الباقة:</strong> {request.TYPE_NAME || request.type_name} / {request.PACKAGE_NAME || request.package_name}</p>
          </div>
        </div>

        {(request.SPECIAL_REQUIREMENTS || request.special_requirements) && (
          <div className="space-y-1">
            <h4 className="text-xs text-amber-400 font-bold">المتطلبات الخاصة:</h4>
            <p className="text-xs bg-black/50 p-3 rounded-lg border border-amber-900/30 text-gray-300">
              {request.SPECIAL_REQUIREMENTS || request.special_requirements}
            </p>
          </div>
        )}

        <div className="space-y-2 border-t border-amber-900/30 pt-4">
          <label className="block text-xs text-amber-200">ملاحظات الإدارة (internal only):</label>
          <textarea
            rows="3"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="أضف ملاحظات فريق العمل حول هذا الطلب..."
            className="w-full bg-black border border-amber-900/40 p-3 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={saveRemarks}
            disabled={saving}
            className="bg-amber-500/10 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded text-xs hover:bg-amber-500/20 transition flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" /> حفظ الملاحظات
          </button>
        </div>

        <div className="flex justify-end gap-3 border-t border-amber-900/30 pt-4">
          <button
            onClick={() => handleStatusChange('REJECTED')}
            disabled={saving}
            className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
          >
            <X className="w-4 h-4" /> رفض الطلب
          </button>
          <button
            onClick={() => handleStatusChange('ACCEPTED')}
            disabled={saving}
            className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Check className="w-4 h-4" /> قبول الطلب
          </button>
        </div>
      </div>
    </div>
  );
}