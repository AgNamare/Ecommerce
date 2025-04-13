import User from "../models/user.model.js";
import {
  generateAdminAccessToken,
  generateAdminRefreshToken,
  generateRefreshToken,
  userExists,
} from "../utils/userUtils.js";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/verificationUtils.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/userUtils.js";
import Cart from "../models/cart.models.js";
import mongoose from "mongoose";
import Admin from "../models/admin.model.js";
import PendingUser from "../models/pendingUser.model.js";

export const createUser = async (userData) => {
  console.log("Creating new user with data:", userData);

  const { password, email, ...rest } = userData;

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user already exists in PendingUser or User collections
    console.log(
      "Checking if user already exists in PendingUser or User collections"
    );
    const existingPendingUser = await PendingUser.findOne({ email }).session(
      session
    );
    const existingUser = await User.findOne({ email }).session(session);

    if (existingPendingUser) {
      console.log("User already registered. Please Enter Verification Code");
      const err = new Error(
        "User already registered. Please Enter Verification Code"
      );
      err.statusCode = 400; // You can customize the status code here (e.g., 400 for bad request)
      throw err;
    }

    if (existingUser) {
      console.log("User already exists. Login");
      const err = new Error("User already exists. Login");
      err.statusCode = 409; // Conflict status for already existing user
      throw err;
    }

    // Hash password and generate verification code
    console.log("Hashing password and generating verification code");
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationCode = generateVerificationCode();

    // Create and save the pending user with hashed password
    console.log("Creating and saving the pending user with hashed password");
    const newPendingUser = new PendingUser({
      ...rest,
      password: hashedPassword,
      email,
      verificationCode,
    });
    await newPendingUser.save({ session });

    // Send verification code to user's phone number (handle error after commit)
    console.log("Sending verification code to user's phone number");
    try {
      await sendVerificationCode(newPendingUser.email, verificationCode);
      await session.commitTransaction();
    } catch (error) {
      // Abort the transaction if verification code cannot be sent
      console.log("Error sending verification code:", error.message);
      await session.abortTransaction();

      // Throw error with custom message and status code
      const err = new Error("Failed to send verification code");
      err.statusCode = 500; // Internal server error if the sending fails
      throw err;
    }

    // Omit sensitive fields from returned user object
    const { password: pass, ...pendingUser } = newPendingUser.toObject();

    // End the session
    console.log("Ending the session");
    session.endSession();

    return pendingUser;
  } catch (error) {
    // Abort transaction on any error before commit
    console.log("Error creating user:", error.message);
    await session.abortTransaction();
    session.endSession(); // End the session after aborting

    // If the error is already thrown with a message and status code, propagate that error
    if (error.statusCode) {
      throw error; // Re-throw the error as it is
    }

    // If the error doesn't have a status code (e.g., unexpected error), create a new one
    const err = new Error("Internal Server Error. Please Try Again");
    err.statusCode = 500;
    throw err;
  }
};

export const verifyUser = async (email, code) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check if the PendingUser exists
    const pendingUser = await PendingUser.findOne({ email }).session(session);
    if (!pendingUser) {
      const error = new Error("Verification expired");
      error.statusCode = 400; // Specific error for expired verification
      throw error;
    }

    // Step 2: Verify the code
    if (Number(pendingUser.verificationCode) !== Number(code)) {
      const error = new Error("Invalid verification code");
      error.statusCode = 400; // Specific error for invalid code
      throw error;
    }

    // Step 3: Create a new cart
    const cart = new Cart();
    try {
      await cart.save({ session });
    } catch (error) {
      const err = new Error("Error saving cart");
      err.statusCode = 500; // Internal server error if cart can't be saved
      throw err;
    }

    // Step 4: Create the user in the User collection
    const newUser = new User({
      fName: pendingUser.fName,
      lName: pendingUser.lName,
      gender: pendingUser.gender,
      phoneNumber: pendingUser.phoneNumber,
      email: pendingUser.email,
      password: pendingUser.password,
      toReceiveOffers: pendingUser.toReceiveOffers,
      DOB: pendingUser.DOB,
      cart: cart._id,
      agreeTerms: pendingUser.agreeTerms,
    });

    await newUser.save({ session });

    // Step 5: Update the cart with new user reference
    cart.user = newUser._id;
    await cart.save({ session });

    // Step 6: Remove the pending user document
    await PendingUser.deleteOne({
      phoneNumber: pendingUser.phoneNumber,
    }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    // Omit sensitive fields from returned user object
    const { password: pass, ...user } = newUser.toObject();

    // End the session
    session.endSession();

    return { success: true, user }; // Return a success response
  } catch (error) {
    // Log the error and abort the transaction
    await session.abortTransaction();
    session.endSession();

    // Re-throw the error with proper status code if it has one, otherwise default to 500
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500; // Maintain the status code if set
    throw err; // Re-throw the error to be caught in the handler
  }
};

export const verifyRegisteredOTP = async (email, code) => {
  // Start a session for the transaction (though not strictly needed for this particular operation)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check if the user exists with the given verification code
    const user = await User.findOne({ verificationCode: code }).session(
      session
    );

    // Step 2: Handle case where the user with the provided verification code doesn't exist
    if (!user) {
      const error = new Error("Expired Verification Code");
      error.statusCode = 400; // Bad request error for expired code
      throw error;
    }

    // Step 3: Verify that the code matches the user's stored verification code
    if (Number(code) !== Number(user.verificationCode)) {
      const error = new Error("Invalid Verification Code");
      error.statusCode = 400; // Bad request error for invalid code
      throw error;
    }

    // Step 4: If everything is valid, return a success response
    await session.commitTransaction(); // Commit the transaction (even though no changes to save)

    // Step 5: End the session
    session.endSession();

    return { success: true }; // Return success response after verification
  } catch (error) {
    // Handle any errors and rollback the transaction
    await session.abortTransaction(); // Abort transaction on any error

    // End the session
    session.endSession();

    // If no specific status code is set, default to 500 (Internal Server Error)
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500;
    throw err; // Re-throw the error to be caught by the global error handler
  }
};

export const updateUser = async (data) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Attempt to update the user in the PendingUser collection
    const updatedUser = await PendingUser.findOneAndUpdate(
      { phoneNumber: data.phoneNumber },
      data,
      {
        new: true, // Return the updated document
        session, // Use session for transaction consistency
      }
    );

    // Step 2: Check if the user was found and updated
    if (!updatedUser) {
      const error = new Error("User not found");
      error.statusCode = 404; // Not found error
      throw error;
    }

    // Step 3: Commit the transaction
    await session.commitTransaction();

    // Step 4: End the session
    session.endSession();

    return updatedUser; // Return the updated user information
  } catch (error) {
    // Step 5: Abort the transaction if there's an error
    await session.abortTransaction();

    // Step 6: End the session after the transaction is aborted
    session.endSession();

    // If no specific status code is set, default to 500 (Internal Server Error)
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500;
    throw err; // Re-throw the error to be handled globally
  }
};

export const resetPassword = async (email) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check if the user exists in the User collection
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; // Not found error
      throw error; // If user doesn't exist, throw an error
    }

    // Step 2: Generate a new verification code
    const code = generateVerificationCode();
    user.verificationCode = code;

    // Step 3: Save the updated user with the new verification code
    await user.save({ session });

    // Step 4: Send the verification code to the user's email
    await sendVerificationCode(email, code);

    // Step 5: Commit the transaction
    await session.commitTransaction();

    // Step 6: End the session
    session.endSession();

    return { success: true }; // Return success response
  } catch (error) {
    // Step 7: Abort the transaction if there is an error
    await session.abortTransaction();

    // Step 8: End the session after aborting
    session.endSession();

    // If no specific status code is set, default to 500 (Internal Server Error)
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500;
    throw err; // Re-throw the error to be handled globally
  }
};

export const updatePassword = async (email, password) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; // Not found status code
      throw error; // If user doesn't exist, throw an error
    }

    // Step 2: Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Update the user's password
    user.password = hashedPassword;

    // Step 4: Save the user
    await user.save({ session });

    // Step 5: Commit the transaction
    await session.commitTransaction();

    // Step 6: Omit sensitive fields from returned user object
    const { password: pass, ...updatedUser } = user.toObject();

    // Step 7: End the session
    session.endSession();

    return { success: true, user: updatedUser }; // Return a success response
  } catch (error) {
    // Step 8: Abort the transaction if there is an error
    await session.abortTransaction();

    // Step 9: End the session after aborting
    session.endSession();

    // If no specific status code is set, default to 500 (Internal Server Error)
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500;
    throw err; // Re-throw the error to be handled globally
  }
};

export const logIn = async (email, password) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Find the user by email
    const existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      const error = new Error("User not found");
      error.statusCode = 404; // Not found status code
      throw error; // If the user doesn't exist, throw an error
    }

    // Step 2: Verify the password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401; // Unauthorized status code
      throw error; // If the password is invalid, throw an error
    }

    // Step 3: Generate tokens (access token and refresh token)
    const {
      password: userPassword,
      verificationCode,
      refreshToken,
      ...user
    } = existingUser.toObject();
    const accessToken = generateAccessToken(existingUser);
    const generatedRefreshToken = generateRefreshToken(existingUser);

    // Step 4: Save the new refresh token to the user
    existingUser.refreshToken = generatedRefreshToken; // Use the newly generated token
    await existingUser.save({ session }); // Save the user with the session

    // Step 5: Commit the transaction
    await session.commitTransaction();

    // Step 6: Return user data and tokens
    return { user, accessToken, generatedRefreshToken };
  } catch (error) {
    // Step 7: Abort the transaction if there is an error
    await session.abortTransaction();

    // Step 8: If no statusCode is set, default to 500 (Internal Server Error)
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500; // Set status code if available, otherwise 500
    throw err; // Re-throw the error to be handled globally
  } finally {
    // Step 9: End the session after the operation
    session.endSession();
  }
};

export const resendOtp = async (email) => {
  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Find the PendingUser by email
    const user = await PendingUser.findOne({ email }).session(session);
    if (!user) {
      const error = new Error("OTP expired. Register Again");
      error.statusCode = 404; // Not found status code
      throw error; // If the user doesn't exist, throw an error
    }

    // Step 2: Generate new verification code and update the user
    const code = generateVerificationCode();
    user.verificationCode = code;
    await user.save({ session }); // Save the updated user with session

    // Step 3: Attempt to send the verification code to the user
    try {
      await sendVerificationCode(email, code); // Send the new code
      // Step 4: Commit the transaction if sending is successful
      await session.commitTransaction();

      // Step 5: Return success message
      return {
        success: true,
        message: "Verification code resent successfully.",
      };
    } catch (error) {
      // Step 6: Handle error when sending verification code fails
      await session.abortTransaction();
      const sendError = new Error("Failed to send verification code");
      sendError.statusCode = 500; // Internal server error status
      throw sendError;
    }
  } catch (error) {
    // Step 7: Abort transaction on any error before committing
    await session.abortTransaction();

    // Step 8: Throw an error with a specific message and status code
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500; // Default to 500 if no status code
    throw err; // Re-throw the error to be caught in the handler
  } finally {
    // Step 9: Ensure the session is ended after the process
    session.endSession();
  }
};

export const createAdmin = async (details) => {
  const { email, password, ...rest } = details;

  // Step 1: Check if the admin already exists in the database
  const foundUser = await Admin.findOne({ email });
  if (foundUser) {
    const error = new Error("Administrator already exists");
    error.statusCode = 400; // Bad request status code
    throw error; // If the admin already exists, throw an error
  }

  try {
    // Step 2: Hash the provided password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Step 3: Create a new Admin instance
    const newAdmin = new Admin({
      email,
      password: hashedPwd,
      ...rest,
    });

    // Step 4: Save the new admin to the database
    await newAdmin.save();

    // Step 5: Omit the sensitive password field from the response
    const { password: _, ...adminData } = newAdmin.toObject();

    // Step 6: Return the newly created admin data
    return adminData;
  } catch (error) {
    // Step 7: Catch any errors and throw a custom error
    const err = new Error("Error creating admin: " + error.message);
    err.statusCode = 500; // Internal server error status code
    throw err; // Re-throw the error to be caught in the handler
  }
};

export const loginAdmin = async (email, password) => {
  // Step 1: Find the admin by email
  const foundAdmin = await Admin.findOne({ email }).populate("branch");
  if (!foundAdmin) {
    const error = new Error("Admin Does Not Exist");
    error.statusCode = 404; // Not found status code
    throw error; // If admin is not found, throw error
  }

  try {
    // Step 2: Compare the provided password with the stored hash
    const match = await bcrypt.compare(password, foundAdmin.password);
    if (!match) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401; // Unauthorized status code
      throw error; // If password doesn't match, throw error
    }

    // Step 3: Generate an access token for the admin
    const accessToken = generateAdminAccessToken(foundAdmin);

    // Step 4: Generate a refresh token for the admin
    const refreshToken = generateAdminRefreshToken(foundAdmin);

    // Step 5: Save the generated refresh token to the admin document
    foundAdmin.refreshToken = refreshToken;
    await foundAdmin.save();

    // Step 6: Return the admin's data without sensitive information
    const {
      password: _,
      refreshToken: __,
      ...adminData
    } = foundAdmin.toObject();

    return {
      admin: adminData, // Omit sensitive fields like password and refresh token
      accessToken,
      refreshToken,
    };
  } catch (error) {
    // Step 7: Catch any errors that occurred during the login process
    const err = new Error(
      error.message || "An error occurred while logging in admin"
    );
    err.statusCode = error.statusCode || 500; // Default to internal server error
    throw err; // Re-throw the error
  }
};
