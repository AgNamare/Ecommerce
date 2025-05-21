import Product from "../models/products.models.js";
import Stock from "../models/stocks.model.js";
import { productExists } from "../utils/products.utils.js";
import Cart from "../models/cart.models.js";
import mongoose from "mongoose";
import Category from "../models/category.models.js";
import { findAllDescendantCategories } from "../utils/category.utils.js";
import { getProductsWithStockLevels } from "../utils/stockLevels.js";
const ObjectId = mongoose.Types.ObjectId;

export const createProduct = async (productData) => {
  const { productName, SKU, ...rest } = productData;

  try {
    const exists = await productExists(SKU);
    if (exists) {
      throw new Error("Product already exists");
    }

    const newProduct = new Product({
      ...rest,
      productName,
      SKU,
    });

    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateProduct = async (id, branch, productData) => {
  const { productName, SKU, stockLevel, ...rest } = productData;
  console.log("Stock Level: ", stockLevel);
  try {
    // Update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { productName, SKU, ...rest },
      { new: true }
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    // Update stock level if SKU and branch are provided
    if (branch && stockLevel ) {
      const stockUpdate = await Stock.findOneAndUpdate(
        { productId: id, branchId: branch },
        { stockLevel },
        { new: true, upsert: true } // upsert: true will create a new document if it doesn't exist
      );
      console.log("StockUpdate: ", stockUpdate);

      if (!stockUpdate) {
        throw new Error("Stock update failed");
      }
    }

    return updatedProduct;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};

export const deleteProduct = async (productData) => {
  const { SKU, confirm } = productData;

  try {
    // Find the product by SKU
    const productToDelete = await Product.findOne({ SKU: SKU });

    if (!productToDelete) {
      throw new Error("Product not found");
    }

    // If confirm is true, proceed with deletion
    if (confirm === true) {
      const deletedProduct = await Product.findOneAndDelete({ SKU: SKU });

      return {
        message: "Product deleted successfully",
        product: deletedProduct,
      };
    } else {
      return { message: "Product deletion canceled", product: productToDelete };
    }
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};

export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // If no cart exists for the user, create one
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product is already in the cart
    const cartItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex > -1) {
      // If the product is already in the cart, update the quantity
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      cart.items.push({ productId, quantity });
    }

    // Save the cart
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Error adding product to cart: ${error.message}`);
  }
};

export const getProduct = async (productId, branchId) => {
  try {
    console.log("Product ID: ", productId)
    console.log("Branch ID: ", branchId)
    console.log("Entering getProduct function");

    // Convert productId and branchId to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const branchObjectId = new mongoose.Types.ObjectId(branchId);

    // Aggregate pipeline to fetch product with stock level for a specific branch
    const pipeline = [
      {
        $match: {
          _id: productObjectId, // Match the product by ObjectId
        },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "productId",
          as: "stockEntries",
        },
      },
      {
        $addFields: {
          stockLevel: {
            $let: {
              vars: {
                stockEntry: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$stockEntries",
                        as: "stock",
                        cond: { $eq: ["$$stock.branchId", branchObjectId] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: {
                $ifNull: ["$$stockEntry.stockLevel", 0],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryDetails.path",
          foreignField: "_id",
          as: "categoryPathDetails",
        },
      },
      {
        $addFields: {
          categoryPath: {
            $map: {
              input: "$categoryPathDetails",
              as: "cat",
              in: {
                name: "$$cat.name",
                _id: "$$cat._id",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          images: 1,
          brand: 1,
          price: 1,
          size: 1,
          discountPrice: 1, // Add discountPrice field
          stockLevel: 1,
          description: 1,
          SKU: 1,
          measurementUnit: 1,
          category: {
            _id: "$categoryDetails._id",
            name: "$categoryDetails.name",
            path: "$categoryPath",
          },
        },
      },
    ];

    const result = await Product.aggregate(pipeline);

    return result[0] || null; // Return null if no result is found
  } catch (error) {
    console.error("Error getting product:", error);
    throw new Error("Error getting product!");
  }
};

export const findSubcategory = async (categoryName) => {
  try {
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, "i") },
    }).exec();
    const categoryId = category._id;
    const categories = await Category.find({ parent: categoryId })
      .limit(7)
      .exec();
    return categories;
  } catch (error) {
    throw new Error("Error finding subcategory: " + error.message);
  }
};

export const findProductsByCategory = async (
  categoryName,
  branchId,
  searchQuery = "",
  sortBy = "createdAt",
  sortOrder = -1,
  page = 1,
  limit = 10
) => {
  try {
    console.log(categoryName);
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, "i") },
    }).exec();
    const categoryId = category._id;
    // Step 1: Find all descendant categories including the given category
    const descendantCategoryIds = await findAllDescendantCategories(categoryId);

    // Include the original categoryId in the list of IDs
    descendantCategoryIds.push(categoryId);

    // Step 2: Construct the search criteria to include categories
    const criteria = {
      category: { $in: descendantCategoryIds },
    };

    // Step 3: Call getProductsWithStockLevels with the constructed criteria
    const productsWithStockLevels = await getProductsWithStockLevels(
      branchId,
      criteria,
      searchQuery,
      sortBy,
      sortOrder,
      page,
      limit
    );

    return productsWithStockLevels;
  } catch (error) {
    console.error("Error finding products by categoryId:", error.message);
    throw new Error("Error finding products by categoryId: " + error.message);
  }
};
