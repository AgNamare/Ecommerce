import Cart from "../models/cart.models.js";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import {
  handleMpesaPayment,
  updatePayment,
} from "../services/payment.services.js";
import { getAccessToken } from "../utils/payment.utils.js";

export const mpesaPaymentHandler = async (req, res, next) => {
  try {
    console.log("Inside mpesaPaymentHandler");
    const {
      user,
      products,
      deliveryAddress,
      deliveryMethod,
      deliverySlot,
      totalQuantity,
      totalAmount,
      paymentAccount,
      branch,
    } = req.body;

    console.log("User: ", user);
    console.log("Products: ", products);
    console.log("Delivery Address: ", deliveryAddress);
    console.log("Delivery Method: ", deliveryMethod);
    console.log("Delivery Slot: ", deliverySlot);
    console.log("Total Quantity: ", totalQuantity);
    console.log("Total Amount: ", totalAmount);
    console.log("Payment Account: ", paymentAccount);
    console.log("Branch: ", branch);

    // Create a new order
    const newOrder = {
      user: user.id,
      products: products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      })),
      delivery: {
        address: deliveryMethod=="pick-up" ? branch : deliveryAddress.id ,
        deliverySlot,
        method: deliveryMethod,
      },
      totalQuantity,
      totalAmount,
      status: "pending",
      branch: branch,
    };

    console.log("New Order:", newOrder);

    // Handle M-Pesa payment
    const results = await handleMpesaPayment(
      newOrder,
      paymentAccount,
      totalAmount
    );

    console.log("UserID", user.id);
    res.json(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const callBackHandler = async (req, res, next) => {
  try {
    console.log("Inside callBackHandler");
    console.log("req.body: ", req.body);

    const {
      Body: {
        stkCallback: {
          MerchantRequestID,
          ResultCode,
          CallbackMetadata: { Item },
        },
      },
    } = req.body;

    console.log("MerchantRequestID: ", MerchantRequestID);
    console.log("ResultCode: ", ResultCode);
    console.log("Item: ", Item);

    const MpesaReceiptNumber = Item.find(
      (item) => item.Name === "MpesaReceiptNumber"
    ).Value;

    console.log("MpesaReceiptNumber: ", MpesaReceiptNumber);

    // Update payment status
    const updatedPayment = await updatePayment(
      MerchantRequestID,
      ResultCode,
      MpesaReceiptNumber
    );

    if (updatedPayment.paymentStatus === "success") {
      console.log("Success ");
    } else {
      // Delete order and payment if payment failed
      const order = await Order.findOne({ payment: updatedPayment._id });

      if (order) {
        await Order.deleteOne({ _id: order._id });
        console.log("Order deleted: ", order._id);
      }

      await Payment.deleteOne({ _id: updatedPayment._id });
      console.log("Payment deleted: ", updatedPayment._id);
    }

    return res.json(updatedPayment);
  } catch (error) {
    next(error);
  }
};

export const registerURLHandler = async (req, res, next) => {
  try {
    const accessToken = await getAccessToken();
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    const auth = "Bearer " + accessToken;

    const registrationData = {
      ShortCode: "174379",
      ResponseType: "[Cancelled/Completed]",
      ConfirmationURL:
        "https://9fb9-102-0-7-6.ngrok-free.app/api/v1/payment/mpesa/callback",
    };

    const response = await fetch(url, {
      headers: {
        Authorization: auth,
      },
      method: "POST",
      body: JSON.stringify(registrationData),
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error registering URL:", error);
    next(error);
  }
};

export const getPaymentHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find payment by ID
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Determine response based on payment status
    let message = "";

    console.log(payment.paymentStatus);

    switch (payment.paymentStatus) {
      case "success":
        message = "Payment successful";
        break;
      case "failed":
        message = "Payment failed";
        break;
      case "pending":
        message = "Payment pending";
        break;
      default:
        message = "Unknown payment status";
        break;
    }

    // Send response
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
