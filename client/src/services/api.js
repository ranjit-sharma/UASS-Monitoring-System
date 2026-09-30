// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true, // send HTTP-only cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export default api;
