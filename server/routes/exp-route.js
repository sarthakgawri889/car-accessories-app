import express from 'express';
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../controller/exp-controller.js';

const router = express.Router();

// Get expenses of a user
router.get('/:userId', getExpenses);

// Add an expense
router.post('/', addExpense);

// Update an expense
router.put('/:expenseId', updateExpense);

// Delete an expense
router.delete('/:expenseId', deleteExpense);

export default router;
