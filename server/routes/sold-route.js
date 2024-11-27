import express from "express";

import {getSoldProduct,deleteSoldProduct } from "../controller/sell-controller.js";

const soldroute = express.Router();
soldroute.get("/:userId", getSoldProduct);

soldroute.delete("/:userId/:productId", deleteSoldProduct);

export default soldroute;