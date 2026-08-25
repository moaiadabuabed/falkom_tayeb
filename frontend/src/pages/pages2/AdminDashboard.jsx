import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Package, Star, Image, Trash2, CheckCircle, XCircle, Plus, Edit, Save, X } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('packages');

  const [packages, setPackages] = useState([]);
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: '', features: '' });

  const [feedbacks, setFeedbacks] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');

  useEffect(() => {
    fetchPackages();
    fetchFeedbacks();
    fetchGallery();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await API.get('/admin/packages');
      setPackages(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/packages', {
        package_name: pkgName,
        price: pkgPrice ? parseFloat(pkgPrice) : null,
        features: pkgFeatures,
      });
      alert('تمت إضافة الباقة بنجاح');
      setPkgName(''); setPkgPrice(''); setPkgFeatures('');
      fetchPackages();
    } catch (err) {
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  const startEditPackage = (pkg) => {
    const pkgId = pkg.PACKAGE_ID || pkg.package_id;
    const pkgN = pkg.PACKAGE_NAME || pkg.package_name;
    const pkgP = pkg.PRICE || pkg.price || '';
    const pkgF = pkg.FEATURES || pkg.features || '';

    setEditingPkgId(pkgId);
    setEditFormData({ name: pkgN, price: pkgP, features: pkgF });
  };

  const handleUpdatePackage = async (id) => {
    try {
      await API.put(`/admin/packages/${id}`, {
        package_name: editFormData.name,
        price: editFormData.price ? parseFloat(editFormData.price) : null,
        features: editFormData.features
      });
      alert('تم تحديث الباقة بنجاح');
      setEditingPkgId(null);
      fetchPackages();
    } catch (err) {
      alert('حدث خطأ أثناء التحديث');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('هل أنت تأكد من حذف هذه الباقة؟')) return;
    try {
      await API.delete(`/admin/packages/${id}`);
      fetchPackages();
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await API.get('/admin/gallery');
      setGallery(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!imageUrl) return alert('يرجى أدخال رابط الصورة');
    try {
      await API.post('/admin/gallery', {
        image_url: imageUrl,
        title: imageTitle
      });
      alert('تمت إضافة الصورة بنجاح');
      setImageUrl(''); setImageTitle('');
      fetchGallery();
    } catch (err) {
      alert('حدث خطأ أثناء إضافة الصورة');
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('هل أنت تأكد من حذف هذه الصورة؟')) return;
    try {
      await API.delete(`/admin/gallery/${id}`);
      fetchGallery();
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await API.get('/admin/feedbacks');
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeaturedFeedback = async (id, currentStatus) => {
    try {
      await API.patch(`/admin/feedbacks/${id}/featured`, { is_featured: currentStatus === 1 ? 0 : 1 });
      fetchFeedbacks();
    } catch (err) {
      alert('فشل في تعديل الحالة');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('هل أنت تأكد من الحذف؟')) return;
    try {
      await API.delete(`/admin/feedbacks/${id}`);
      fetchFeedbacks();
    } catch (err) {
      alert('فشل في الحذف');
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white p-8">
      <h1 className="text-2xl font-serif text-amber-400 mb-8">لوحة تحكم المسؤول (Admin Dashboard)</h1>

      <div className="flex gap-4 border-b border-amber-900/40 mb-8 pb-4">
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'packages' ? 'bg-amber-500 text-black' : 'bg-[#0B0C10] text-gray-400'}`}
        >
          <Package className="w-4 h-4" /> إدارة الباقات
        </button>
        <button
          onClick={() => setActiveTab('feedbacks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'feedbacks' ? 'bg-amber-500 text-black' : 'bg-[#0B0C10] text-gray-400'}`}
        >
          <Star className="w-4 h-4" /> آراء العملاء
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'gallery' ? 'bg-amber-500 text-black' : 'bg-[#0B0C10] text-gray-400'}`}
        >
          <Image className="w-4 h-4" /> معرض الصور
        </button>
      </div>

      {activeTab === 'packages' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#0B0C10] p-6 rounded-xl border border-amber-900/40 h-fit">
            <h2 className="text-lg text-amber-200 mb-4 font-bold">إضافة باقة جديدة</h2>
            <form onSubmit={handleAddPackage} className="space-y-4">
              <input
                type="text"
                placeholder="اسم الباقة"
                required
                value={pkgName}
                onChange={(e) => setPkgName(e.target.value)}
                className="w-full bg-[#050507] border border-amber-900/40 p-3 rounded-lg text-xs"
              />
              <input
                type="number"
                placeholder="السعر (اختياري)"
                value={pkgPrice}
                onChange={(e) => setPkgPrice(e.target.value)}
                className="w-full bg-[#050507] border border-amber-900/40 p-3 rounded-lg text-xs"
              />
              <textarea
                placeholder="المزايا والتفاصيل"
                value={pkgFeatures}
                onChange={(e) => setPkgFeatures(e.target.value)}
                className="w-full bg-[#050507] border border-amber-900/40 p-3 rounded-lg text-xs"
              />
              <button type="submit" className="bg-amber-500 text-black font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> حفظ الباقة
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg text-amber-200 font-bold">الباقات المتاحة حالياً</h2>
            {packages.map((pkg) => {
              const pkgId = pkg.PACKAGE_ID || pkg.package_id;
              const pkgN = pkg.PACKAGE_NAME || pkg.package_name;
              const pkgP = pkg.PRICE || pkg.price;
              const pkgF = pkg.FEATURES || pkg.features;

              return (
                <div key={pkgId} className="bg-[#0B0C10] p-4 rounded-xl border border-amber-900/40">
                  {editingPkgId === pkgId ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full bg-[#050507] border border-amber-900/40 p-2 rounded text-xs"
                      />
                      <input
                        type="number"
                        value={editFormData.price}
                        onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                        className="w-full bg-[#050507] border border-amber-900/40 p-2 rounded text-xs"
                        placeholder="السعر"
                      />
                      <textarea
                        value={editFormData.features}
                        onChange={(e) => setEditFormData({ ...editFormData, features: e.target.value })}
                        className="w-full bg-[#050507] border border-amber-900/40 p-2 rounded text-xs"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdatePackage(pkgId)} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1">
                          <Save className="w-3.5 h-3.5" /> حفظ
                        </button>
                        <button onClick={() => setEditingPkgId(null)} className="bg-gray-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-amber-400 font-bold text-sm">{pkgN}</h3>
                        <p className="text-xs text-amber-200/70 mt-1">{pkgP ? `${pkgP} JOD` : 'السعر غير محدد'}</p>
                        <p className="text-xs text-gray-300 mt-2">{pkgF}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEditPackage(pkg)} className="text-amber-400 hover:text-amber-300 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeletePackage(pkgId)} className="text-red-400 hover:text-red-300 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'feedbacks' && (
        <div className="space-y-4">
          <h2 className="text-lg text-amber-200 mb-4">مراجعة الآراء والتحكم في إظهارها</h2>
          <div className="grid gap-4">
            {feedbacks.map((item) => {
              const fId = item.FEEDBACK_ID || item.feedback_id;
              const uName = item.USERNAME || item.username;
              const text = item.COMMENT_TEXT || item.comment_text;
              const isFeat = item.IS_FEATURED || item.is_featured;

              return (
                <div key={fId} className="bg-[#0B0C10] p-4 rounded-xl border border-amber-900/40 flex justify-between items-center">
                  <div>
                    <h4 className="text-amber-400 font-bold text-sm">{uName}</h4>
                    <p className="text-xs text-gray-300 mt-1">{text}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleFeaturedFeedback(fId, isFeat)}
                      className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${isFeat ? 'border-green-500 text-green-400' : 'border-gray-600 text-gray-400'}`}
                    >
                      {isFeat ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isFeat ? 'معروض للعامة' : 'مخفي'}
                    </button>
                    <button onClick={() => handleDeleteFeedback(fId)} className="text-red-400 hover:text-red-300 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#0B0C10] p-6 rounded-xl border border-amber-900/40 h-fit md:col-span-1">
            <h2 className="text-lg text-amber-200 mb-4 font-bold">إضافة صورة جديدة للمعرض</h2>
            <form onSubmit={handleAddImage} className="space-y-4">
              <input
                type="text"
                placeholder="عنوان أو وصف مختصر"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                className="w-full bg-[#050507] border border-amber-900/40 p-3 rounded-lg text-xs"
              />
              <input
                type="url"
                placeholder="رابط الصورة (Image URL)"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#050507] border border-amber-900/40 p-3 rounded-lg text-xs"
              />
              <button type="submit" className="bg-amber-500 text-black font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> إضافة إلى قاعدة البيانات
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg text-amber-200 font-bold">صور المعرض الحالية</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((img) => {
                const imgId = img.IMAGE_ID || img.image_id;
                const imgUrl = img.IMAGE_URL || img.image_url;
                const imgT = img.TITLE || img.title;

                return (
                  <div key={imgId} className="bg-[#0B0C10] border border-amber-900/40 rounded-xl overflow-hidden relative group">
                    <img src={imgUrl} alt={imgT} className="w-full h-32 object-cover" />
                    <div className="p-3 flex justify-between items-center bg-[#0B0C10]">
                      <span className="text-xs text-gray-300 truncate">{imgT || 'بدون عنوان'}</span>
                      <button onClick={() => handleDeleteImage(imgId)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}