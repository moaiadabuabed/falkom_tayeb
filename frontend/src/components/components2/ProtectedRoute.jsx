/*import React from 'react';

import { useAuth } from '../context/AuthContext';*/

/*export default function ProtectedRoute({ children, roleRequired }) {
  const { token, user, loading } = useAuth();

  // انتظار انتهاء تحميل حالة التسجيل لمنع التوجيه العشوائي عند الـ Refresh
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-amber-400 text-xs tracking-widest uppercase">
        Loading Authentication...
      </div>
    );
  }

  // 1. التوجيه لصفحة الدخول إذا لم يرسل Token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. التحقق من الصلاحية (مثلاً إذا كانت الصفحة تتطلب ADMIN)
  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/event-details" replace />;
  }

  return children;
}*/
import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roleRequired }) {
  const location = useLocation();
  const { user, token, loading } = useAuth();

  // إرجاع شاشة تحميل مؤقتة أثناء فحص الـ Auth
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-amber-400 text-xs tracking-widest uppercase">
        Loading...
      </div>
    );
  }

  // 1. التوجيه لصفحة الدخول إذا لم يتوفر Token
  if (!token) {
    localStorage.setItem("afterLogin", location.pathname);
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 2. التحقق من صلاحيات الأدمن (إذا كان المسار يتطلب ADMIN)
  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}