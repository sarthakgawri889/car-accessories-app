import { useContext, useState } from "react";
import { SalesContext } from "../context/SalesContext";
import {
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
  ButtonGroup,
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ResponsiveAppBar from "../Components/ResponsiveAppBar";

const TrackSalesProfit = () => {
  const { sales, loading } = useContext(SalesContext);
  const [view, setView] = useState("daily"); // Options: "daily", "monthly", "yearly"

  const currentDate = new Date();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <Typography
        variant="h6"
        align="center"
        color="textSecondary"
        sx={{ mt: 4 }}
      >
        No sales data available.
      </Typography>
    );
  }

  // Helper function to group sales based on the view
  const groupSalesByPeriod = (sales, period) => {
    return sales.reduce((acc, sale) => {
      const saleDate = new Date(sale.date);
      let key;

      if (period === "daily") {
        // Filter sales for today only
        if (
          saleDate.getDate() === currentDate.getDate() &&
          saleDate.getMonth() === currentDate.getMonth() &&
          saleDate.getFullYear() === currentDate.getFullYear()
        ) {
          key = saleDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      } else if (period === "monthly") {
        // Filter sales for the current month, grouped by day
        if (
          saleDate.getMonth() === currentDate.getMonth() &&
          saleDate.getFullYear() === currentDate.getFullYear()
        ) {
          key = saleDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      } else if (period === "yearly") {
        // Filter sales for the current year, grouped by month
        if (saleDate.getFullYear() === currentDate.getFullYear()) {
          key = saleDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        }
      }

      if (key) {
        if (!acc[key]) {
          acc[key] = { totalAmount: 0, totalProfit: 0, details: [] };
        }
        acc[key].totalAmount += sale.totalAmount;
        acc[key].totalProfit += sale.totalProfit;
        acc[key].details.push(sale);
      }
      return acc;
    }, {});
  };

  const groupedSales = groupSalesByPeriod(sales, view);

  // Calculate total profit for the current view (daily, monthly, yearly)
  const totalProfit = Object.values(groupedSales).reduce(
    (acc, data) => acc + data.totalProfit,
    0
  );

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20; // Starting position for the content
  
    doc.text("Sales and Profit Report", 14, yPosition);
    yPosition += 10;
  
    // Iterate through grouped sales data
    Object.entries(groupedSales).forEach(([period, data]) => {
      // Add period header
      doc.text(`${period}`, 14, yPosition);
      yPosition += 10;
  
      // Check if content will overflow the page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
  
      // Add sales table for the period
      doc.autoTable({
        startY: yPosition,
        head: [
          [
            "Shop Name",
            "Product Name",
            "Quantity",
            "Price (Rs.)",
            "Total (Rs.)",
            "Profit (Rs.)",
          ],
        ],
        body: data.details.flatMap((sale) =>
          sale.products.map((product, prodIdx) => [
            prodIdx === 0 ? sale.shopName : "",
            product.name,
            product.quantity,
            product.price.toFixed(2),
            product.total.toFixed(2),
            product.profit.toFixed(2),
          ])
        ),
        theme: "grid",
      });
  
      // Update the yPosition to the next section
      yPosition = doc.lastAutoTable.finalY + 10;
    });
  
    // Add total profit at the end of the report
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`Total Profit: Rs. ${totalProfit.toFixed(2)}`, 14, yPosition);
  
    // Save the generated PDF
    doc.save("Sales_Report.pdf");
  };
  

  // Render grouped sales
  const renderSalesReport = (groupedSales) => (
    <Grid item xs={12}>
      {Object.entries(groupedSales).map(([period, data]) => (
        <Box
          key={period}
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
            {period}
          </Typography>
          <Typography variant="body1">
            <strong>Total Amount:</strong> Rs. {data.totalAmount.toFixed(2)}
          </Typography>
          <Typography variant="body1">
            <strong>Total Profit:</strong> Rs. {data.totalProfit.toFixed(2)}
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Shop Name</strong>
                  </TableCell>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {data.details.map((sale, idx) =>
                  sale.products.map((product, prodIdx) => (
                    <TableRow key={`${idx}-${prodIdx}`}>
                      {prodIdx === 0 && (
                        <TableCell rowSpan={sale.products.length}>{sale.shopName}</TableCell>
                      )}
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>Rs. {product.price.toFixed(2)}</TableCell>
                      <TableCell>Rs. {product.total.toFixed(2)}</TableCell>
                      <TableCell>Rs. {product.profit.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Grid>
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
          sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" , color:'black'} }}
        >
          Sales and Profit Report
        </Typography>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <ButtonGroup
            variant="contained"
            sx={{
              display: "flex",
              flexWrap: "wrap", // Allow buttons to wrap on smaller screens
              justifyContent: "center", // Center align the buttons
              gap: 1, // Add spacing between buttons
              "& .MuiButton-root": {
                minWidth: "120px", // Ensure buttons are uniformly sized
                flexGrow: 1, // Make buttons grow evenly
              },
            }}
          >
            <Button onClick={() => setView("daily")}>Daily Sales</Button>
            <Button onClick={() => setView("monthly")}>Monthly Sales</Button>
            <Button onClick={() => setView("yearly")}>Yearly Sales</Button>
          </ButtonGroup>
        </Box>
        <Grid container spacing={3}>
          {renderSalesReport(groupedSales)}
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" , color:'black' } }}
          >
            Total Profit: Rs. {totalProfit.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={generatePDF}
            sx={{ mt: { xs: 0, sm: 0 } }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TrackSalesProfit;
