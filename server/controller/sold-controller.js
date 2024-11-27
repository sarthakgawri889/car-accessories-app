import SoldProduct from "../model/SoldProduct.js";

export const getSoldProduct = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const soldProducts = await SoldProduct.find({ userId }); // Replace with your query logic
      if (!soldProducts || soldProducts.length === 0) {
        return res.status(404).json({ message: "No sold products found for this user." });
      }
      res.status(200).json(soldProducts);
    } catch (error) {
      console.error("Error fetching sold products:", error);
      res.status(500).json({ message: "Failed to fetch sold products. Please try again later." });
    }
  };

  export const deleteSoldProduct = async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      const deletedProduct = await SoldProduct.findOneAndDelete({ userId, productId: productId }); // Replace with your query logic
      if (!deletedProduct) {
        return res.status(404).json({ message: "Sold product not found or already deleted." });
      }
      res.status(200).json({ message: "Sold product deleted successfully." });
    } catch (error) {
      console.error("Error deleting sold product:", error);
      res.status(500).json({ message: "Failed to delete sold product. Please try again later." });
    }
  };