import Product from "../model/Product.js";

export const addProduct = async (req, res) => {
    try {
      const products = Array.isArray(req.body) ? req.body : [req.body];
      const newProducts = await Product.insertMany(products);
      res.status(201).json(newProducts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.params.userId });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { userId: req.body.userId, productId: req.params.productId },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({
      userId: req.body.userId,
      productId: req.params.productId,
    });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
