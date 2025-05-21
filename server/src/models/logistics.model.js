import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Logistics schema
const logisticsSchema = new Schema(
  {
    logistics_id: {
      type: String,
      required: true,
      unique: true,
    },
    driver_name: {
      type: String,
      required: true,
    },
    driver_photo: {
      type: String, // This can be a URL or path to the photo
      required: true,
    },
    vehicle_type: {
      type: String,
      required: true,
    },
    vehicle_registration_number: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the Logistics model
const Logistics = mongoose.model("Logistics", logisticsSchema);

export default Logistics;
