// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // critical: don't send "Bearer null/undefined"
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // token invalid/expired or request hit a protected route unauthenticated
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      // avoid redirect loop if already on login/register
      const p = window.location.pathname;
      if (p !== "/login" && p !== "/register") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
