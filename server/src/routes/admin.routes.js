import { Router } from "express";
import { getAllOrdersController } from "../controllers/orders.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { registerAdminController } from "../controllers/auth.controller.js";

const router = Router();

router.get("/orders", verifyJWT, getAllOrdersController);
router.put("/:id", updateUserHandler);
router.get("/:id", getUserHandler);

// router.delete("/", deleteProductHandler);
// router.get("/:id", getProductHandler);

export default router;
