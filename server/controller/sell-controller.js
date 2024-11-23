import Sale from "../model/Sell.js";
import Product from "../model/Product.js"; 

export const recordSale = async (req, res) => {
  try {
    const { userId, shopName, products, totalAmount } = req.body;

    if (!shopName || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid sale data provided" });
    }

    let totalProfit = 0;

    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const inventoryProduct = await Product.findOne({
          userId,
          productId: product.productId,
        });

        if (!inventoryProduct) {
          throw new Error(`Product not found: ${product.productId}`);
        }

        if (inventoryProduct.quantity < product.quantity) {
          throw new Error(`Not enough quantity available for: ${product.name}`);
        }

        const costPrice = inventoryProduct.price; // Assume `price` in Product is the cost price
        const profit = (product.price - costPrice) * product.quantity;

        totalProfit += profit;

        inventoryProduct.quantity -= product.quantity;
        if (inventoryProduct.quantity === 0) {
          await Product.findOneAndDelete({ userId, productId: product.productId });
        } else {
          await inventoryProduct.save();
        }

        return { ...product, profit };
      })
    );

    const sale = new Sale({
      userId,
      shopName,
      products: updatedProducts,
      totalAmount,
      totalProfit,
    });

    await sale.save();

    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ userId: req.params.userId });
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
