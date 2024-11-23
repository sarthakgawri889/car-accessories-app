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
  const [view, setView] = useState("daily");

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

  const groupSalesByPeriod = (sales, period) => {
    return sales.reduce((acc, sale) => {
      const saleDate = new Date(sale.date);
      let key;

      if (period === "daily") {
        if (
          saleDate.getDate() === currentDate.getDate() &&
          saleDate.getMonth() === currentDate.getMonth() &&
          saleDate.getFullYear() === currentDate.getFullYear()
        ) {
          key = saleDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      } else if (period === "monthly") {
        if (
          saleDate.getMonth() === currentDate.getMonth() &&
          saleDate.getFullYear() === currentDate.getFullYear()
        ) {
          key = saleDate.toLocaleDateString("en-US", { month: "short" });
        }
      } else if (period === "yearly") {
        if (saleDate.getFullYear() === currentDate.getFullYear()) {
          key = saleDate.toLocaleDateString("en-US", { year: "numeric" });
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

  const totalProfit = Object.values(groupedSales).reduce(
    (acc, data) => acc + data.totalProfit,
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.text("Sales and Profit Report", 14, yPosition);
    yPosition += 10;

    Object.entries(groupedSales).forEach(([period, data]) => {
      doc.text(`${period}`, 14, yPosition);
      yPosition += 10;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

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

      yPosition = doc.lastAutoTable.finalY + 10;
    });

    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`Total Profit: Rs. ${totalProfit.toFixed(2)}`, 14, yPosition);

    doc.save("Sales_Report.pdf");
  };

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
          <Typography variant="h6" sx={{ color: "black" }}>
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
          minHeight: "100vh", // Full height
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", sm: "2.125rem" },
            color: "black",
          }}
        >
          Sales and Profit Report
        </Typography>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <ButtonGroup
            variant="contained"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              "& .MuiButton-root": {
                minWidth: "120px",
                flexGrow: 1,
              },
              "@media (max-width:600px)": {
                gap: 0.5,
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
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              color: "black",
            }}
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
