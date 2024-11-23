import axios from "axios";

// Base URL of your backend API
const BASE_URL = `${import.meta.env.VITE_API_URL}/api`; // Replace with your actual backend URL

/**
 * Record a sale in the system.
 * @param {Object} saleData - Data about the sale to record.
 * @param {string} saleData.userId - ID of the user making the sale.
 * @param {string} saleData.shopName - Name of the shop.
 * @param {Array} saleData.products - List of products in the sale.
 * @param {number} saleData.totalAmount - Total sale amount.
 * @returns {Promise<Object>} Axios response promise.
 */
export const recordSale = async (saleData) => {
  try {
    const response = await axios.post(`${BASE_URL}/sales`, saleData);
    return response.data; // Return the sale record or confirmation
  } catch (err) {
    console.error("Error recording sale:", err);
    throw err; // Throw error to be handled by the caller
  }
};

export const getSales = (userId) => axios.get(`${BASE_URL}/sales/${userId}`);


