import {
  createProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  getProduct,
  findSubcategory,
  findProductsByCategory,
} from "../services/products.service.js";
import { pagination } from "../middlewares/paginationHandler.js";
import Branch from "../models/branch.model.js";
import Product from "../models/products.models.js";
import { getProductsWithStockLevels } from "../utils/stockLevels.js";
export const postProductHandler = async (req, res, next) => {
  try {
    const newProduct = await createProduct(req.body);
    res
      .status(201)
      .json({ message: "product created", newProduct: newProduct });
  } catch (error) {
    next(error);
  }
};

export const getProductsPageHandler = [
  pagination(Product, {}, {}, ["productName"]),
  (req, res) => {
    res.json(res.paginatedResults);
  },
];

export const homeProductsPageHandler = async (req, res, next) => {
  const {
    branch,
    searchQuery = "",
    sortBy = "price",
    sortOrder = -1,
    page = 1,
    limit = 10,
    brand, // Added brand as an optional parameter
  } = req.query;

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const sortOrderNumber = parseInt(sortOrder, 10);

  console.log(branch);

  console.log("BranchId: ", branch);
  console.log("Search Query: ", searchQuery);
  console.log("Sort By: ", sortBy);
  console.log("Sort Order: ", sortOrderNumber);
  console.log("Page Number: ", pageNumber);
  console.log("Limit: ", limitNumber);
  console.log("Brand: ", brand); // Log the brand

  try {
    // Prepare criteria based on optional brand parameter
    const criteria = {};
    if (brand) {
      criteria.brand = brand; // Add brand filter to the criteria
    }

    const { products, metadata } = await getProductsWithStockLevels(
      branch,
      criteria, // Pass the criteria including brand
      searchQuery,
      sortBy,
      sortOrderNumber,
      pageNumber,
      limitNumber
    );

    res.json({
      products,
      metadata,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { branchName } = req.query;
    const updatedProduct = await updateProduct(id, branchName, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (req, res, next) => {
  try {
    const deletedProduct = await deleteProduct(req.body);
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    next(error);
  }
};

export const getProductHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { branchName } = req.query;
    console.log(id, branchName)
    const product = await getProduct(id, branchName);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
export const postCartProductsHandler = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const updatedCart = await addToCart(userId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBestSellersHandler = async (req, res, next) => {
  try {
    const {
      branchId,
      searchQuery = "",
      sortBy = "price",
      sortOrder = -1,
      page = 1,
      limit = 10,
    } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const sortOrderNumber = parseInt(sortOrder, 10);

    try {
      const { products, metadata } = await getProductsWithStockLevels(
        branchId,
        {}, // Use empty criteria or modify as needed
        searchQuery,
        sortBy,
        sortOrderNumber,
        pageNumber,
        limitNumber
      );

      res.json({
        products,
        metadata,
      });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    res.send(error);
  }
};

export const searchProductsHandler = async (req, res, next) => {
  try {
    console.log("Search products handler called");
    console.log("Query:", req.query);

    const { query = "", page = 1, sortBy = "createdAt" } = req.query;
    const branchId = req.query.branchId;

    console.log("branchId:", branchId);

    // Convert sortOrder to a number
    const sortOrder = parseInt(req.query.sortOrder, 10) || -1;
    const limit = parseInt(req.query.limit, 10) || 10;

    console.log("sortOrder:", sortOrder);
    console.log("limit:", limit);

    // Call the function with the parameters
    const { products, metadata } = await getProductsWithStockLevels(
      branchId,
      { $or: [{ productName: { $regex: query, $options: "i" } }] },
      query,
      sortBy,
      sortOrder,
      page,
      limit
    );

    console.log("products:", products);

    // Check if products were found
    if (products.length === 0) {
      console.log("No products found matching your criteria.");
      return res
        .status(404)
        .json({ error: "No products found matching your criteria." });
    }

    // Send the response
    res.status(200).json({ products, metadata });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getBranchesHandler = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    if (!branches) {
      return res.json([]);
    }

    const formattedBranches = branches.map((branch) => ({
      label: branch.name,
      value: branch.name,
      id: branch._id,
    }));

    res.json(formattedBranches);
  } catch (error) {
    console.error("Error getting branches: ", error);
    res.send(error);
  }
};

export const getSubcategoryHandler = async (req, res, next) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const subcategory = await findSubcategory(category);
    res.status(200).json(subcategory);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategoryHandler = async (req, res, next) => {
  try {
    const { category, branch, searchQuery, sortBy } = req.query;
    const sortOrder = parseInt(req.query.sortOrder, 10) || -1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const products = await findProductsByCategory(
      category,
      branch,
      searchQuery,
      sortBy,
      sortOrder,
      page,
      limit
    );
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
