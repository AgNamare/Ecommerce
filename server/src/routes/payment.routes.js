import { Router } from "express";
import {
  mpesaPaymentHandler,
  callBackHandler,
  registerURLHandler,
} from "../controllers/payments.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post("/mpesa", mpesaPaymentHandler);
router.post("/mpesa/callback", callBackHandler);
router.post("/mpesa/registerurl", registerURLHandler);

export default router;
