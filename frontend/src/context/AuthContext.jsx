import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const AUTH_EVENT = "falkom-auth-change";

// Helper Functions
function getToken() {
  return localStorage.getItem("adminToken") || localStorage.getItem("token") || null;
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());
  const [token, setToken] = useState(() => getToken());
  const [loading, setLoading] = useState(false);

  // Login Function
  const login = (newToken, userData) => {
    if (userData?.role === "admin") {
      localStorage.setItem("adminToken", newToken);
    }
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);

    window.dispatchEvent(new Event(AUTH_EVENT));
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    window.dispatchEvent(new Event(AUTH_EVENT));
  };

  // Checks
  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin" || !!localStorage.getItem("adminToken");

  // Sync auth state across tabs and events
  useEffect(() => {
    const syncAuth = () => {
      setUser(getUser());
      setToken(getToken());
    };

    window.addEventListener(AUTH_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}