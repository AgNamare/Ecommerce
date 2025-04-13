import {
  getAllOrders,
  updateOrderLogistics,
  findOrders,
  getOrder,
} from "../services/orders.services.js";

import { getOrdersService } from "../services/orders.services.js"; // Adjust the path as needed

export const getAllOrdersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const logistic = req.query.logistic;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.searchQuery || "";
    const sortOption = req.query.sortOption || "createdAt"; // Adjusted to match frontend default
    const status = req.query.status || "";
    const method = req.query.method || ""; // Updated field name
    const startDate = req.query.startDate || ""; // Updated field name
    const endDate = req.query.endDate || ""; // Updated field name
    const deliverySlot = req.query.deliverySlot || "";

    // Fetch orders using the service with the updated parameters
    const ordersData = await getOrdersService({
      searchQuery,
      page,
      limit,
      sortOption,
      deliverySlot,
      logistic,
      status,
      method, // Updated field name
      startDate, // Updated field name
      endDate, // Updated field name
    });

    res.status(200).json({
      metadata: ordersData.metadata,
      results: ordersData.results,
      next: ordersData.next,
      previous: ordersData.previous,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Error retrieving orders." });
  }
};

// src/controllers/orders.controller.js

import { updateOrderStatusByUser as updateOrderStatusByUserService } from "../services/orders.services.js";

export const updateOrderStatusByUser = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { newStatus } = req.body;

    if (!newStatus) {
      console.log("Controller - Error: newStatus is required");
      return res.status(400).json({ message: "newStatus is required" });
    }

    const result = await updateOrderStatusByUserService(orderId, newStatus);

    res.status(200).json(result);
  } catch (error) {
    console.error("Controller - Error updating orders:", error);
    res.status(500).json({ message: "Error updating orders." });
  }
};

// Controller to get orders by userId with pagination and status filter
export const getOrdersByUserIdController = async (req, res) => {
  try {
    const userId = req.query.userId;
    const method = req.query.method;

    const orders = await findOrders(userId, method);

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving orders." });
  }
};
export const getOrderController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await getOrder(orderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderLogisticsController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { newLogisticId } = req.body;
    const updatedOrder = await updateOrderLogistics(orderId, newLogisticId);
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
