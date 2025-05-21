import mongoose from "mongoose";
import Product from "../models/products.models.js";
import Stock from "../models/stocks.model.js";

const ObjectId = mongoose.Types.ObjectId;

/**
 * Retrieves products with their corresponding stock levels for a specific branch.
 *
 * This function executes an aggregation pipeline to fetch products from the database,
 * then performs a lookup to retrieve stock levels from the "stocks" collection based on
 * the provided branch ID. It filters the stock entries to get the stock level for the
 * specified branch, and it returns the products with the associated stock levels.
 *
 * If a search query is provided, it will filter the products based on the search term
 * applied to specific fields like productName, description, or brand.
 *
 * Pagination is supported via the page and limit parameters, and metadata about the
 * pagination is returned along with the products.
 *
 * @param {string} branchId - The ID of the branch for which to retrieve stock levels.
 * @param {Object} [criteria={}] - An optional criteria object to filter the products.
 *                                 For example, { category: "electronics" }.
 * @param {string} [searchQuery=""] - An optional search query to filter products by name, description, or brand.
 * @param {string} [sortBy="createdAt"] - The field by which to sort the results.
 *                                        Defaults to "createdAt".
 * @param {number} [sortOrder=-1] - The order in which to sort the results.
 *                                  -1 for descending, 1 for ascending. Defaults to -1.
 * @param {number} [page=1] - The page number for pagination. Defaults to 1.
 * @param {number} [limit=10] - The maximum number of products to return. Defaults to 10.
 *
 * @returns {Promise<{products: Array<Object>, metadata: Object}>} A promise that resolves to an object containing
 *                                     an array of product objects and a metadata object with pagination info.
 *
 * @throws {Error} Throws an error if the branch ID is invalid or if the aggregation pipeline fails.
 *
 * @example
 * // Retrieve products from page 2 with a limit of 5 products per page
 * const { products, metadata } = await getProductsWithStockLevels(
 *   "60f8a3f1b8d3c42b58c73334",
 *   { category: "electronics" },
 *   "smartphone",
 *   "price",
 *   1,
 *   2,
 *   5
 * );
 *
 * console.log(products);
 * console.log(metadata);
 */
export const getProductsWithStockLevels = async (
  branchId,
  criteria = {},
  searchQuery = "",
  sortBy = "createdAt",
  sortOrder = -1,
  page = 1,
  limit = 10
) => {
  console.log(searchQuery);
  try {
    const branchObjectId = ObjectId.createFromHexString(branchId);

    // Incorporate search query into the criteria using $regex for partial matches
    if (searchQuery) {
      searchQuery = searchQuery.trim();
      criteria.productName = { $regex: searchQuery, $options: "i" };
    }

    // Apply case-insensitive regex for brand if provided
    if (criteria.brand) {
      criteria.brand = { $regex: new RegExp(`^${criteria.brand}$`, "i") };
    }

    console.log("Criteria before query execution:", criteria);

    const skip = (page - 1) * limit;

    // Count the total number of matching documents
    const totalDocuments = await Product.countDocuments(criteria);
    console.log("Total documents found:", totalDocuments);

    const pipeline = [
      { $match: criteria },
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
            $first: {
              $filter: {
                input: "$stockEntries",
                as: "stock",
                cond: { $eq: ["$$stock.branchId", branchObjectId] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          stockLevel: { $ifNull: ["$stockLevel.stockLevel", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          images: 1,
          size: 1,
          category: 1,
          discountPrice: 1,
          brand: 1,
          price: 1,
          stockLevel: 1,
        },
      },
      { $sort: { [sortBy]: sortOrder } }, // Sorting stage with number value
      { $skip: skip }, // Skipping documents for pagination
      { $limit: limit }, // Limiting the number of documents
    ];

    console.log(
      "Pipeline before aggregation execution:",
      JSON.stringify(pipeline, null, 2)
    );

    const products = await Product.aggregate(pipeline);

    console.log("Products retrieved:", products);

    // Calculate total pages and current page information
    const totalPages = Math.ceil(totalDocuments / limit);
    const currentPage = page;
    const metadata = {
      totalDocuments,
      totalPages,
      currentPage,
      limit,
    };

    return { products, metadata };
  } catch (error) {
    console.error("Detailed error:", error.message, error.stack);
    throw new Error("Error getting products with stock levels");
  }
};

export const getProductWithStockLevel = async (productId, branchId) => {
  try {
    console.log("Entering getProductWithStockLevel function");
    console.log(
      `Received parameters: productId=${productId}, branchId=${branchId}`
    );

    const pipeline = [
      {
        $match: {
          _id: productId,
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
            $ifNull: [
              {
                $first: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$stockEntries",
                        as: "stock",
                        cond: { $eq: ["$$stock.branchId", branchId] },
                      },
                    },
                    as: "stock",
                    in: "$$stock.stockLevel",
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          images: 1,
          category: 1,
          size: 1,
          brand: 1,
          price: 1,
          stockLevel: 1,
        },
      },
    ];

    console.log("Executing aggregation pipeline:");
    console.log(JSON.stringify(pipeline, null, 2));

    const result = await Product.aggregate(pipeline);
    console.log("Aggregation pipeline result:");
    console.log(JSON.stringify(result, null, 2));

    console.log("Exiting getProductWithStockLevel function");

    return result[0];
  } catch (error) {
    console.error("Error getting product with stock level:", error);
    throw new Error("Error getting product with stock level!");
  }
};

export const checkProductAvailability = async (products, branchId) => {
  console.log("Entering checkProductAvailability function");
  const adjustments = []; // To store messages about adjustments
  const adjustedProducts = []; // To store adjusted product quantities

  for (const item of products) {
    console.log(`Checking availability for ${item.product.productName}`);

    const stock = await Stock.findOne({
      productId: item.product._id,
      branchId: branchId,
    });

    if (!stock || stock.stockLevel === 0) {
      console.log(`No stock found for ${item.product.productName}`);
      adjustments.push(
        `${item.product.productName} is out of stock and has been removed from your cart.`
      );
      continue; // Skip this item
    }

    console.log(
      `Stock found for ${item.product.productName}: ${stock.stockLevel}`
    );

    // Adjust quantity if needed
    if (stock.stockLevel < item.quantity) {
      console.log(
        `Insufficient stock for ${item.product.productName}. Available: ${stock.stockLevel}, Requested: ${item.quantity}`
      );
      adjustments.push(
        `Adjusted ${item.product.productName} quantity from ${item.quantity} to ${stock.stockLevel}.`
      );
      adjustedProducts.push({
        ...item,
        quantity: stock.stockLevel, // Adjust the quantity to available stock
      });
    } else {
      adjustedProducts.push(item); // Keep the original item if sufficient stock is available
    }
  }

  console.log("Exiting checkProductAvailability function");
  return { adjustedProducts, adjustments }; // Return both adjusted products and messages
};
