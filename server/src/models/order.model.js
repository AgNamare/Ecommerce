import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    delivery: {
      address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
      method: {
        type: String,
        enum: ["express", "pick-up", "normal"],
        required: true,
      },
      deliverySlot: {
        type: Date,
      },
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "onRoute", "paid", "delivered", "cancelled", "readyForPickup"],
      default: "pending",
    },
    logistics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Logistics",
    },
  },
  {
    timestamps: true, // This option will add createdAt and updatedAt fields automatically
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
