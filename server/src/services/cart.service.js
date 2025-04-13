import Cart from "../models/cart.models.js";
import mongoose from "mongoose";

export const getCart = async (id) => {
  // Step 1: Attempt to find the cart by its ID and populate the product details
  try {
    const cart = await Cart.findById(id).populate({
      path: "products.product",
      select: "productName price discountPrice images SKU", // Specify desired fields to populate
    });

    // Step 2: Check if the cart was found
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404; // Not found status code
      throw error; // Throw error if cart does not exist
    }

    // Step 3: Return the found cart
    return cart;
  } catch (error) {
    // Step 4: Handle any errors that occur during the process
    console.error("Error retrieving cart:", error.message);

    // Step 5: Throw a custom error with a meaningful message and status code
    const err = new Error(error.message || "Error retrieving cart");
    err.statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
    throw err; // Re-throw the error for middleware to handle
  }
};

export const updateCart = async (id, productId, quantity) => {
  // Step 1: Attempt to find the cart by its ID
  try {
    const cart = await Cart.findById(id);

    // Step 2: Check if the cart exists
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404; // Not found status code
      throw error; // Throw error if cart does not exist
    }

    // Step 3: Update product quantity (logic for adding/removing)
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // Product already exists in the cart, update quantity
      cart.products[existingProductIndex].quantity += quantity;

      // Remove product from the cart if quantity becomes 0 or negative
      if (cart.products[existingProductIndex].quantity <= 0) {
        cart.products.splice(existingProductIndex, 1); // Remove product from the array
      }
    } else {
      // New product, add it to the cart
      cart.products.push({
        product: new mongoose.Types.ObjectId(productId), // Ensure productId is an ObjectId
        quantity: quantity,
      });
    }

    // Step 4: Populate product details in the cart
    await cart.populate({
      path: "products.product",
      select: "productName price discountPrice images SKU", // Specify desired fields to populate
    });

    // Step 5: Recalculate total price of the cart
    await cart.calculateTotal();

    // Step 6: Save the updated cart
    await cart.save();

    // Step 7: Return the updated cart
    return cart;
  } catch (error) {
    // Step 8: Handle errors
    console.error("Error updating cart:", error.message);

    // Step 9: Throw custom error with message and status code
    const err = new Error(error.message || "Error updating cart");
    err.statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
    throw err; // Re-throw the error to be handled by middleware
  }
};

export const setProductQuantity = async (id, productId, quantity) => {
  // Step 1: Attempt to find the cart by its ID
  try {
    const cart = await Cart.findById(id);

    // Step 2: Check if the cart exists
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404; // Not found status code
      throw error; // Throw error if cart does not exist
    }

    // Step 3: Update product quantity (logic for setting the exact quantity)
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // Product already exists in the cart, update quantity
      if (quantity <= 0) {
        // Remove product from the cart if quantity is 0 or negative
        cart.products.splice(existingProductIndex, 1);
      } else {
        // Set the exact quantity for the existing product
        cart.products[existingProductIndex].quantity = quantity;
      }
    } else {
      // New product, add it to the cart if the quantity is greater than 0
      if (quantity > 0) {
        cart.products.push({
          product: new mongoose.Types.ObjectId(productId), // Ensure productId is an ObjectId
          quantity: quantity,
        });
      }
    }

    // Step 4: Populate product details in the cart
    await cart.populate({
      path: "products.product",
      select: "productName price discountPrice images SKU", // Specify desired fields to populate
    });

    // Step 5: Recalculate the total price of the cart
    await cart.calculateTotal();

    // Step 6: Save the updated cart
    await cart.save();

    // Step 7: Return the updated cart
    return cart;
  } catch (error) {
    // Step 8: Handle any errors and throw a custom error with message and status code
    console.error("Error updating cart:", error.message);

    const err = new Error(error.message || "Error updating cart");
    err.statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
    throw err; // Re-throw the error for middleware to handle
  }
};

export const mergeCart = async (id, products) => {
  try {
    // Step 1: Find the cart by ID
    const cart = await Cart.findById(id);
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404; // Not found status code
      throw error; // Throw error if cart does not exist
    }

    // Step 2: Loop through the products array and update the cart
    for (const { product, quantity } of products) {
      // Check if the product already exists in the cart
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === product.toString()
      );

      if (existingProduct) {
        // If product exists, update its quantity
        existingProduct.quantity += quantity;
      } else {
        // If product doesn't exist, add it to the cart
        cart.products.push({ product, quantity });
      }
    }

    // Step 3: Save the updated cart
    await cart.save();

    // Step 4: Populate the product details in the cart's products array
    await cart.populate({
      path: "products.product", // Populate the product field
      select: "productName price discountPrice images SKU _id", // Specify fields to return
    });

    // Step 5: Return the updated and populated cart
    return cart;
  } catch (error) {
    // Step 6: Handle errors and throw custom error with status code and message
    console.error("Error merging cart:", error.message);

    const err = new Error(error.message || "Error merging cart");
    err.statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
    throw err; // Re-throw the error for middleware to handle
  }
};

export const deleteProduct = async (cartId, productId) => {
  try {
    // Step 1: Find the cart by its ID
    const cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404; // Not Found
      throw error; // Throw error if cart does not exist
    }

    // Step 2: Find the index of the product in the cart's products array
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (productIndex === -1) {
      const error = new Error("Product not found in cart");
      error.statusCode = 404; // Not Found
      throw error; // Throw error if product is not in cart
    }

    // Step 3: Get the product details for quantity and subtotal
    const product = cart.products[productIndex];

    // Step 4: Update the totalQuantity and totalAmount
    cart.totalQuantity -= product.quantity;
    cart.totalAmount -= product.subtotal;

    // Step 5: Remove the product from the cart's products array
    cart.products.splice(productIndex, 1);

    // Step 6: Save the updated cart
    await cart.save();

    // Step 7: Return the updated cart with populated product details
    return cart.populate({
      path: "products.product", // Populate the product field
      select: "productName price discountPrice images SKU", // Specify fields to return
    });
  } catch (error) {
    // Step 8: Handle errors and re-throw with a status code and message
    console.error("Error deleting product from cart:", error.message);
    const err = new Error(error.message || "Error deleting product from cart");
    err.statusCode = error.statusCode || 500; // Default to 500 if no status code is provided
    throw err; // Re-throw the error to be caught by the middleware
  }
};
