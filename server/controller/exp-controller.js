import Expense from '../model/Expense.js';

// Get all expenses of a user
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", error: err });
  }
};

// Add a new expense
export const addExpense = async (req, res) => {
  const { amount, description, date, paymentType, userId } = req.body;

  const newExpense = new Expense({
    amount,
    description,
    date,
    paymentType,
    userId
  });

  try {
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(500).json({ message: "Error saving expense", error: err });
  }
};

// Update an expense
export const updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { amount, description, date, paymentType } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { amount, description, date, paymentType },
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: "Error updating expense", error: err });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense", error: err });
  }
};
