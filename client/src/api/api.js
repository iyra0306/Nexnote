import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Handle 401 globally - clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('nexnote_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (name, email, password, role, department, semester, rollNumber) =>
    api.post('/auth/signup', { name, email, password, role, department, semester, rollNumber }),
};

export const notesAPI = {
  getAll: (params) => api.get('/notes', { params }),
  upload: (formData) =>
    api.post('/notes', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/notes/${id}`),
  download: (id, fallbackName) =>
    api.get(`/notes/${id}/download`, { responseType: 'blob' }).then((res) => {
      const disposition = res.headers['content-disposition'];
      let filename = fallbackName || 'note';
      if (disposition) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match) filename = match[1];
      }
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }),
  addComment: (id, text) => api.post(`/notes/${id}/comments`, { text }),
  deleteComment: (noteId, commentId) => api.delete(`/notes/${noteId}/comments/${commentId}`),
  addRating: (id, rating) => api.post(`/notes/${id}/ratings`, { rating }),
  // ✅ Fixed: toggleFavorite now calls the correct endpoint
  toggleFavorite: (id) => api.post(`/users/favorites/${id}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getFavorites: () => api.get('/users/favorites'),
  getAnalytics: () => api.get('/notes/stats'),  // ✅ Fixed: points to existing stats endpoint
};

export const announcementAPI = {
  getAll: (params) => api.get('/announcements', { params }),
  create: (data) => api.post('/announcements', data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export default api;
