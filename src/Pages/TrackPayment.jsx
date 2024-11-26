import  { useContext, useState } from "react";
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
  TextField,
} from "@mui/material";
import ResponsiveAppBar from "../Components/ResponsiveAppBar";
import { handleReturnAPI, handlePaymentReceivedAPI } from "../service/sellapi";
import { ProductContext } from "../context/ProductContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const TrackPayment = () => {
  const { sales, loading, refreshSales } = useContext(SalesContext);
  const { refreshProducts } = useContext(ProductContext);
  const [updating, setUpdating] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today's date
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handlePaymentReceived = async (saleId, productId) => {
    setUpdating(true);
    try {
      await handlePaymentReceivedAPI(saleId, productId);
      refreshSales();
      refreshProducts();
    } catch (error) {
      console.error("Error handling payment received:", error);
    } finally {
      setUpdating(false);
    }
  };

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

  const filteredSales = sales.filter((sale) =>
    dayjs(sale.date).isSame(selectedDate, "day")
  );

  

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
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1200px", margin: "7vh auto",backgroundColor: "white",minHeight:'100%' }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" }, color: "black" }}

        >
          Track Payments
        </Typography>

        {/* Date Filter */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <DatePicker
            label="Filter by Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>

        {filteredSales.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 4 }}>
            No sales data available for the selected date.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredSales.map((sale) => (
              <Grid item xs={12} key={sale._id}>
                <Box sx={{ mb: 3, pb: 2, borderBottom: "1px solid #e0e0e0", p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" color="primary">
                    Shop Name: {sale.shopName} | Date: {dayjs(sale.date).format("DD/MM/YYYY")}
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Product Name</strong></TableCell>
                          <TableCell><strong>Quantity</strong></TableCell>
                          <TableCell><strong>Price (Rs.)</strong></TableCell>
                          <TableCell><strong>Total (Rs.)</strong></TableCell>
                          <TableCell><strong>Profit (Rs.)</strong></TableCell>
                          <TableCell><strong>Payment Status</strong></TableCell>
                          <TableCell><strong>Actions</strong></TableCell>
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
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
        alignItems: { xs: "stretch", sm: "center" }, // Full width for mobile
        gap: 1, // Space between buttons
      }}
    >
      <Button
        size="small"
        variant="outlined"
        color="secondary"
        disabled={updating}
        onClick={() => handleReturn(sale._id, product.productId)}
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font for mobile
          padding: { xs: "6px 8px", sm: "8px 16px" }, // Compact padding for mobile
        }}
      >
        Returned
      </Button>
      <Button
        size="small"
        variant="contained"
        color="primary"
        disabled={updating}
        onClick={() => handlePaymentReceived(sale._id, product.productId)}
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font for mobile
          padding: { xs: "6px 8px", sm: "8px 16px" }, // Compact padding for mobile
        }}
      >
        Payment Received
      </Button>
    </Box>
  )}
</TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default TrackPayment;
