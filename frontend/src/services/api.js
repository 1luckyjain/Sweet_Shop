import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      // Redirect to login page or handle globally
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API methods
const apiMethods = {
  // Auth endpoints
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  
  // Sweet endpoints
  getAllSweets: () => api.get('/sweets'),
  getSweetById: (id) => api.get(`/sweets/${id}`),
  createSweet: (sweetData) => api.post('/sweets', sweetData),
  updateSweet: (id, sweetData) => api.put(`/sweets/${id}`, sweetData),
  deleteSweet: (id) => api.delete(`/sweets/${id}`),
  searchSweets: (params) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/sweets/search?${queryParams.toString()}`);
  },
  
  // Inventory endpoints
  purchaseSweet: (id, quantity) => api.post(`/sweets/${id}/purchase`, { quantity }),
  restockSweet: (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity }),
};

// Export both the methods and the axios instance
export { api as axiosInstance };
export default apiMethods;
