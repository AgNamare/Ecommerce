import express from "express";
import {
  postProductHandler,
  getProductsPageHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
} from "../controllers/products.controller.js";
import {
  addStockController,
  updateStockController,
  deleteStockController,
  createStockLevelsForAllBranches,
} from "../controllers/stocks.controller.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyAdminJWT } from "../middlewares/verifyAdminJWT.js";

const router = express.Router();

router.post("/", verifyAdminJWT, verifyRoles("admin"), postProductHandler);
router.put("/:id", verifyAdminJWT, verifyRoles("admin"), updateProductHandler);
router.delete("/", verifyAdminJWT, verifyRoles("admin"), deleteProductHandler);
router.get("/:id", getProductHandler);
router.get("/", getProductsPageHandler);

// Route to add a new stock entry
router.post("/stocks", addStockController);
router.post("/stocks/new", createStockLevelsForAllBranches);
// Route to update an existing stock entry
router.put("/stocks/:id", updateStockController);
// Route to delete a stock entry
router.delete("/stocks/:id", deleteStockController);

export default router;
