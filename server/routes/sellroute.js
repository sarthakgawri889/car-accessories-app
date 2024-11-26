import express from "express";
import { getSales, recordSale,handleReturn,handlePaymentReceived } from "../controller/sell-controller.js";

const selroute = express.Router();

// Route to record a sale
selroute.post("/", recordSale);
selroute.get("/:userId", getSales);
// Route to handle product return
selroute.put("/return", handleReturn);

// Route to update payment received status
selroute.put("/payment-received", handlePaymentReceived);
export default selroute;
