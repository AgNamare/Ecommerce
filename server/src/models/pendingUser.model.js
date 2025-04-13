import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique in this collection as well
    },
    password: {
      type: String,
      required: true,
    },
    toReceiveOffers: {
      type: Boolean,
      default: true,
    },
    DOB: {
      type: Date,
    },
    verificationCode: {
      type: Number,
      required: true, // Code is necessary for verification
    },
    agreeTerms: {
      type: Boolean,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "10m",
    },
  },
  { timestamps: true }
);

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
