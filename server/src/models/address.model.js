import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: {
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
    address: {
      type: String,
    },
    building: {
      type: String,
    },
    city: {
      type: String,
    },
    apartment: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      required: true,
    },
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

addressSchema.index({ location: "2dsphere" }); // Index for geospatial queries

const Address = mongoose.model("Address", addressSchema);

export default Address;
