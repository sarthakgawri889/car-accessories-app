import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { SalesContext } from "../context/SalesContext";
import { ProductContext } from "../context/ProductContext";
import { CurrentUserContext } from "../context/CurrentUserContext"; // Import user context
import ResponsiveAppBar from "../Components/ResponsiveAppBar";
import jsPDF from "jspdf";

import "jspdf-autotable"; // For generating table data in PDF
import { recordSale } from "../service/sellapi.js"; // Import the API for backend integration

const SellPage = () => {
  const { products } = useContext(ProductContext);
  const { refreshSales } = useContext(SalesContext);
  const { refreshProducts } = useContext(ProductContext);
  const { currentUser,loading } = useContext(CurrentUserContext); // Fetch current user details
  const [productss, setProductss] = useState([]);
  const [cart, setCart] = useState([]);
  const [inputs, setInputs] = useState({});
  const [shopName, setShopName] = useState("");

  
  
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setProductss(
        products.map((product, index) => ({
          id: index + 1,
          name: product.name,
          productId: product.productId,
          price: product.price,
          quantityAvailable: product.quantity,
          vendor: product.vendor,
        }))
      );
    }
  }, [products]);

  const handleInputChange = (productId, field, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [productId]: {
        ...prevInputs[productId],
        [field]: value,
      },
    }));
  };

  const handleAddToCart = (product) => {
    const { quantity, price } = inputs[product.productId] || {};
    if (!quantity || !price) {
      alert("Please enter both quantity and price!");
      return;
    }

    if (quantity > product.quantityAvailable) {
      alert(`Please enter a quantity less than or equal to ${product.quantityAvailable}`);
      return;
    }

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.productId === product.productId
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.productId === product.productId
            ? {
                ...item,
                quantity: +quantity,
                price: +price,
                total: +quantity * +price,
              }
            : item
        );
      }

      return [
        ...prevCart,
        { ...product, quantity: +quantity, price: +price, total: +quantity * +price },
      ];
    });

    setInputs((prevInputs) => ({
      ...prevInputs,
      [product.productId]: { quantity: "", price: "" },
    }));
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.total, 0);

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSell = async () => {
    if (!shopName) {
      alert("Please enter a shop name!");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty! Add products to the cart before selling.");
      return;
    }
  
    const saleData = {
      userId: currentUser?.sub,
      shopName,
      products: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        costPrice: productss.find((p) => p.productId === item.productId)?.price,
        paymentStatus: item.paymentStatus || "pending",// Assuming the original price is the cost price
      })),
      totalAmount: calculateTotal(),
    };

    try {
      await recordSale(saleData);
      alert("Sale completed successfully!");
      refreshProducts();
      refreshSales();
      // Clear cart and inputs
      setCart([]);
      setInputs({});
      setShopName("");
      generatePDF(saleData); // Generate PDF receipt
    } catch (error) {
      console.error("Error during sale:", error);
      alert("Failed to complete the sale.");
    }
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Receipt", 10, 10);
    doc.setFontSize(14);
    doc.text(`Shop Name: ${data.shopName}`, 10, 20);
    doc.text(`Sold By: ${currentUser?.name || "Unknown User"}`, 10, 30);

    const tableColumn = ["Product Name", "Quantity", "Price", "Total"];
    const tableRows = data.products.map((item) => [
      item.name,
      item.quantity,
      `${item.price} Rs.`,
      `${item.total} Rs.`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    doc.text(`Grand Total: ${data.totalAmount} Rs.`, 200, doc.lastAutoTable.finalY + 10, {
      align: "right",
    });
    doc.save(`${data.shopName}_receipt.pdf`);
  };

  return (
    <>
      <div className="sell-page-container">
      <Box
  sx={{
    position: "fixed", // Fix it to the top
    top: 0, // Align to the top of the viewport
    left: 0, // Align to the left
    width: "100%", // Full width
    zIndex: 1100, // Ensure it stays on top of other content
  }}
>
  <ResponsiveAppBar />
</Box>
        <Typography variant="h4" gutterBottom className="page-title">
          Sell Products
        </Typography>

        <TextField
          label="Shop Name"
          fullWidth
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="shop-name-input"
        />

        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Available Quantity</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productss.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantityAvailable}</TableCell>
                  <TableCell>{product.vendor}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      placeholder="Quantity"
                      value={inputs[product.productId]?.quantity || ""}
                      onChange={(e) =>
                        handleInputChange(product.productId, "quantity", e.target.value)
                      }
                      className="input-field"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      placeholder="Price"
                      value={inputs[product.productId]?.price || ""}
                      onChange={(e) =>
                        handleInputChange(product.productId, "price", e.target.value)
                      }
                      className="input-field"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-button"
                    >
                      Add to Cart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" gutterBottom className="cart-title">
          Cart
        </Typography>

        {cart.length === 0 ? (
          <Typography className="empty-cart">Cart is empty!</Typography>
        ) : (
          <TableContainer component={Paper} className="cart-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price} Rs.</TableCell>
                    <TableCell>{item.total} Rs.</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Typography variant="h6" className="total-price">
          Total Price: {calculateTotal()} Rs.
        </Typography>

        <div className="action-buttons">
          <Button
            variant="contained"
            color="secondary"
            className="clear-cart-button"
            onClick={handleClearCart}
          >
            Clear Cart
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="sell-button"
            onClick={handleSell}
          >
            Sell
          </Button>
        </div>
      </div>
      <style>
        {`
          .sell-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  padding: 20px;
}

.page-title {
  margin-top: 14vh;
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.shop-name-input {
  margin-bottom: 20px;
  width: 50%;
}

.table-container {
  width: 80%;
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
}

.add-to-cart-button {
  margin-top: 10px;
}

.cart-title {
  margin-top: 20px;
  font-size: 1.8rem;
  font-weight: bold;
  color: #444;
}

.empty-cart {
  margin-top: 20px;
  color: #888;
  font-style: italic;
}

.cart-table {
  width: 80%;
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.total-price {
  margin-top: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #444;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 60%;
  margin-bottom: 30px;
}

.clear-cart-button,
.sell-button {
  width: 48%;
  border-radius: 6px;
}

.clear-cart-button {
  background-color: #ffc107;
  color: #fff;
}

.sell-button {
  background-color: #28a745;
  color: #fff;
}

/* Button hover effects */
.clear-cart-button:hover {
  background-color: #e0a800;
}

.sell-button:hover {
  background-color: #218838;
}

/* Mobile-friendly styles */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .shop-name-input {
    width: 100%;
  }

  .table-container {
    width: 100%;
  }

  .cart-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .cart-table {
    width: 100%;
  }

  .total-price {
    font-size: 1.3rem;
    text-align: center;
    color: #444;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
  }

  .clear-cart-button,
  .sell-button {
    width: 100%;
    margin-bottom: 10px;
  }
}

/* General improvements for readability */
body {
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  color: #333;
}

td {
  color: #555;
}

tr:hover {
  background-color: #f9f9f9;
}

       ` }
      </style>
    </>
  );
};

export default SellPage;
