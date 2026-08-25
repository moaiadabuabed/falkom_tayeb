import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const { user, token } = useAuth();

  const userRole = user?.ROLE || user?.role;

  if (!token || userRole !== 'ADMIN') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}