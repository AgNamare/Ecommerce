import mongoose from "mongoose";
import Product from "./products.models.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        subtotal: {
          type: Number,
          default: 0,
        },
        savings: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalSavings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Define a method to calculate total quantity, total amount, subtotals, and savings
cartSchema.methods.calculateTotal = async function () {
  let totalQuantity = 0;
  let totalAmount = 0;
  let totalSavings = 0;

  for (const item of this.products) {
    const product = await Product.findById(item.product);
    const productPrice = parseFloat(product.price); // Assuming price is a String, parse it to a float
    const discountPrice = parseFloat(product.discountPrice) || productPrice; // Use discount price if available
    const itemSubtotal = item.quantity * discountPrice;
    const itemSavings = item.quantity * (productPrice - discountPrice);

    item.subtotal = itemSubtotal; // Update the subtotal for each item
    item.savings = itemSavings; // Update the savings for each item
    totalQuantity += item.quantity;
    totalAmount += itemSubtotal;
    totalSavings += itemSavings;
  }

  this.totalQuantity = totalQuantity;
  this.totalAmount = totalAmount;
  this.totalSavings = totalSavings;
};

// Middleware to recalculate totals, subtotals, and savings before saving the cart
cartSchema.pre("save", async function (next) {
  await this.calculateTotal();
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
