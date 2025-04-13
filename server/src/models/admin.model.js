import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },
    refreshToken: {
      type: String,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
  },
  { timestamps: true }
);

// Export the model
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
