import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/menu';

export const getMenu = () => axios.get(BASE_URL);
export const addMenuItem = (data) => axios.post(BASE_URL, data);
export const updateMenuItem = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteMenuItem = (id) => axios.delete(`${BASE_URL}/${id}`);