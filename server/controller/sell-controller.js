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
       
        await inventoryProduct.save();

        return { ...product, profit, paymentStatus: product.paymentStatus || "pending" };
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

// Update product quantity and sales status when returned
export const handleReturn = async (req, res) => {
  try {
    const { saleId, productId } = req.body;

    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const product = sale.products.find((p) => p.productId === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found in sale" });
    }

    if (product.paymentStatus === "returned") {
      return res.status(400).json({ message: "Product already returned" });
    }

    const inventoryProduct = await Product.findOne({ productId });
    if (!inventoryProduct) {
      return res.status(404).json({ message: "Product not found in inventory" });
    }

    // Update inventory quantity
    inventoryProduct.quantity += product.quantity;
    await inventoryProduct.save();

    // Update sale product status
    product.paymentStatus = "returned";
    await sale.save();

    res.status(200).json({ message: "Product returned successfully", sale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update payment status
export const handlePaymentReceived = async (req, res) => {
  try {
    const { saleId, productId } = req.body;

    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const product = sale.products.find((p) => p.productId === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found in sale" });
    }

    if (product.paymentStatus === "received") {
      return res.status(400).json({ message: "Payment already received" });
    }

    // Update payment status
    product.paymentStatus = "received";
    await sale.save();

    const inventoryProduct = await Product.findOne({ productId });
    if (!inventoryProduct) {
      return res.status(404).json({ message: "Product not found in inventory" });
    }

    if (inventoryProduct.quantity === 0) {
      await Product.findOneAndDelete({ userId, productId: product.productId });
    } else {
      await inventoryProduct.save();
    }

    res.status(200).json({ message: "Payment status updated successfully", sale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
