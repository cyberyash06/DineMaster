import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

// List menu items by category
export const getMenuItems = (categoryId) =>
  axios.get(`${BASE_URL}/menu?category=${categoryId}`).then(res => res.data);

// Add menu item
export const addMenuItem = (payload) =>
  axios.post(`${BASE_URL}/menu`, payload).then(res => res.data);

// Edit menu item
export const updateMenuItem = (itemId, payload) =>
  axios.patch(`${BASE_URL}/menu/${itemId}`, payload).then(res => res.data);

// Delete menu item
export const deleteMenuItem = (itemId) =>
  axios.delete(`${BASE_URL}/menu/${itemId}`);

// Toggle availability
export const toggleItemAvailability = (itemId) =>
  axios.patch(`${BASE_URL}/menu/${itemId}/availability`).then(res => res.data);

// Optional: Upload image
export const uploadMenuImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};
