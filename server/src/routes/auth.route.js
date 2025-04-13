import express from "express";
import {
  createUserHandler,
  logInHandler,
  verifyUserHandler,
  resetPasswordHandler,
  updatePasswordHandler,
  resendOtpHandler,
  handleRefreshToken,
  logoutHandler,
  registerAdminController,
  loginAdminController,
  handleAdminRefreshToken,
  verifyRegisteredOTPHandler,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", createUserHandler);
router.post("/verify-user", verifyUserHandler);
router.post("/reset-password", resetPasswordHandler);
router.put("/update-password", updatePasswordHandler);
router.post("/sign-in", logInHandler);
router.post("/resend-otp", resendOtpHandler);
router.post("/verify-registered", verifyRegisteredOTPHandler);
router.get("/refresh-token", handleRefreshToken);
router.post("/logout", logoutHandler);
router.post("/admin/register", registerAdminController);
router.post("/admin/login", loginAdminController);
router.get("/admin/refresh-token", handleAdminRefreshToken);

export default router;
