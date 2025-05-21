import { Router } from "express";
import {
  getUsersPageHandler,
  updateUserHandler,
  getUserHandler,
  getUserOrdersHandler,
} from "../controllers/admUsers.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.get("/", getUsersPageHandler);
router.get("/:id/orders", getUserOrdersHandler);
router.put("/:id", updateUserHandler);
router.get("/:id", getUserHandler);
// router.delete("/", deleteProductHandler);
// router.get("/:id", getProductHandler);

export default router;
