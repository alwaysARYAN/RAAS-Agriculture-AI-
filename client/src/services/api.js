import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Farm APIs
export const farmAPI = {
  getAll: () => api.get('/farms'),
  getById: (id) => api.get(`/farms/${id}`),
  create: (data) => api.post('/farms', data),
  update: (id, data) => api.put(`/farms/${id}`, data),
  delete: (id) => api.delete(`/farms/${id}`),
  getStats: () => api.get('/farms/stats/summary')
};

// Crop APIs
export const cropAPI = {
  getAll: (params) => api.get('/crops', { params }),
  getById: (id) => api.get(`/crops/${id}`),
  create: (data) => api.post('/crops', data),
  update: (id, data) => api.put(`/crops/${id}`, data),
  delete: (id) => api.delete(`/crops/${id}`),
  updateStage: (id, data) => api.patch(`/crops/${id}/stage`, data),
  recordHarvest: (id, data) => api.post(`/crops/${id}/harvest`, data),
  getStats: () => api.get('/crops/stats/summary')
};

// Disease APIs
export const diseaseAPI = {
  detect: (formData) => api.post('/disease/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/disease', { params }),
  getById: (id) => api.get(`/disease/${id}`),
  updateStatus: (id, data) => api.patch(`/disease/${id}/status`, data),
  delete: (id) => api.delete(`/disease/${id}`),
  getStats: () => api.get('/disease/stats/summary')
};

// Weather APIs
export const weatherAPI = {
  getCurrent: (params) => api.get('/weather/current', { params }),
  getForecast: (params) => api.get('/weather/forecast', { params }),
  getFarmWeather: (farmId) => api.get(`/weather/farm/${farmId}`),
  getIrrigation: (farmId) => api.get(`/weather/irrigation/${farmId}`),
  getAlerts: (params) => api.get('/weather/alerts', { params })
};

// AI APIs
export const aiAPI = {
  recommendCrops: (data) => api.post('/ai/recommend-crops', data),
  getFarmingTips: (data) => api.post('/ai/farming-tips', data),
  getPestPrevention: (data) => api.post('/ai/pest-prevention', data),
  getSoilAnalysis: (data) => api.post('/ai/soil-analysis', data),
  getHarvestTiming: (data) => api.post('/ai/harvest-timing', data)
};

// Market APIs
export const marketAPI = {
  getPrices: (params) => api.get('/market/prices', { params }),
  comparePrices: (commodity) => api.get(`/market/compare/${commodity}`),
  getTrending: () => api.get('/market/trending'),
  getHistory: (commodity, params) => api.get(`/market/history/${commodity}`, { params }),
  addPrice: (data) => api.post('/market/prices', data)
};

// Scheme APIs
export const schemeAPI = {
  getAll: (params) => api.get('/schemes', { params }),
  getEligible: () => api.get('/schemes/eligible'),
  getById: (id) => api.get(`/schemes/${id}`),
  search: (query) => api.get('/schemes/search', { params: { query } })
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getHistory: (params) => api.get('/chat/history', { params }),
  getSession: (sessionId) => api.get(`/chat/session/${sessionId}`),
  deleteSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
  clearHistory: () => api.delete('/chat/history'),
  getSuggestions: () => api.get('/chat/suggestions'),
  getInsights: (data) => api.post('/chat/insights', data),
  getDailyTip: () => api.get('/chat/daily-tip')
};

export default api;
