import mongoose from "mongoose";

const salesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  shopName: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true },
      profit: { type: Number, required: true }, // Add profit for each product
    },
  ],
  totalAmount: { type: Number, required: true },
  totalProfit: { type: Number, required: true }, // Add total profit for the sale
  date: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", salesSchema);
export default Sale;


