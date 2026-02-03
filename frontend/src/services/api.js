import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header to requests if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle data extraction and global errors
api.interceptors.response.use(
  (response) => {
    // Return the data property from the axios response (the actual backend response body)
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ ...error, message });
  }
);

export default api;
