import  { useState, useContext, useEffect } from "react";
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
  CircularProgress,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "../service/expapi.js";
import { CurrentUserContext } from "../context/CurrentUserContext";
import ResponsiveAppBar from "../Components/ResponsiveAppBar.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const { currentUser,loading } = useContext(CurrentUserContext);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    date: "",
    paymentType: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const pages = ["Expenses Summary"];
  const handleNavigation = (page) => {
  if(page==="Expenses Summary")
    if (isAuthenticated) {
      navigate("/expenseSummary");
    } else {
      loginWithRedirect();
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchExpenses();
    }
  }, [currentUser]);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(currentUser.sub);
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleAddOrEdit = async () => {
    const expenseData = {
      userId: currentUser.sub,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: newExpense.date,
      paymentType: newExpense.paymentType,
    };

    try {
      if (isEditing) {
        await updateExpense(editingExpenseId, expenseData);
      } else {
        await addExpense(expenseData);
      }
      setIsEditing(false);
      setEditingExpenseId(null);
      setNewExpense({ amount: "", description: "", date: "", paymentType: "" });
      fetchExpenses(); // Refresh the expense list
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      fetchExpenses(); // Refresh the expense list
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const handleEdit = (expense) => {
    setIsEditing(true);
    setEditingExpenseId(expense._id);
    setNewExpense(expense);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  

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
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop : '9vh'
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            margin: "20px 0",
            fontSize: "2.5rem",
            color: "black",
          }}
        >
          Manage Your Expenses
        </Typography>

        {/* Form */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Amount (₹)"
            name="amount"
            value={newExpense.amount}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={newExpense.description}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={newExpense.date}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Payment Type"
            name="paymentType"
            value={newExpense.paymentType}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleAddOrEdit}
            sx={{
              width: "100%",
              marginTop: "10px",
              backgroundColor: "blue",
            }}
          >
            {isEditing ? "Update" : "Add"}
          </Button>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            marginTop: "20px",
            borderRadius: "15px",
            boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)",
            width: "80%",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{expense.paymentType}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(expense)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(expense._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary */}
        <Box  sx={{ marginTop: "20px", textAlign: "center" }}>
        {pages.map((page) => (
              <Button
              variant="contained"
                key={page}
                onClick={() => handleNavigation(page)}
                sx={{ my: 2, display: "block" }}
              >
                {page}
              </Button>
            ))}
        </Box>
      </Box>
    </>
  );
}

export default ExpensePage;
