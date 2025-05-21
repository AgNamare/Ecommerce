import { pagination } from "../middlewares/paginationHandler.js";
import User from "../models/user.model.js";
import { getUser, getUserOrders, updateUser } from "../services/admUser.service.js";

export const getUsersPageHandler = [
  pagination(User, {}, {}, ["fName", "lName", "phoneNumber"]),
  (req, res) => {
    res.json(res.paginatedResults);
  },
];

export const updateUserHandler = async (req, res, next) => {
  try {
    const { id } = req.body;
    const updatedUser = await updateUser();
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUser(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserOrdersHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await getUserOrders(id)
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
