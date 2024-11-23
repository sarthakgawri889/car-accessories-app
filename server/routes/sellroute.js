import express from "express";
import { getSales, recordSale } from "../controller/sell-controller.js";

const selroute = express.Router();

// Route to record a sale
selroute.post("/", recordSale);
selroute.get("/:userId", getSales);

export default selroute;
