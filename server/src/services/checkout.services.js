import Address from "../models/address.model.js";
import Cart from "../models/cart.models.js";
import User from "../models/user.model.js";
import { findNearestBranch } from "../utils/branch.utils.js";
import { checkProductAvailability } from "../utils/stockLevels.js";
import mongoose from "mongoose";

export const initiateCheckout = async ({
  cart,
  delivery,
  payment,
  user,
  branch,
}) => {
  const session = await mongoose.startSession(); // Start a MongoDB session for transaction handling
  session.startTransaction();

  try {
    // Fetch the cart document, ensuring to include the products and use the transaction session
    const cartDocument = await Cart.findById(cart)
      .populate("products.product")
      .session(session);
    if (!cartDocument) {
      const err = new Error("Cart not found");
      err.statusCode = 404;
      throw err;
    }

    // Fetch the user document with the transaction session
    const userDocument = await User.findById(user).session(session);
    if (!userDocument) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    // Initialize the delivery address if the method is not 'pick-up'
    let deliveryAddress = null;
    if (delivery.method !== "pick-up") {
      deliveryAddress = await Address.findById(delivery.address).session(
        session
      );
      if (!deliveryAddress) {
        const err = new Error("Delivery address not found");
        err.statusCode = 404;
        throw err;
      }
    }

    // Determine the delivery slot based on the delivery method
    let deliverySlot;
    if (delivery.method === "express") {
      deliverySlot = getThirtyMinutesAfterPayment();
    } else {
      deliverySlot = delivery.deliverySlot;
    }

    // Find the nearest branch if the delivery method is not 'pick-up'
    let nearestBranch = null;
    if (delivery.method !== "pick-up" && deliveryAddress) {
      nearestBranch = await findNearestBranch(
        deliveryAddress.address.location.coordinates
      );
      if (!nearestBranch) {
        const err = new Error("No nearest branch found for delivery");
        err.statusCode = 404;
        throw err;
      }
    }

    // Check product availability
    const { adjustedProducts, adjustments } = await checkProductAvailability(
      cartDocument.products,
      nearestBranch ? nearestBranch._id : branch
    );
    if (!adjustedProducts || adjustedProducts.length === 0) {
      const err = new Error("No available products to checkout");
      err.statusCode = 400;
      throw err;
    }

    // Calculate total savings and total amount based on adjusted products
    const totalSavings = adjustedProducts.reduce((total, item) => {
      const productPrice = item.product.price; // Assuming the product has a price field
      const discountPrice = item.product.discountPrice || productPrice; // Fallback to price if discountPrice is not available
      return total + (productPrice - discountPrice) * item.quantity;
    }, 0);

    const totalAmount = adjustedProducts.reduce((total, item) => {
      return total + item.subtotal; // subtotal should already be calculated in the adjusted products
    }, 0);

    // Create the order summary object
    const orderSummary = {
      user: {
        id: userDocument._id,
        name: `${userDocument.fName} ${userDocument.lName}`,
        email: userDocument.email,
        phoneNumber: userDocument.phoneNumber,
        cart: cart,
      },
      deliveryAddress:
        delivery.method !== "pick-up"
          ? {
              id: deliveryAddress._id,
              building: deliveryAddress.address.building,
              coordinates: deliveryAddress.address.location.coordinates,
              city: deliveryAddress.address.city,
              contactNumber: deliveryAddress.address.contactNumber,
              instructions: deliveryAddress.address.instructions,
              addressType: deliveryAddress.address.addressType,
            }
          : null,
      deliveryMethod: delivery.method,
      deliverySlot: deliverySlot,
      branch: nearestBranch ? nearestBranch._id : branch,
      products: adjustedProducts.map((item) => ({
        id: item.product._id,
        image: item.product.images[0],
        name: item.product.productName,
        quantity: item.quantity,
        price: item.product.discountPrice,
        subtotal: item.subtotal,
      })),
      totalQuantity: adjustedProducts.reduce(
        (total, item) => total + item.quantity,
        0
      ),
      totalSavings: totalSavings, // Total savings calculated from adjusted products
      totalAmount: totalAmount, // Total amount calculated from adjusted products
      paymentMethod: payment.paymentMethod,
      paymentAccount: payment.paymentAccount,
      adjustments: adjustments.length > 0 ? adjustments : undefined, // Include adjustments if any
    };

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return orderSummary; // Return the successfully generated order summary
  } catch (error) {
    // In case of any error, rollback the transaction
    await session.abortTransaction();
    session.endSession();

    // Handle errors with specific status codes and messages
    console.error("Error initiating checkout:", error.message);
    const err = new Error(error.message || "Error initiating checkout");
    err.statusCode = error.statusCode || 500;
    throw err; // Throw the error for the middleware to handle
  }
};

// Helper function to get the current time plus 30 minutes
const getThirtyMinutesAfterPayment = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  return now.toISOString(); // ISO format is commonly used
};
