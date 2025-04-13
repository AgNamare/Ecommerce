import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    productName: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    SKU: {
      type: String,
    },
    measurementUnit: {
      type: String,
    },
    size: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    noOfUnits: {
      type: String,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

productsSchema.index({ productName: "text", SKU: "text", description: "text" });

const Product = mongoose.model("Product", productsSchema);

export default Product;
