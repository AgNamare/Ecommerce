import express, { Router } from "express";
import {
  getCartHandler,
  updateCartHandler,
  mergeCartHandler,
  deleteProductHandler,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.get("/:id", verifyJWT, getCartHandler);
router.post("/:id", verifyJWT, updateCartHandler);
router.post("/merge/:id", mergeCartHandler);
router.delete("/product/:id", verifyJWT, deleteProductHandler);

export default router;
