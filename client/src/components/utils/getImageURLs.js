// utils/getImageUrl.js
const getImageUrl = (url, size = '100/100') => {
  if (!url) return `/api/placeholder/${size}`;
  if (url.startsWith('http')) return url;
  
  const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return API_BASE_URL + url;
};

export { getImageUrl };
