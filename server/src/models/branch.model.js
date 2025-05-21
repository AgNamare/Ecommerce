import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"], // GeoJSON type
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers
      required: true,
    },
  },
  building: {
    type: String,
  },
  city: {
    type: String,
  },
  contactNumber: {
    type: String,
    required: true,
  },
});

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: addressSchema,
});

// Create a 2dsphere index on the coordinates field
branchSchema.index({ "address.location": "2dsphere" });

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
