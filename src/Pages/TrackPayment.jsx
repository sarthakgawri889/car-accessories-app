import { useContext, useState } from "react";
import { SalesContext } from "../context/SalesContext";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  CircularProgress,
  Grid,
  ButtonGroup,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import ResponsiveAppBar from "../Components/ResponsiveAppBar";
import { handleReturnAPI, handlePaymentReceivedAPI } from "../service/sellapi";
import { ProductContext } from "../context/ProductContext";

const TrackPayment = () => {
  const { sales, loading, refreshSales } = useContext(SalesContext);
  const { refreshProducts } = useContext(ProductContext);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("today"); // Filter state: "today" or "byDate"
  const [selectedDate, setSelectedDate] = useState(new Date()); // For the "by date" filter

  // Filtered sales data
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);

    if (filter === "today") {
      // Show only today's sales
      const today = new Date();
      return (
        saleDate.getDate() === today.getDate() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear()
      );
    } else if (filter === "byDate") {
      // Show sales for the selected date
      return (
        saleDate.getDate() === selectedDate.getDate() &&
        saleDate.getMonth() === selectedDate.getMonth() &&
        saleDate.getFullYear() === selectedDate.getFullYear()
      );
    }

    return true;
  });

  // Handle Payment Received
  const handlePaymentReceived = async (saleId, productId) => {
    setUpdating(true);
    try {
      refreshProducts();
      await handlePaymentReceivedAPI(saleId, productId);
      refreshSales();
    } catch (error) {
      console.error("Error handling payment received:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Handle Return
  const handleReturn = async (saleId, productId) => {
    setUpdating(true);
    try {
      await handleReturnAPI(saleId, productId);
      refreshSales();
      refreshProducts();
    } catch (error) {
      console.error("Error handling return:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <>
        <ResponsiveAppBar />
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 4 }}>
          No sales data available.
        </Typography>
      </>
    );
  }

  return (
    <>
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
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: "1200px",
          margin: "7vh auto",
          backgroundColor: "background.default",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" }, color: "black" }}
        >
          Track Payments
        </Typography>

        {/* Filter Section */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <ButtonGroup variant="contained">
            <Button onClick={() => setFilter("today")}>Today</Button>
            <Button onClick={() => setFilter("byDate")}>By Date</Button>
          </ButtonGroup>
          {filter === "byDate" && (
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        </Box>

        {/* Sales Table */}
        <Grid container spacing={3}>
          {filteredSales.length === 0 ? (
            <Typography variant="h6" align="center" color="textSecondary">
              No sales data available for the selected filter.
            </Typography>
          ) : (
            filteredSales.map((sale) => (
              <Grid item xs={12} key={sale._id}>
                <Box
                  sx={{
                    mb: 3,
                    pb: 2,
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    p: { xs: 2, sm: 3 },
                  }}
                >
                  <Typography variant="h6" color="primary">
                    Shop Name: {sale.shopName} | Date:{" "}
                    {new Date(sale.date).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "black" }}>
                    <strong>Total Amount:</strong> Rs. {sale.totalAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "black" }}>
                    <strong>Total Profit:</strong> Rs. {sale.totalProfit.toFixed(2)}
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Product Name</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Quantity</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Price (Rs.)</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Total (Rs.)</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Profit (Rs.)</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Payment Status</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Actions</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sale.products.map((product) => (
                          <TableRow key={product.productId}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>Rs. {product.price.toFixed(2)}</TableCell>
                            <TableCell>Rs. {product.total.toFixed(2)}</TableCell>
                            <TableCell>Rs. {product.profit.toFixed(2)}</TableCell>
                            <TableCell>{product.paymentStatus}</TableCell>
                            <TableCell>
                              {product.paymentStatus === "pending" && (
                                <>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    disabled={updating}
                                    sx={{ mr: 1 }}
                                    onClick={() =>
                                      handleReturn(sale._id, product.productId)
                                    }
                                  >
                                    Returned
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    disabled={updating}
                                    onClick={() =>
                                      handlePaymentReceived(
                                        sale._id,
                                        product.productId
                                      )
                                    }
                                  >
                                    Payment Received
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
};

export default TrackPayment;
