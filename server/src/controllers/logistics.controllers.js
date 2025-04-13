import {
  getLogistics,
  createLogistic,
  updateLogistic,
  deleteLogistic,
  getLogisticsById,
} from "../services/logistics.services.js";

export const getLogisticsController = async (req, res, next) => {
  try {
    console.log("Getting Logistics");
    const { searchQuery } = req.query;
    const logistics = await getLogistics(searchQuery);
    res.status(200).json(logistics);
  } catch (error) {
    next(error);
  }
};

export const createLogisticsController = async (req, res, next) => {
  try {
    const newLogistic = await createLogistic(req.body);
    res.status(201).json(newLogistic);
  } catch (error) {
    next(error);
  }
};

export const updateLogisticsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedLogistic = await updateLogistic(id, req.body);
    res.status(200).json(updatedLogistic);
  } catch (error) {
    next(error);
  }
};

export const deleteLogisticsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLogistic = await deleteLogistic(id);
    return  res.status(200).json(deletedLogistic);
  } catch (error) {
    next(error);
  }
};

export const getLogisticsByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const logistic = await getLogisticsById(id);
    res.status(200).json(logistic);
  } catch (error) {
    next(error);
  }
};
