import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, useAuth } from "../services/store.js";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const user = useAuth();

  useEffect(() => {
    if (!getToken()) {
      localStorage.setItem("afterLogin", window.location.pathname);
      navigate("/login", { replace: true, state: { from: window.location.pathname } });
    }
  }, [navigate, user]);

  return getToken() ? children : null;
}