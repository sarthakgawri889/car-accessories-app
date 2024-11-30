import { useState, useContext, useEffect } from "react";
import background from "../assets/download.svg";
import ResponsiveAppBar from "../Components/ResponsiveAppBar";
import { CurrentUserContext } from "../context/CurrentUserContext";
import "jspdf-autotable";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import {
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../service/productapi.js";
import { ProductContext } from "../context/ProductContext.jsx";
import { jsPDF } from "jspdf";

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const { currentUser } = useContext(CurrentUserContext);
  const { refreshProducts,loading } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: "",
    quantity: "",
    vendor: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    if (currentUser) {
      refreshProducts(); // Notify ProductContext of changes
      fetchProducts();
    }
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts(currentUser.sub);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleAddOrEdit = async () => {
    try {
      const productData = {
        userId: currentUser.sub,
        productId: isEditing ? editingProductId : uuidv4(), // Generate productId only for new products
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        vendor: newProduct.vendor,
      };

      if (isEditing) {
        await updateProduct(editingProductId, productData);
      } else {
        await addProduct(productData);
      }
      refreshProducts(); // Notify ProductContext of changes
      fetchProducts(); // Refresh the product list
      setIsEditing(false);
      setEditingProductId(null);
      setNewProduct({ id: "", name: "", price: "", quantity: "", vendor: "" });
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(currentUser.sub, productId);
      refreshProducts(); // Notify ProductContext of changes
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingProductId(product.productId);
    setNewProduct(product);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const calculateTotalStockPrice = () => {
    return filteredProducts.reduce(
      (total, product) =>
        total +
        parseFloat(product.price || 0) * parseInt(product.quantity || 0),
      0
    );
  };

  const calculateTotalItems = () => {
    return filteredProducts.reduce(
      (tot, product) =>
        tot +
       parseInt(product.quantity || 0),
      0
    );
  };

  const calculateTotalRows = () => {
    return filteredProducts.length;
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Set the title of the PDF
    doc.setFontSize(18);
    doc.text("Inventory Report", 14, 10);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    doc.setFontSize(12);
    doc.text(formattedDate, doc.internal.pageSize.width - 20, 10, { align: "right" });


    // Prepare the data for the table (headers and rows)
    const headers = [
      "Product Name",
      "Price",
      "Quantity",
      "Vendor",
      "Total Price",
    ];
    const rows = filteredProducts.map((product) => [
      product.name,
      `${product.price.toFixed(2)} Rs.`,
      product.quantity.toString(),
      product.vendor,
      `${(product.price * product.quantity).toFixed(2)} Rs.`,
    ]);

    // Apply autoTable to generate the table
    doc.autoTable({
      head: [headers], // Table headers
      body: rows, // Table data
      startY: 20, // Start position for the table
      theme: "grid", // Apply grid theme (with lines around cells)
      styles: {
        fontSize: 10, // Font size for the table content
        cellPadding: 4, // Padding inside cells
        halign: "center", // Center-align text in cells
      },
      headStyles: {
        fillColor: [33, 150, 243], // Header background color (blue)
        textColor: [255, 255, 255], // Header text color (white)
        fontSize: 12, // Header font size
        fontStyle: "bold", // Bold font for header
      },
      bodyStyles: {
        fillColor: [242, 242, 242], // Light grey background for rows
        textColor: [0, 0, 0], // Black text color
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255], // White background for alternate rows
      },
    });

    const totalStockRows = calculateTotalRows();
    doc.setFontSize(14);
    doc.text(
      `Total Stock Rows: ${totalStockRows.toFixed(2)}`,
      14,
      doc.autoTable.previous.finalY + 10
    );

    const totalStockItems = calculateTotalItems();
    doc.setFontSize(14);
    doc.text(
      `Total Stock Items: ${totalStockItems.toFixed(2)}`,
      14,
      doc.autoTable.previous.finalY + 20
    );

    // Add the total stock price below the table in a larger font
    const totalStockPrice = calculateTotalStockPrice();
    doc.setFontSize(14);
    doc.text(
      `Total Stock Price: ${totalStockPrice.toFixed(2)} Rs.`,
      14,
      doc.autoTable.previous.finalY + 30
    );

    // Save the PDF
    doc.save("inventory_report.pdf");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((product) => product.quantity > 0);
  

  return (
    <>
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
      <div className="inventory-background">
        <div className="message-container">
          <Typography variant="h3" className="title">
            Manage Your Inventory
          </Typography>
          <Typography variant="body1" className="subtitle">
            Add, edit, and organize your inventory seamlessly.
          </Typography>
        </div>

        <Box className="form-container">
          <TextField
            label="Product Name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            className="input-field"
          />
          <TextField
            label="Price"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            type="number"
            className="input-field"
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            type="number"
            className="input-field"
          />
          <TextField
            label="Vendor Name"
            name="vendor"
            value={newProduct.vendor}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            className="input-field"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOrEdit}
            className="add-button"
          >
            {isEditing ? "Update" : "Add"}
          </Button>
        </Box>

        <TextField
          label="Search Products or Vendors"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shop-name-input"
          placeholder="Search by product name or vendor..."
        />

        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Date</TableCell> {/* Add Date column */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.vendor}</TableCell>
                  <TableCell>
                    {/* Format the date */}
                    {new Date(product.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(product.productId)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="total-container">
          <Typography variant="h6" className="total-text">
            Total Rows: {calculateTotalRows()}
          </Typography>
        </div>

        <div className="total-container">
          <Typography variant="h6" className="total-text">
            Total Items: {calculateTotalItems()}
          </Typography>
        </div>

        <div className="total-container">
          <Typography variant="h6" className="total-text">
            Total Stock Price: ₹{calculateTotalStockPrice()}
          </Typography>
        </div>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadPdf}
        >
          Download as PDF
        </Button>
      </div>

      <style>
        {`
          .inventory-background {
              height: 200vh;
              background-color: #f8f9fa; /* Light gray background */
              /* Uncomment if using a background image */
              /* background-image: url(${background}), linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)); */
              /* background-size: cover; */
              /* background-position: center; */
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-top: 5vh;
          }

            .message-container {
              text-align: center;
              margin-bottom: 20px;
            }

            .shop-name-input {
  margin-bottom: 20px;
  width: 70%;
}

            .title {
              font-size: 2.5rem;
              font-weight: bold;
              color: black; /* Ensure proper color value */
              margin-top: 5vh;
            }

            .subtitle {
              font-size: 1.2rem;
              color: black; /* Fix invalid color */
            }

            .form-container {
              display: flex;
              gap: 1rem;
              flex-wrap: wrap;
              background-color: white;
              padding: 20px;
              border-radius: 15px;
              box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
              margin-bottom: 2rem;
              width: 80%;
              justify-content: space-between;
            }

            .input-field {
              flex: 1 1 calc(20% - 10px);
              min-width: 150px;
            }

            .add-button {
              flex: 1 1 calc(20% - 10px);
              min-width: 150px;
            }

            .table-container {
              width: 80%;
              margin-bottom: 20px;
              border-radius: 15px;
              box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
            
            }

            .total-container {
              margin-top: 10px;
              text-align: right;
              width: 80%;
            }

            .total-text {
              font-weight: bold;
              color: black; /* Fix invalid color */
            }

            /* Responsive Styling */
            @media (max-width: 768px) {
              .inventory-background {
                height: 200vh;
                background-color: #f8f9fa; /* Match desktop background color */
                padding: 20px;
                margin-top: 5vh;
              }

              .shop-name-input {
    width: 100%;
  }

              .form-container {
                width: 100%;
              }

              .input-field,
              .add-button {
                flex: 1 1 100%;
              }

              .total-text {
                font-weight: bold;
                color: black; /* Fix invalid color */
              }

              .table-container {
                width: 100%;
              }

              .title {
                margin-top: 9vh;
              }

              .total-container {
                width: 100%;
                text-align: center;
              }
            }

       


        `}
      </style>
    </>
  );
}

export default InventoryPage;
