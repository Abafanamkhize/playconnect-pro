import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

// Interceptor to add auth token to requests
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (formData: { email: string; password: string }) => {
  // This will be connected to your actual backend later
  const response = await API.post('/auth/login', formData);
  return response.data;
};

// We will add more API calls here (e.g., fetchPlayers, createPlayer)
