import axios from "axios";

// Base URL of your backend API
// const BASE_URL= 'http://localhost:8000/api'
const BASE_URL = `${import.meta.env.VITE_API_URL}/api`; // Replace with your actual backend URL


export const getSoldProduct = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/sold/${userId}`);
      return response.data;
    } catch (err) {
      console.error("Error fetching sold products:", err);
      throw err;
    }
  };
  
  /**
   * Delete a specific sold product.
   * @param {string} userId - User ID.
   * @param {string} productId - Product ID.
   * @returns {Promise<Object>} Axios response promise.
   */
  export const deleteSoldProduct = async (userId, productId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/sold/${userId}/${productId}`);
      return response.data;
    } catch (err) {
      console.error("Error deleting sold product:", err);
      throw err;
    }
  };