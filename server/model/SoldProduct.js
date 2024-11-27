import mongoose from "mongoose";

const SoldProductSchema = mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true, unique: true }, // Ensure unique IDs
  name: { type: String, required: true },
  price: { type: Number, required: true },
  vendor: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const SoldProduct = mongoose.model("SoldProduct", SoldProductSchema);

export default SoldProduct;