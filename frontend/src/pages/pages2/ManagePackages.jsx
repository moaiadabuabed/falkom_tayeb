import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Edit2, Plus, Trash2, Package, Loader2 } from 'lucide-react';

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [editingPkg, setEditingPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/packages');
      
      const formatted = (res.data || []).map((pkg) => {
        const id = pkg.PACKAGE_ID || pkg.package_id || pkg.id;
        const name = pkg.PACKAGE_NAME || pkg.package_name || pkg.name;
        const price = pkg.PRICE !== undefined ? pkg.PRICE : pkg.price;
        const description = pkg.DESCRIPTION || pkg.description || '';
        const rawFeatures = pkg.FEATURES || pkg.features;

        let parsedFeatures = [];
        if (Array.isArray(rawFeatures)) {
          parsedFeatures = rawFeatures;
        } else if (typeof rawFeatures === 'string' && rawFeatures.trim()) {
          try {
            parsedFeatures = JSON.parse(rawFeatures);
          } catch {
            parsedFeatures = rawFeatures.split('\n');
          }
        }

        return { id, name, price, description, features: parsedFeatures };
      });

      setPackages(formatted);
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (pkg) => {
    setEditingPkg({ ...pkg, features: [...pkg.features] });
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...editingPkg.features];
    updatedFeatures[index] = value;
    setEditingPkg({ ...editingPkg, features: updatedFeatures });
  };

  const addFeature = () => {
    setEditingPkg({ ...editingPkg, features: [...editingPkg.features, ''] });
  };

  const removeFeature = (index) => {
    const updatedFeatures = editingPkg.features.filter((_, i) => i !== index);
    setEditingPkg({ ...editingPkg, features: updatedFeatures });
  };

  const handleSave = async () => {
    try {
      const payload = {
        package_name: editingPkg.name,
        description: editingPkg.description,
        price: editingPkg.price,
        features: JSON.stringify(editingPkg.features)
      };

      await API.put(`/admin/packages/${editingPkg.id}`, payload);
      setPackages(packages.map((p) => (p.id === editingPkg.id ? editingPkg : p)));
      setEditingPkg(null);
      alert('تم تحديث الباقة بنجاح');
    } catch (err) {
      console.error(err);
      alert('فشل في حفظ التعديلات');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-amber-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="mr-2 text-xs">جاري تحميل الباقات...</span>
      </div>
    );
  }

  return (
    <div className="w-full text-white">
      <h3 className="text-amber-400 font-bold mb-4 text-sm">الباقات المتاحة حالياً</h3>

      {packages.length === 0 ? (
        <div className="text-gray-500 text-xs p-4 border border-dashed border-amber-900/40 rounded-lg text-center">
          لا توجد باقات متاحة للعرض.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-[#0B0C10] border border-amber-900/40 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  <h4 className="text-amber-300 font-bold text-sm uppercase">{pkg.name}</h4>
                </div>
                <p className="text-xs text-gray-400 mb-2">{pkg.description || 'لا يوجد وصف متاح'}</p>
                <div className="text-amber-200 font-bold text-base mb-3">{pkg.price ? `${pkg.price} JOD` : 'غير محدد'}</div>
                <ul className="text-xs text-gray-300 space-y-1 mb-4 border-t border-amber-900/30 pt-3">
                  {pkg.features && pkg.features.length > 0 ? (
                    pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1 text-[11px]">
                        <span className="text-amber-400">•</span>
                        <span>{f}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-[11px]">لا توجد مزايا</li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => handleEditClick(pkg)}
                className="w-full bg-amber-500/10 border border-amber-500/40 text-amber-300 py-1.5 rounded text-xs hover:bg-amber-500/20 transition flex items-center justify-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> تعديل الباقة
              </button>
            </div>
          ))}
        </div>
      )}

      {editingPkg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B0C10] border border-amber-500/40 p-6 rounded-xl max-w-lg w-full text-right">
            <h3 className="text-amber-200 font-bold mb-4 text-sm">تعديل باقة: {editingPkg.name}</h3>
            
            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pl-1">
              <div>
                <label className="block text-xs text-gray-400 mb-1">اسم الباقة:</label>
                <input
                  type="text"
                  value={editingPkg.name || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  className="w-full bg-black border border-amber-900/40 px-3 py-1.5 rounded text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">السعر (JOD):</label>
                <input
                  type="number"
                  value={editingPkg.price || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                  className="w-full bg-black border border-amber-900/40 px-3 py-1.5 rounded text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">الوصف:</label>
                <textarea
                  rows="2"
                  value={editingPkg.description || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                  className="w-full bg-black border border-amber-900/40 px-3 py-1.5 rounded text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">المزايا:</label>
                {editingPkg.features?.map((feat, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 bg-black border border-amber-900/40 px-3 py-1.5 rounded text-xs text-white"
                    />
                    <button onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addFeature} className="text-amber-400 text-xs flex items-center gap-1 mt-2">
                  <Plus className="w-3.5 h-3.5" /> إضافة ميزة جديدة
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-amber-900/40">
              <button onClick={handleSave} className="flex-1 bg-amber-500 text-black py-2 rounded text-xs font-bold">
                حفظ التغييرات
              </button>
              <button onClick={() => setEditingPkg(null)} className="px-4 border border-gray-600 text-gray-400 py-2 rounded text-xs">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}