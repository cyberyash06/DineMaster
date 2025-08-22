import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const getUsers = (params = {}) =>
  axios.get(`${BASE_URL}/users`, { params }).then(res => res.data);

export const getUser = (userId) =>
  axios.get(`${BASE_URL}/users/${userId}`).then(res => res.data);

export const createUser = (userData) =>
  axios.post(`${BASE_URL}/users`, userData).then(res => res.data);

export const updateUser = (userId, userData) =>
  axios.put(`${BASE_URL}/users/${userId}`, userData).then(res => res.data);

export const deleteUser = (userId) =>
  axios.delete(`${BASE_URL}/users/${userId}`);

export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};
