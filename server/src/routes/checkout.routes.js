import { Router } from "express";
import { initiateCheckoutHandler } from "../controllers/checkout.controllers.js";
import { callBackHandler, mpesaPaymentHandler, getPaymentHandler } from "../controllers/payments.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post("/initiate", verifyJWT,  initiateCheckoutHandler);
router.post("/payment/mpesa", verifyJWT, mpesaPaymentHandler);
router.post("/payment/mpesa/callback", callBackHandler);
router.get("/payment/mpesa/processing/:id", verifyJWT, getPaymentHandler);

export default router;
