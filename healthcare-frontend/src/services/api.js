// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // 🔥 FIX
  withCredentials: true,
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error logger (safe)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn(
      "[Frontend API Error]",
      error.response?.status,
      error.config?.url,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  if (error.response) {
    const status = error.response.status;
    const detail =
      error.response.data?.detail ||
      error.response.data?.error ||
      error.response.data?.message;

    if (status === 400) return detail || "Invalid input.";
    if (status === 401) return "Unauthorized. Please login again.";
    if (status === 403) return "Access denied.";
    if (status >= 500) return "Server error. Try again later.";

    return detail || "Something went wrong.";
  }

  if (error.request) {
    return "Network error. Backend not reachable.";
  }

  return "Unexpected error occurred.";
};

export default API;
