import express from "express";
import { authenticate } from "../middlewares/authentation.middleware.js";

import {
  homeProductsPageHandler,
  getProductHandler,
  postCartProductsHandler,
  getBestSellersHandler,
  searchProductsHandler,
  getProductsByCategoryHandler,
  getBranchesHandler,
  getSubcategoryHandler,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", homeProductsPageHandler);
router.get("/branch", getBranchesHandler);
router.get("/search", searchProductsHandler);
router.get("/category", getProductsByCategoryHandler);
router.get("/:id", getProductHandler);
router.post("/cart", authenticate, postCartProductsHandler);
router.get("/best-sellas", getBestSellersHandler);
router.get("/branchess", getBranchesHandler);
router.get("/category/subcategory", getSubcategoryHandler);

export default router;
