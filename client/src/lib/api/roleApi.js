import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const getRolePermissions = () =>
  axios.get(`${BASE_URL}/roles`).then(res => res.data);

export const updateRolePermissions = (permissions) =>
  axios.put(`${BASE_URL}/roles`, { permissions });
