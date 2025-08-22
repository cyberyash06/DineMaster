import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

// List all categories
export const getCategories = () =>
  axios.get(`${BASE_URL}/categories`).then(res => res.data);

// Add a new category
export const addCategory = (payload) =>
  axios.post(`${BASE_URL}/categories`, payload).then(res => res.data);

// Delete a category
export const deleteCategory = (categoryId) =>
  axios.delete(`${BASE_URL}/categories/${categoryId}`);
