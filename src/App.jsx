import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import InventoryPage from "./Pages/InventoryPage";
import SellPage from "./Pages/SellPage";
import TrackSalesProfit from "./Pages/TrackSalesProfit";
import TrackPayment from "./Pages/TrackPayment";
import ExpensePage from "./Pages/ExpensePage";
import ExpenseSummary from "./Pages/ExpenseSummary";
import SoldProducts from "./Pages/SoldProducts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/itemSell" element={<SellPage />} />
        <Route path="/track" element={<TrackSalesProfit />} />
        <Route path="/trackpay" element={<TrackPayment />} />
        <Route path="/expense" element={<ExpensePage />} />
        <Route path="/expenseSummary" element={<ExpenseSummary />} />
        <Route path="/order" element={<SoldProducts />} />

      </Routes>
    </Router>
  );
}

export default App;
