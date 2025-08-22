// lib/api/dashboardApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const dashboardApi = axios.create({
  baseURL: `${API_URL}/dashboard`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
dashboardApi.interceptors.request.use(
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

// Response interceptor for error handling
dashboardApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API functions
export const getDashboardSummary = async () => {
  try {
    const response = await dashboardApi.get('/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

export const getSalesTrends = async () => {
  try {
    const response = await dashboardApi.get('/sales-trends');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales trends:', error);
    throw error;
  }
};

export const getTopSellingItems = async () => {
  try {
    const response = await dashboardApi.get('/top-selling');
    return response.data;
  } catch (error) {
    console.error('Error fetching top selling items:', error);
    throw error;
  }
};

export const getUserRolesDistribution = async () => {
  try {
    const response = await dashboardApi.get('/user-roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching user roles distribution:', error);
    throw error;
  }
};

export const getRecentActivities = async () => {
  try {
    const response = await dashboardApi.get('/recent-activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

export default dashboardApi;
