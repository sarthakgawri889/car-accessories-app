import  { useState, useContext, useEffect } from "react";
import {
  Box,
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
  Button,
  ButtonGroup,
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getExpenses } from "../service/expapi.js";
import { CurrentUserContext } from "../context/CurrentUserContext";
import ResponsiveAppBar from "../Components/ResponsiveAppBar";

const ExpenseSummary = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("daily"); // Options: "daily", "monthly", "yearly"

  const currentDate = new Date();

  useEffect(() => {
    if (currentUser) {
      fetchExpenses();
    }
  }, [currentUser]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses(currentUser.sub);
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <>
        <ResponsiveAppBar />
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 4 }}>
          No expense data available.
        </Typography>
      </>
    );
  }

  const groupExpensesByPeriod = (expenses, period) => {
    return expenses.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      let key;

      if (period === "daily") {
        if (
          expenseDate.getDate() === currentDate.getDate() &&
          expenseDate.getMonth() === currentDate.getMonth() &&
          expenseDate.getFullYear() === currentDate.getFullYear()
        ) {
          key = expenseDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      } else if (period === "monthly") {
        if (
          expenseDate.getMonth() === currentDate.getMonth() &&
          expenseDate.getFullYear() === currentDate.getFullYear()
        ) {
          key = expenseDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      } else if (period === "yearly") {
        if (expenseDate.getFullYear() === currentDate.getFullYear()) {
          key = expenseDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        }
      }

      if (key) {
        if (!acc[key]) {
          acc[key] = { totalAmount: 0, details: [] };
        }

        acc[key].totalAmount += parseFloat(expense.amount);
        acc[key].details.push(expense);
      }

      return acc;
    }, {});
  };

  const groupedExpenses = groupExpensesByPeriod(expenses, view);

  const totalExpenses = Object.values(groupedExpenses).reduce(
    (acc, data) => acc + data.totalAmount,
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;
  
    doc.text("Expense Summary Report", 14, yPosition);
    yPosition += 10;
  
    // Loop through grouped expenses and add each group to the PDF
    Object.entries(groupedExpenses).forEach(([period, data]) => {
      // Add the period title
      doc.setFontSize(12);
      doc.text(`${period}`, 14, yPosition);
      yPosition += 6;
  
      // Add the table of expenses for the period
      doc.autoTable({
        startY: yPosition,
        head: [["Description", "Date", "Amount", "Payment Type"]],
        body: data.details.map((expense) => [
          expense.description,
          new Date(expense.date).toLocaleDateString(),
          `${expense.amount.toFixed(2)} Rs.`,
          expense.paymentType,
        ]),
        theme: "grid",
      });
  
      // Update yPosition to reflect the table's end position
      yPosition = doc.lastAutoTable.finalY + 10;
  
      // Add the total amount for the period
      doc.setFontSize(12);
      doc.text(`Total Amount : ${data.totalAmount.toFixed(2)} Rs.`, 14, yPosition);
      yPosition += 10;
  
      // Add a page break if needed
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
  
    // Add the grand total at the end
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(14);
    doc.text(`Grand Total Expenses: ${totalExpenses.toFixed(2)} Rs.`, 14, yPosition);
  
    // Save the PDF
    doc.save("Expense_Summary_Report.pdf");
  };
  

  const renderExpenseReport = (groupedExpenses) => (
    <Grid item xs={12}>
      {Object.entries(groupedExpenses).map(([period, data]) => (
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
          <Typography variant="body1" style={{ color: "black" }}>
            <strong>Total Amount:</strong> ₹{data.totalAmount.toFixed(2)}
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  
                  <TableCell>
                    <strong>Amount (₹)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Payment Type</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.details.map((expense, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{expense.description}</TableCell>
                   
                    <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.paymentType}</TableCell>
                  </TableRow>
                ))}
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
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" }, color: "black" }}
        >
          Expense Summary Report
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
            }}
          >
            <Button onClick={() => setView("daily")}>Today Expenses</Button>
            <Button onClick={() => setView("monthly")}>Daily Expenses</Button>
            <Button onClick={() => setView("yearly")}>Monthly Expenses</Button>
          </ButtonGroup>
        </Box>
        <Grid container spacing={3}>
          {renderExpenseReport(groupedExpenses)}
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
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, color: "black" }}
          >
            Total Expenses: ₹{totalExpenses.toFixed(2)}
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

export default ExpenseSummary;
