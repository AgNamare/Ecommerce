import { Router } from "express";
import {
  createAddressHandler,
  deleteAddressHandler,
  getAddressHandler,
  getAddressesHandler,
  updateAddressHandler,
} from "../controllers/address.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.get("/:userId", verifyJWT, getAddressesHandler);
router.get("/:id", verifyJWT, getAddressHandler);
router.put("/:id", verifyJWT, updateAddressHandler);
router.delete("/:userId/:id", verifyJWT, deleteAddressHandler);
router.post("/", verifyJWT, createAddressHandler);

export default router
