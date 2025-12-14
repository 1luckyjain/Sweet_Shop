const axios = require('axios');

// Create axios instance for backend internal API calls
const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // For internal backend use, we might need to add auth token
    const token = process.env.INTERNAL_API_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Log authentication errors
      console.error('Authentication error:', error.response.data);
    } else if (error.response?.status >= 500) {
      // Log server errors
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Export the axios instance
module.exports = api;
