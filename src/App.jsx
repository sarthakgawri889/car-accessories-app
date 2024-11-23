import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import InventoryPage from "./Pages/InventoryPage";
import SellPage from "./Pages/SellPage";
import TrackSalesProfit from "./Pages/TrackSalesProfit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/itemSell" element={<SellPage />} />
        <Route path="/track" element={<TrackSalesProfit />} />

      </Routes>
    </Router>
  );
}

export default App;
