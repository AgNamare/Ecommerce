import {
  getProductsWithStockLevels,
  getProductWithStockLevel,
} from "../utils/stockLevels.js";
import { ObjectId } from "mongodb";
import Stock from "../models/stocks.model.js";
import Branch from "../models/branch.model.js";
import Product from "../models/products.models.js";
import mongoose from "mongoose";

export const getProductsWithStockLevelsController = async (req, res) => {
  try {
    const {
      branchId,
      criteria = "{}",
      sortBy = "createdAt",
      sortOrder = -1,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedCriteria = JSON.parse(criteria);
    const parsedSortOrder = parseInt(sortOrder, 10) || -1;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;

    const result = await getProductsWithStockLevels(
      branchId,
      parsedCriteria,
      sortBy,
      parsedSortOrder,
      parsedPage,
      parsedLimit
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving products with stock levels:", error);
    res
      .status(500)
      .json({ message: "Error retrieving products with stock levels." });
  }
};

export const getProductWithStockLevelController = async (req, res) => {
  try {
    const { productId, branchId } = req.params;

    if (!ObjectId.isValid(productId) || !ObjectId.isValid(branchId)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID or branch ID" });
    }

    const result = await getProductWithStockLevel(productId, branchId);

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving product with stock level:", error);
    res
      .status(500)
      .json({ message: "Error retrieving product with stock level." });
  }
};

// Add a new stock entry
export const addStockController = async (req, res) => {
  try {
    const { branchId, productId, stockLevel } = req.body;

    // Validate branchId and productId
    if (
      !mongoose.Types.ObjectId.isValid(branchId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "Invalid branch or product ID" });
    }

    // Check if branch and product exist
    const branchExists = await Branch.findById(branchId);
    const productExists = await Product.findById(productId);

    if (!branchExists || !productExists) {
      return res.status(404).json({ message: "Branch or Product not found" });
    }

    // Create new stock entry
    const newStock = new Stock({
      branchId,
      productId,
      stockLevel,
    });

    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ message: "Error adding stock" });
  }
};

// Update an existing stock entry

export const updateStockController = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockLevel } = req.body;

    // Validate stock ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid stock ID" });
    }

    const stockObjectId = new mongoose.Types.ObjectId(id);

    // Find and update stock entry
    const updatedStock = await Stock.findByIdAndUpdate(
      stockObjectId,
      { stockLevel },
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    res.status(200).json(updatedStock);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Error updating stock" });
  }
};

// Delete a stock entry
export const deleteStockController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate stock ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid stock ID" });
    }

    // Find and delete stock entry
    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    res.status(200).json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const createStockLevelsForAllBranches = async () => {
  console.log("Entering createStockLevelsForAllBranches function");
  try {
    // Fetch all branches
    const branches = await Branch.find({});
    console.log(`Fetched ${branches.length} branches.`);
    // Fetch all products
    const products = await Product.find({});
    console.log(`Fetched ${products.length} products.`);

    // Prepare an array to hold stock entries
    const stockEntries = [];

    // Function to generate a random stock level
    const getRandomStockLevel = (min = 0, max = 50) => {
      return Math.floor(Math.random() * (max - min + 1)) + min; // Generate a random number between min and max
    };

    // Loop through each branch and each product
    branches.forEach((branch) => {
      console.log(`Processing branch: ${branch._id}`);
      // Validate the branch ID
      if (!mongoose.Types.ObjectId.isValid(branch._id)) {
        console.error(`Invalid branch ID: ${branch._id}`);
        return; // Skip this branch if invalid
      }

      products.forEach((product) => {
        console.log(`Processing product: ${product._id}`);
        // Validate the product ID
        if (!mongoose.Types.ObjectId.isValid(product._id)) {
          console.error(`Invalid product ID: ${product._id}`);
          return; // Skip this product if invalid
        }

        // Push valid stock entries
        stockEntries.push({
          productId: product._id,
          branchId: branch._id,
          stockLevel: getRandomStockLevel(0, 50), // Random stock level between 0 and 50
          SKU: product.SKU, // Reference the product's SKU
        });
      });
    });

    // Insert all stock entries in bulk, only if there are valid entries
    if (stockEntries.length > 0) {
      await Stock.insertMany(stockEntries);
      console.log(
        `Successfully created stock levels for ${products.length} products across ${branches.length} branches.`
      );
    } else {
      console.warn("No valid stock entries to insert.");
    }
  } catch (error) {
    console.error("Error creating stock levels:", error);
  }
};
