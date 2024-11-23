import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

export const getProducts = (userId) => axios.get(`${API_URL}/${userId}`);
export const addProduct = (product) => {
  if (Array.isArray(product)) {
    return axios.post(API_URL, product); // For adding multiple products
  }
  return axios.post(API_URL, product); // For adding a single product
};
export const updateProduct = (productId, product) =>
  axios.put(`${API_URL}/${productId}`, product);
export const deleteProduct = (userId, productId) =>
  axios.delete(`${API_URL}/${productId}`, { data: { userId } });
