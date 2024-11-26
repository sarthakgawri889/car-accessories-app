import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', ExpenseSchema);
export default Expense;
