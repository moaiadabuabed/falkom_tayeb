import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../services/store.js";

export default function RequireAdminAuth({ children }) {
  const isAdmin = useAdminAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}