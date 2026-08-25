import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function EventBooking() {
  const [types, setTypes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [form, setForm] = useState({
    event_type_id: '',
    package_id: '',
    event_date: '',
    location_name: '',
    special_requirements: ''
  });

  useEffect(() => {
    API.get('/events/types').then(res => setTypes(res.data || [])).catch(console.error);
    API.get('/admin/packages').then(res => setPackages(res.data || [])).catch(console.error);
    API.get('/events/booked-dates').then(res => setBookedDates(res.data || [])).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bookedDates.includes(form.event_date)) {
      alert('هذا التاريخ محجوز مسبقاً، يرجى اختيار تاريخ آخر');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.USER_ID || user.user_id || user.id;

      if (!userId) {
        alert('يرجى تسجيل الدخول أولاً لإرسال الطلب');
        return;
      }

      await API.post('/events/request', { ...form, user_id: userId });
      alert('تم تقديم الطلب بنجاح!');
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ أثناء تقديم الطلب');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-[#0B0C10] p-6 rounded-xl border border-amber-900/40 text-white space-y-4 my-8">
      <h2 className="text-amber-400 text-lg font-bold">تقديم طلب حجز جديد</h2>

      <div>
        <label className="block text-xs mb-1">نوع الفعالية</label>
        <select 
          required
          onChange={e => setForm({...form, event_type_id: e.target.value})}
          className="w-full bg-black border border-amber-900/40 p-2 rounded text-xs"
        >
          <option value="">اختر النوع</option>
          {types.map(t => {
            const id = t.EVENT_TYPE_ID || t.event_type_id;
            const name = t.TYPE_NAME || t.type_name;
            return <option key={id} value={id}>{name}</option>;
          })}
        </select>
      </div>

      <div>
        <label className="block text-xs mb-1">الباقة (اختياري)</label>
        <select 
          onChange={e => setForm({...form, package_id: e.target.value})}
          className="w-full bg-black border border-amber-900/40 p-2 rounded text-xs"
        >
          <option value="">تخصيص بدون باقة</option>
          {packages.map(p => {
            const id = p.PACKAGE_ID || p.package_id;
            const name = p.PACKAGE_NAME || p.package_name;
            return <option key={id} value={id}>{name}</option>;
          })}
        </select>
      </div>

      <div>
        <label className="block text-xs mb-1">تاريخ الفعالية</label>
        <input 
          type="date" 
          required
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setForm({...form, event_date: e.target.value})}
          className="w-full bg-black border border-amber-900/40 p-2 rounded text-xs"
        />
      </div>

      <div>
        <label className="block text-xs mb-1">موقع الفعالية</label>
        <input 
          type="text" 
          required
          placeholder="مثال: قاعة الفردوس - عمان"
          onChange={e => setForm({...form, location_name: e.target.value})}
          className="w-full bg-black border border-amber-900/40 p-2 rounded text-xs"
        />
      </div>

      <div>
        <label className="block text-xs mb-1">متطلبات خاصة</label>
        <textarea 
          rows="3"
          onChange={e => setForm({...form, special_requirements: e.target.value})}
          className="w-full bg-black border border-amber-900/40 p-2 rounded text-xs"
        ></textarea>
      </div>

      <button type="submit" className="w-full bg-amber-500 text-black font-bold p-2 rounded text-xs hover:bg-amber-400 transition">إرسال الطلب</button>
    </form>
  );
}