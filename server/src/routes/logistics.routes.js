import express from "express";
import {
  getLogisticsController,
  getLogisticsByIdController,
  createLogisticsController,
  updateLogisticsController,
  deleteLogisticsController,
} from "../controllers/logistics.controllers.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyAdminJWT } from "../middlewares/verifyAdminJWT.js";

const router = express.Router();

router.get("/", verifyAdminJWT, verifyRoles("admin"), getLogisticsController);
router.get(
  "/:id",
  verifyAdminJWT,
  verifyRoles("admin"),
  getLogisticsByIdController
);
router.post(
  "/",
  verifyAdminJWT,
  verifyRoles("admin"),
  createLogisticsController
);
router.put(
  "/:id",
  verifyAdminJWT,
  verifyRoles("admin"),
  updateLogisticsController
);
router.delete(
  "/:id",
  verifyAdminJWT,
  verifyRoles("admin"),
  deleteLogisticsController
);

export default router;
