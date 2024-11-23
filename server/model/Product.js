import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true, unique: true }, // Ensure unique IDs
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  vendor: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
