import express from "express";
import {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} from "../controller/product-controller.js";

const prodroute = express.Router();

prodroute.get("/:userId", getProducts);
prodroute.post("/", addProduct);
prodroute.put("/:productId", updateProduct);
prodroute.delete("/:productId", deleteProduct);

export default prodroute;
