import axios from 'axios';

const API_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:5000/api";

export const API = axios.create({
  baseURL: API_URL,
});

// إرفاق الـ Token تلقائياً مع كل Request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// معالجة انتهاء الجلسة (401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;