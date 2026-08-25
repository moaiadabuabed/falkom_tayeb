import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Star } from 'lucide-react';

export default function GalleryAndFeedbacks() {
  const [gallery, setGallery] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ comment_text: '', rating: 5 });

  useEffect(() => {
    API.get('/admin/gallery').then(res => setGallery(res.data || [])).catch(console.error);
    API.get('/admin/feedbacks').then(res => setFeedbacks(res.data || [])).catch(console.error);
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.USER_ID || user.user_id || user.id;

      if (!userId) {
        alert('يرجى تسجيل الدخول أولاً لإضافة تقييم');
        return;
      }

      await API.post('/feedbacks', { ...newFeedback, user_id: userId });
      alert('شكراً لك! تم إرسال تقييمك بنجاح');
      setNewFeedback({ comment_text: '', rating: 5 });
    } catch (err) {
      alert('حدث خطأ أثناء إرسال التقييم');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-white space-y-12">
      <section>
        <h2 className="text-xl font-bold text-amber-300 mb-6 border-b border-amber-900/40 pb-2">معرض الفعاليات (Gallery)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map(img => {
            const id = img.IMAGE_ID || img.image_id;
            const url = img.IMAGE_URL || img.image_url;
            const title = img.TITLE || img.title;

            return (
              <div key={id} className="group relative overflow-hidden rounded-xl border border-amber-900/40 h-48">
                <img src={url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <span className="text-amber-200 text-xs font-bold">{title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-amber-300 mb-4">آراء العملاء</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {feedbacks.map(f => {
              const id = f.FEEDBACK_ID || f.feedback_id;
              const uname = f.USERNAME || f.username;
              const rating = f.RATING || f.rating || 5;
              const text = f.COMMENT_TEXT || f.comment_text;

              return (
                <div key={id} className="bg-[#0B0C10] border border-amber-900/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-amber-400">{uname}</span>
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">{text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleFeedbackSubmit} className="bg-[#0B0C10] border border-amber-900/40 p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-bold text-amber-300">أضف تقييمك للخدمة</h3>
          <div>
            <label className="block text-xs mb-1">التقييم:</label>
            <select 
              value={newFeedback.rating} 
              onChange={e => setNewFeedback({...newFeedback, rating: Number(e.target.value)})}
              className="w-full bg-black border border-amber-900/40 p-2 rounded text-xs"
            >
              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} نجوم</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">التعليق:</label>
            <textarea 
              rows="3" 
              required
              value={newFeedback.comment_text}
              onChange={e => setNewFeedback({...newFeedback, comment_text: e.target.value})}
              className="w-full bg-black border border-amber-900/40 p-2 rounded text-xs"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-amber-500 text-black font-bold p-2 rounded text-xs">إرسال التقييم</button>
        </form>
      </section>
    </div>
  );
}