import express from "express";

const router = express.Router();

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPaginatedCategories,
  addProducts,
} from "../controllers/category.controller.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyAdminJWT } from "../middlewares/verifyAdminJWT.js";

router.get(
  "/",
  verifyAdminJWT,
  verifyRoles("SuperAdmin", "admin"),
  getAllCategories
);

router.get(
  "/paginated",
  verifyAdminJWT,
  verifyRoles("admin"),
  getPaginatedCategories
);

router.post("/products", verifyAdminJWT, verifyRoles("admin"), addProducts);

router.get("/:id", verifyAdminJWT, verifyRoles("admin"), getCategoryById);

router.post("/", verifyAdminJWT, verifyRoles("admin"), createCategory);

router.put("/:id", verifyAdminJWT, verifyRoles("admin"), updateCategory);

router.delete(
  "/:id",
  verifyAdminJWT,
  verifyRoles("admin", "superAdmin"),
  deleteCategory
);

export default router;
