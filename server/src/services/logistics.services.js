import Logistics from "../models/logistics.model.js"
import { generateUniqueId } from "../utils/logistics.utils.js";

export const getLogistics = async (searchQuery = '') => {
  try {
    // Create a regular expression for case-insensitive search
    const regex = new RegExp(searchQuery, 'i');
    
    // Query logistics with optional search criteria
    const logistics = await Logistics.find({
      $or: [
        { driver_name: { $regex: regex } },
        { vehicle_registration_number: { $regex: regex } }
      ]
    });

    console.log(logistics); // Debugging line to check fetched logistics
    return logistics;
  } catch (error) {
    console.error('Error fetching logistics:', error); // More informative error logging
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const createLogistic = async (logisticsData) => {
  try {
    // Generate a unique logistics_id
    const logistics_id = generateUniqueId();

    // Check if a logistics entry with the same vehicle_registration_number already exists
    const existingLogistics = await Logistics.findOne({
      vehicle_registration_number: logisticsData.vehicle_registration_number,
    });

    if (existingLogistics) {
      // If a duplicate is found, throw a custom error
      throw new Error("Vehicle Already Exists");
    }

    // Create a new logistics entry with the provided data and the new logistics_id
    const newLogistics = new Logistics({
      ...logisticsData,
      logistics_id, // Add the unique ID to the logisticsData
    });

    await newLogistics.save();
    console.log("Logistics created:", newLogistics); // Debugging line
    return newLogistics;
  } catch (error) {
    console.error("Error creating logistics:", error); // More informative error logging
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const deleteLogistic = async (logisticsId) => {
  try {
    // Find and delete the logistics entry by its ID
    const result = await Logistics.findByIdAndDelete(logisticsId);
    if (!result) {
      throw new Error('Logistics not found');
    }
    console.log('Logistics deleted:', result); // Debugging line
    return result;
  } catch (error) {
    console.error('Error deleting logistics:', error); // More informative error logging
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const updateLogistic = async (logisticsId, updateData) => {
  try {
    console.log(updateData)
    // Find and update the logistics entry by its ID with the new data
    const updatedLogistics = await Logistics.findByIdAndUpdate(
      logisticsId,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run validators
    );
    if (!updatedLogistics) {
      throw new Error('Logistics not found');
    }
    console.log('Logistics updated:', updatedLogistics); // Debugging line
    return updatedLogistics;
  } catch (error) {
    console.error('Error updating logistics:', error); // More informative error logging
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const getLogisticsById = async (logisticsId) => {
  try {
    // Find the logistics entry by its ID
    const logistics = await Logistics.findById(logisticsId);
    if (!logistics) {
      throw new Error('Logistics not found');
    }
    console.log('Logistics found:', logistics); // Debugging line
    return logistics;
  } catch (error) {
    console.error('Error finding logistics:', error); // More informative error logging
    throw error; // Rethrow the error to be handled by the caller
  }
}