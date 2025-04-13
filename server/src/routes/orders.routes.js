import express from "express";
import {
  getAllOrdersController,
  getOrderController,
  getOrdersByUserIdController,
  updateOrderStatusByUser,
  updateOrderLogisticsController,
} from "../controllers/orders.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyAdminJWT } from "../middlewares/verifyAdminJWT.js";

const router = express.Router();

// Route to get orders by user ID
router.get("/user/orders", verifyJWT, getOrdersByUserIdController);
router.get("/", getAllOrdersController);
router.get("/:orderId", getOrderController);
router.put(
  "/update-status/:orderId",

  verifyAdminJWT,
  verifyRoles("admin"),
  updateOrderStatusByUser
);
router.put(
  "/update-logistics/:orderId",

  verifyAdminJWT,
  verifyRoles("admin"),
  updateOrderLogisticsController
);

export default router;
