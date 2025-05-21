import Order from "../models/order.model.js";

export const getAllOrders = async () => {
  try {
    return await Order.find().exec();
  } catch (error) {
    console.error("Error retrieving orders from service:", error);
    throw new Error("Error retrieving orders.");
  }
};

export const findOrders = async (userId, method = null) => {
  try {
    // Initialize query to find orders by user ID
    let query = { user: userId };

    // If a method is provided, add it to the query
    if (method) {
      query["delivery.method"] = method;
    }

    // Find orders based on the query
    const orders = await Order.find(query)
      .populate({
        path: "products.id", // Populate the product details
        model: "Product",
        select: "productName description price images discountPrice", // Specify fields to select from Product
      })
      .populate({
        path: "delivery.address", // Populate the delivery address
      })
      .populate({
        path: "branch", // Populate the branch details
        select: "name address", // Specify fields to select from Branch
      })
      .exec();

    return orders; // Return the found orders
  } catch (error) {
    // Handle error and throw with custom message and status code
    const err = new Error(error.message || "Error finding orders");
    err.statusCode = error.statusCode || 500;
    throw err; // Re-throw the error to be handled by controller middleware
  }
};

import mongoose from "mongoose";

export const updateOrderStatusByUser = async (orderId, newStatus) => {
  const session = await mongoose.startSession(); // Start a transaction session
  try {
    session.startTransaction(); // Start the transaction

    // Define filter to match by _id
    const filter = { _id: orderId };

    // Update status of the specified order within the transaction
    const updateResult = await Order.updateOne(filter, {
      $set: { status: newStatus },
    }).session(session); // Attach session to the query

    // Check if the order was found and updated
    if (updateResult.matchedCount === 0) {
      throw new Error("Order not found or not updated");
    }

    // Retrieve the updated order document with populated fields
    const updatedDocument = await Order.findOne(filter)
      .populate("user")
      .populate("delivery.address")
      .populate("branch")
      .populate("payment")
      .populate("logistics")
      .session(session); // Attach session to the query

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return updatedDocument; // Return the updated order document
  } catch (error) {
    // Rollback the transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    // Throw the error with a custom message
    throw new Error(error.message || "Error updating order status");
  }
};

export const getOrder = async (orderId) => {
  try {
    // Attempt to find the order by ID and populate relevant fields
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("delivery.address")
      .populate("products.id")
      .populate("branch")
      .populate("payment")
      .populate("logistics")
      .exec();

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    // Catch and throw an error with a custom message
    throw new Error(error.message || "Error retrieving order.");
  }
};

export const getOrdersService = async ({
  searchQuery,
  page,
  limit,
  logistic,
  sortOption,
  deliverySlot,
  status,
  method,
  startDate,
  endDate,
}) => {
  console.log("getOrdersService called with parameters:", {
    searchQuery,
    page,
    limit,
    logistic,
    sortOption,
    deliverySlot,
    status,
    method,
    startDate,
    endDate,
  });

  const startIndex = (page - 1) * limit;

  const searchConditions = [];

  // Search by orderId using searchQuery
  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    searchConditions.push({ orderId: regex });
  }

  // Filter by status
  if (status) {
    const statusRegex = new RegExp(status, "i");
    searchConditions.push({ status: statusRegex });
  }

  // Filter by delivery method
  if (method) {
    const methodRegex = new RegExp(method, "i");
    searchConditions.push({ "delivery.method": methodRegex });
  }

  // Filter by creation time range
  if (startDate) {
    searchConditions.push({
      createdAt: {
        $gte: new Date(startDate),
      },
    });
  }

  if (endDate) {
    searchConditions.push({
      createdAt: {
        $lte: new Date(endDate),
      },
    });
  }

  // Filter by delivery slot hour
  if (deliverySlot) {
    const targetHour = parseInt(deliverySlot, 10); // Assumes deliverySlot is a string like "09"
    searchConditions.push({
      $expr: {
        $eq: [
          { $hour: "$delivery.deliverySlot" }, // Extract hour from deliverySlot field
          targetHour,
        ],
      },
    });
  }

  // Filter by Logistics
  if (logistic) {
    // Ensure logistic is a valid ObjectId string and convert it to an ObjectId
    if (mongoose.Types.ObjectId.isValid(logistic)) {
      searchConditions.push({ logistics: logistic });
    } else {
      console.error("Invalid logistic ObjectId:", logistic);
    }
  }

  const countFilter =
    searchConditions.length > 0 ? { $and: searchConditions } : {};

  try {
    const totalCount = await Order.countDocuments(countFilter).exec();
    console.log("getOrdersService: totalCount:", totalCount);

    let queryBuilder =
      searchConditions.length > 0
        ? Order.find({ $and: searchConditions })
        : Order.find({});

    // Sorting based on the sortOption parameter
    if (sortOption === "newest") {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    } else if (sortOption === "oldest") {
      queryBuilder = queryBuilder.sort({ createdAt: 1 });
    } else if (sortOption === "bestmatch") {
      queryBuilder = queryBuilder.sort({ "products.productName": 1 });
    }

    queryBuilder = queryBuilder.skip(startIndex).limit(limit);

    // Execute query and populate references
    const results = await queryBuilder.exec();
    console.log("getOrdersService: results:", results);

    await Order.populate(results, [
      { path: "user" },
      { path: "delivery.address" },
      { path: "products.id" },
      { path: "branch" },
      { path: "payment" },
    ]);

    return {
      metadata: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      results,
      next: startIndex + limit < totalCount ? { page: page + 1, limit } : null,
      previous: startIndex > 0 ? { page: page - 1, limit } : null,
    };
  } catch (error) {
    console.error("getOrdersService error:", error);
    throw new Error(error.message || "Error retrieving orders.");
  }
};

export const updateOrderLogistics = async (orderId, newLogisticId) => {
  try {
    // Find and update the order by ID, setting the new logistics information
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { logistics: newLogisticId } },
      { new: true } // Return the updated document
    )
      .populate("logistics")
      .populate("user")
      .populate("products.id")
      .populate("branch")
      .populate("delivery.address")
      .populate("payment");

    // Check if the order was found and updated
    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  } catch (error) {
    throw new Error(error.message || "Error updating order logistics.");
  }
};
