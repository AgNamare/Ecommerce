import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  transactionID: {
    type: String,
  },
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  merchantId: {
    type: String,
    required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
