import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {requireFeature} from "../middlewares/requireAccess.js"

import {
  createOrder,
  downloadOrdersPDF,
  downloadOrdersExcel,
  getAllOrder
} from "../controllers/order.controller.js";

const router = express.Router();



router.post("/", protect,requireFeature("Order"),createOrder);
router.get("/download-pdf",protect,requireFeature("Order"),downloadOrdersPDF); 
router.get("/download-excel",protect,requireFeature("Order"), downloadOrdersExcel);
router.get("/",protect,requireFeature("Order"),getAllOrder);
export default router;