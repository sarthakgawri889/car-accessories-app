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
  const { refreshProducts, loading } = useContext(ProductContext);
  const { currentUser } = useContext(CurrentUserContext); // Fetch current user details
  const [productss, setProductss] = useState([]);
  const [cart, setCart] = useState([]);
  const [inputs, setInputs] = useState({});
  const [shopName, setShopName] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      setProductss(
        products
          .filter((product) => product.quantity > 0) // Filter products with available quantity > 0
          .map((product, index) => ({
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

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
        paymentStatus: item.paymentStatus || "pending", // Assuming the original price is the cost price
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

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Receipt", 10, 10);
    doc.setFontSize(14);
    doc.text(`Shop Name: ${data.shopName}`, 10, 20);
    doc.text(`Sold By: ${currentUser?.name || "Unknown User"}`, 10, 30);
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    doc.setFontSize(12);
    doc.text(formattedDate, doc.internal.pageSize.width - 20, 10, { align: "right" });

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

  const filteredProducts = productss.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="sell-page-container">
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1100,
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

        <TextField
          label="Search Products"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
          placeholder="Search by product name..."
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
              {filteredProducts.map((product) => (
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

        <Typography variant="h5" gutterBottom>
          Cart
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
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

        <Typography variant="h6" gutterBottom>
          Grand Total: {calculateTotal()} Rs.
        </Typography>

        <Box display="flex" gap={2} marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSell}
            disabled={cart.length === 0}
          >
            Sell Products
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </Box>
      </div>
    </>
  );
};

export default SellPage;
