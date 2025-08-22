//authApi.js
import axios from "axios";
const API = process.env.REACT_APP_API_URL;

// Set default authorization header if token exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const registerUser = (data) => axios.post(`${API}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API}/auth/login`, data);
export const getProfile = () => axios.get(`${API}/auth/me`);

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem('user');
};
