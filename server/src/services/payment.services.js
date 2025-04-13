import Cart from "../models/cart.models.js";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";
import {
  generateOrderId,
  getAccessToken,
  getTimestamp,
  mockFetch,
} from "../utils/payment.utils.js";
import moment from "moment";

import mongoose from 'mongoose';

export const handleMpesaPayment = async (orderDetails, phoneNumber, amount) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const number = Number(`254${phoneNumber}`);
    const amt = Number(amount); // Ensure this is a number
    const orderId = generateOrderId();

    // Create a new order with the provided order details
    const order = new Order({
      ...orderDetails,
      orderId: orderId,
    });

    // Get access token for M-Pesa API
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Failed to retrieve access token for M-Pesa");
    }

    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = `Bearer ${token}`;
    const timestamp = moment().format("YYYYMMDDHHmmss");

    const password = Buffer.from(
      `174379bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`
    ).toString("base64");

    // Make the API request to M-Pesa
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        BusinessShortCode: 174379,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline", // Adjust as necessary
        Amount: amt,
        PartyA: number,
        PartyB: 174379,
        PhoneNumber: number,
        CallBackURL:
          "https://ecom-backend-qdwv.onrender.com/api/v1/payment/mpesa/callback",
        AccountReference: "CompanyXLTD",
        TransactionDesc: "Mpesa Daraja API stk push test",
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.text(); // Log full error response
      throw new Error(`Failed to process M-Pesa payment. Response: ${errorResponse}`);
    }

    const responseData = await response.json();
    const merchantId = responseData.MerchantRequestID;

    // Create new payment entry
    const newPayment = new Payment({
      orderID: order._id,
      paymentMethod: "mpesa",
      paymentAmount: orderDetails.totalAmount,
      paymentStatus: "pending",
      transactionID: merchantId,
      merchantId: merchantId,
      user: orderDetails.user,
    });

    // Start the transaction: Create the order and payment, and update the cart
    const cartUpdate = await Cart.findOneAndUpdate(
      { user: orderDetails.user },
      { $set: { products: [], totalQuantity: 0, totalAmount: 0 } },
      { new: true, session } // Include session in update
    );

    if (!cartUpdate) {
      throw new Error("Failed to update the cart");
    }

    // Save the new payment and order, linking the payment to the order
    order.payment = newPayment._id;
    newPayment.orderID = order._id;
    await newPayment.save({ session }); // Save the payment within the transaction
    await order.save({ session }); // Save the order within the transaction

    // Commit the transaction if everything goes well
    await session.commitTransaction();

    // End the session after commit
    session.endSession();

    return newPayment; // Return the new payment object
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    throw new Error(`M-Pesa Payment Error: ${error.message}`);
  }
};

export const updatePayment = async (
  MerchantRequestID,
  ResultCode,
  MpesaReceiptNumber
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Updating payment...");
    console.log("MerchantRequestID: ", MerchantRequestID);
    console.log("ResultCode: ", ResultCode);
    console.log("MpesaReceiptNumber: ", MpesaReceiptNumber);

    // Find the payment by MerchantRequestID
    const payment = await Payment.findOne({ merchantId: MerchantRequestID }).session(session);
    if (!payment) {
      console.log("Payment not found");
      throw new Error("Payment not found");
    }

    // Update payment status and transaction ID based on ResultCode
    payment.paymentStatus = ResultCode === 0 ? "success" : "failed";

    if (ResultCode === 0) {
      payment.transactionID = MpesaReceiptNumber;
      console.log("Updated payment transactionID: ", payment.transactionID);
      // You can add email notification logic here if needed
    }

    // Save the updated payment within the transaction
    await payment.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log("Payment updated successfully");
    console.log("Updated payment: ", payment);
    return payment;
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating payment: ", error);
    throw new Error(error);
  }
};
