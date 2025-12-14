import axios from 'axios';

// Backend controllers use /api prefix (e.g., /api/auth, /api/locations)
// Base URL should be http://localhost:8081
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and log errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  refresh: () => api.post('/api/auth/refresh'),
  getMe: () => api.get('/api/auth/me'),
  updateMe: (data) => api.put('/api/auth/me', data),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
};

// Locations API
export const locationsAPI = {
  getAll: (params) => api.get('/api/locations/public/all', { params }),
  getById: (id) => api.get(`/api/locations/public/${id}`),
  search: (params) => api.get('/api/locations/public/search', { params }),
  create: (data) => api.post('/api/locations', data),
  update: (id, data) => api.put(`/api/locations/${id}`, data),
  delete: (id) => api.delete(`/api/locations/${id}`),
  uploadImages: (id, formData) => api.post(`/api/locations/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Reviews API
export const reviewsAPI = {
  create: (data) => api.post('/api/reviews', data),
  getByLocation: (locationId) => api.get(`/api/reviews/campsite/${locationId}`),
  getByUser: () => api.get('/api/reviews/my-reviews'),
  update: (id, data) => api.put(`/api/reviews/${id}`, data),
  delete: (id) => api.delete(`/api/reviews/${id}`),
};

// Transactions/Bookings API
export const transactionsAPI = {
  create: (data) => api.post('/api/transactions', data),
  getUserTransactions: () => api.get('/api/transactions/my-transactions'),
  getById: (id) => api.get(`/api/transactions/${id}`),
  cancel: (id) => api.put(`/api/transactions/${id}/cancel`),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUserById: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  makeAdmin: (id) => api.patch(`/api/admin/users/${id}/make-admin`),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getStats: () => api.get('/api/admin/analytics/dashboard'),
};

export default api;

