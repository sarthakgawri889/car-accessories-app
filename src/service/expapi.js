import axios from 'axios';

// URL of your backend API (change accordingly)
const API_URL = `${import.meta.env.VITE_API_URL}/api/expenses`;

// Fetch expenses
export const getExpenses = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching expenses", err);
    throw err;
  }
};

// Add an expense
export const addExpense = async (expenseData) => {
  try {
    const response = await axios.post(API_URL, expenseData);
    return response.data;
  } catch (err) {
    console.error("Error adding expense", err);
    throw err;
  }
};

// Update an expense
export const updateExpense = async (expenseId, expenseData) => {
  try {
    const response = await axios.put(`${API_URL}/${expenseId}`, expenseData);
    return response.data;
  } catch (err) {
    console.error("Error updating expense", err);
    throw err;
  }
};

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    await axios.delete(`${API_URL}/${expenseId}`);
  } catch (err) {
    console.error("Error deleting expense", err);
    throw err;
  }
};
