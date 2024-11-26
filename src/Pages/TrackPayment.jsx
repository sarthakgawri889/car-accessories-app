import { useContext, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
} from "@mui/material";
import ResponsiveAppBar from "../Components/ResponsiveAppBar";
import { SalesContext } from "../context/SalesContext";

const TrackPayment = () => {
  const { sales, loading } = useContext(SalesContext); // Mocking sales context
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredSales, setFilteredSales] = useState([]);

  // Filter sales when the "Filter" button is clicked
  const handleFilter = () => {
    const filtered = sales.filter((sale) => {
      const saleDate = new Date(sale.date).toLocaleDateString();
      const selected = new Date(selectedDate).toLocaleDateString();
      return saleDate === selected;
    });
    setFilteredSales(filtered);
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }} mb={3}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <Button variant="contained" color="primary" onClick={handleFilter}>
              Filter Sales
            </Button>
          </Box>
          <Grid container spacing={3}>
            {(filteredSales.length > 0 ? filteredSales : sales).map((sale) => (
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
                    Shop Name: {sale.shopName} | Date: {new Date(sale.date).toLocaleString()}
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default TrackPayment;
