import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.patch('/users/profile', userData),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/users/reset-password/${token}`, { password }),
  searchOfficials: (params) => api.get('/users/search-officials', { params })
};

// Complaints API
export const complaintsAPI = {
  getAllComplaints: (filters) => api.get('/complaints', { params: filters }),
  getComplaintById: (id) => api.get(`/complaints/${id}`),
  submitComplaint: (complaintData) => api.post('/complaints', complaintData),
  updateComplaint: (id, data) => api.patch(`/complaints/${id}`, data),
  deleteComplaint: (id) => api.delete(`/complaints/${id}`),
  submitFeedback: (id, feedback) => api.post(`/complaints/${id}/feedback`, feedback),
  getUserComplaints: (userId, filters) => api.get(`/complaints/user/${userId}`, { params: filters })
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPerformanceMetrics: (params) => api.get('/analytics/performance', { params }),
  getComplaintsByCategory: () => api.get('/analytics/complaints-by-category'),
  getComplaintsByPriority: () => api.get('/analytics/complaints-by-priority'),
  getDistrictPerformance: () => api.get('/analytics/district-performance'),
  getSatisfactionScore: () => api.get('/analytics/satisfaction-score')
};

// Notifications API
export const notificationsAPI = {
  getUserNotifications: (filters) => api.get('/notifications', { params: filters }),
  getNotificationById: (id) => api.get(`/notifications/${id}`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all/read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

// Messages API
export const messagesAPI = {
  getMessages: (otherUserId) => api.get(`/messages/${otherUserId}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
  markAsRead: (senderId) => api.patch(`/messages/read/${senderId}`)
};

export default api;
