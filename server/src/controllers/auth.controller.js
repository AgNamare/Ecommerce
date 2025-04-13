import {
  createUser,
  updateUser,
  verifyUser,
  resetPassword,
  updatePassword,
  logIn,
  resendOtp,
  createAdmin,
  loginAdmin,
  verifyRegisteredOTP,
} from "../services/auth.service.js";
import { userExists } from "../utils/userUtils.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import mongoose from "mongoose";

export const createUserHandler = async (req, res, next) => {
  try {
    console.log(req.body);
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const verifyUserHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyUser(email, otp);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req.body);
    res.status(200).json("User Updated");
  } catch (error) {
    next(error);
  }
};

export const resetPasswordHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    const password = await resetPassword(email);
    res.status(200).json("Verification Code Sent");
  } catch (error) {
    next(error);
  }
};


export const verifyRegisteredOTPHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const isSuccess = await verifyRegisteredOTP(email, otp);
    res.status(200).json(isSuccess)
  } catch (error) {
    next(error);
  }
};

export const updatePasswordHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const pass = await updatePassword(email, password);
    console.log(password);
    res.status(200).json("Password Updated");
  } catch (error) {
    next(error);
  }
};

export async function logInHandler(req, res, next) {
  try {
    const { email, password } = req.body;
    const { accessToken, user, generatedRefreshToken } = await logIn(
      email,
      password
    );

    // Set cookies
    res.cookie("refreshToken", generatedRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true, // Change to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
}

export const resendOtpHandler = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const code = await resendOtp(email);
    res.status(200).json("OTP Resent");
  } catch (error) {
    next(error);
  }
};

export const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  console.log("handleRefreshToken: cookies", cookies);
  if (!cookies?.refreshToken) {
    console.log("handleRefreshToken: no refresh token in cookies");
    return res.sendStatus(401);
  }
  const refreshToken = cookies.refreshToken;
  const foundUser = User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    console.log("handleRefreshToken: no user found with refresh token");
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("handleRefreshToken: error verifying refresh token", err);
      return res.sendStatus(403);
    }
    if (foundUser.username !== decoded.username) {
      console.log("handleRefreshToken: user mismatch");
      return res.sendStatus(403);
    }
    console.log("handleRefreshToken: generating new access token");
    const accessToken = jwt.sign(
      { email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME }
    );
    res.json({ accessToken });
  });
};

export const logoutHandler = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);

    const refreshToken = cookies.refreshToken;

    // Await the User.findOne call
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie("accessToken", { httpOnly: true });
      res.clearCookie("refreshToken", { httpOnly: true });
      return res.sendStatus(204);
    }

    // Clear the refresh token
    foundUser.refreshToken = "";
    await foundUser.save(); // This should work now

    // Clear cookies
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const registerAdminController = async (req, res, next) => {
  try {
    const newAdmin = await createAdmin(req.body);
    res.json(newAdmin).status(201);
  } catch (error) {
    next(error);
  }
};

export const loginAdminController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and Password are required.");
    }
    const { accessToken, admin, refreshToken } = await loginAdmin(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ admin, accessToken });
  } catch (error) {
    next(error);
  }
};

export const handleAdminRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  console.log("handleAdminRefreshToken: cookies", cookies);

  // Check if the JWT cookie is present
  if (!cookies?.refreshToken) {
    console.log("handleAdminRefreshToken: no JWT cookie found");
    return res.sendStatus(401); // Use sendStatus for a more concise response
  }

  const refreshToken = cookies.refreshToken;

  console.log("refreshToken, ", refreshToken);

  try {
    // Find the admin associated with the refresh token
    const foundAdmin = await Admin.findOne({ refreshToken }).exec();
    console.log(foundAdmin);
    if (!foundAdmin) {
      console.log("handleAdminRefreshToken: no admin found with refresh token");
      return res.sendStatus(403); // Forbidden
    }

    console.log("handleAdminRefreshToken: found admin", foundAdmin);

    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.ADMIN_REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.log(
            "handleAdminRefreshToken: error verifying refresh token",
            err
          );
          return res.sendStatus(403); // Forbidden
        }

        if (foundAdmin.email !== decoded.email) {
          console.log("handleAdminRefreshToken: user mismatch");
          return res.sendStatus(403); // Forbidden
        }

        console.log("handleAdminRefreshToken: generating new access token");

        // Create a new access token
        const accessToken = jwt.sign(
          {
            AdminInfo: {
              email: decoded.email,
              role: foundAdmin.role,
            },
          },
          process.env.ADMIN_ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME }
        );

        console.log(
          "handleAdminRefreshToken: sending new access token",
          accessToken
        );

        // Send the new access token as a response
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error("handleAdminRefreshToken: error", error); // Log the error for debugging
    res.sendStatus(500); // Internal Server Error
  }
};
