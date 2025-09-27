import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Your API Gateway

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

export const playerAPI = {
  getAll: () => api.get('/players'),
  getById: (id) => api.get(`/players/${id}`),
  create: (playerData) => api.post('/players', playerData),
  update: (id, playerData) => api.put(`/players/${id}`, playerData),
  delete: (id) => api.delete(`/players/${id}`),
  search: (filters) => api.get('/players/search', { params: filters }),
};

export const federationAPI = {
  getFederations: () => api.get('/federations'),
  getFederation: (id) => api.get(`/federations/${id}`),
  createFederation: (data) => api.post('/federations', data),
  updateFederation: (id, data) => api.put(`/federations/${id}`, data),
};

export default api;
