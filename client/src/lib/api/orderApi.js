import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const getOrders = () =>
  axios.get(`${BASE_URL}/orders`).then(res => res.data);

export const addOrder = (payload) =>
  axios.post(`${BASE_URL}/orders`, payload).then(res => res.data);

export const updateOrder = (orderId, updates) =>
  axios.patch(`${BASE_URL}/orders/${orderId}`, updates).then(res => res.data);

export const deleteOrder = (orderId) =>
  axios.delete(`${BASE_URL}/orders/${orderId}`);

export const markOrderAsPaid = (orderId) =>
  axios.patch(`${BASE_URL}/orders/${orderId}`, { paymentStatus: 'Paid' }).then(res => res.data);
