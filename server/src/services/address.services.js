import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const createAddress = async (userId, address) => {
  // Step 1: Attempt to create and save the new address
  try {
    // Create a new address instance with the provided address and userId
    const newAddress = new Address({ address: { ...address }, user: userId });

    // Save the new address to the database
    await newAddress.save();

    // Step 2: Update the user's address list by adding the new address
    await User.findByIdAndUpdate(userId, {
      $push: { addresses: newAddress._id },
    });

    // Step 3: Retrieve the list of addresses for the user
    const addresses = await Address.find({ user: userId });

    // Step 4: Return the updated list of addresses
    return addresses;
  } catch (error) {
    // If any error occurs, throw it with a custom message
    const err = new Error(error.message || "Failed to create address");
    err.statusCode = error.statusCode || 400; // You can set a custom status code if needed
    throw err; // Re-throw the error for middleware to catch
  }
};

export const getAddresses = async (userId) => {
  // Step 1: Attempt to retrieve the addresses for the user
  try {
    const addresses = await Address.find({ user: userId });

    // Step 2: Return the retrieved addresses
    return addresses;
  } catch (error) {
    // Step 3: Handle any error that occurs and throw with a custom message
    const err = new Error(error.message || "Failed to retrieve addresses");
    err.statusCode = error.statusCode || 400; // Set a custom status code if needed
    throw err; // Re-throw the error for middleware to catch
  }
};

export const updateAddress = async (addressId, address) => {
  // Step 1: Attempt to update the address
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { ...address },
      { new: true } // Ensure the updated document is returned
    );

    // Step 2: If address is successfully updated, return the updated address
    return updatedAddress;
  } catch (error) {
    // Step 3: Handle any error and throw it with a custom message and status code
    const err = new Error(error.message || "Failed to update address");
    err.statusCode = error.statusCode || 400; // Default to 400 if no status code is provided
    throw err; // Re-throw the error for middleware to handle
  }
};

export const deleteAddress = async (userId, addressId) => {
  // Step 1: Attempt to delete the address document
  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    
    // Step 2: Check if the address exists and was deleted
    if (!deletedAddress) {
      const error = new Error("Address not found");
      error.statusCode = 404; // Not found status code
      throw error;
    }

    // Step 3: Remove the deleted address ID from the user's 'addresses' field
    await User.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId }, // Pull the deleted address ID from the user's addresses array
    });

    // Step 4: Retrieve the updated list of addresses for the user
    const addresses = await Address.find({ user: userId });

    // Step 5: Return the updated addresses list
    return addresses;

  } catch (error) {
    // Step 6: Handle errors with a custom message and status code if available
    const err = new Error(error.message || "Failed to delete address");
    err.statusCode = error.statusCode || 400; // Default to 400 if no status code is provided
    throw err; // Re-throw the error for middleware to handle
  }
};


export const getAddress = async (addressId) => {
  // Step 1: Attempt to find the address by its ID
  try {
    const address = await Address.findById(addressId);

    // Step 2: Check if the address exists
    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404; // Not found status code
      throw error;
    }

    // Step 3: Return the found address
    return address;

  } catch (error) {
    // Step 4: Handle any error and throw it with a custom message and status code
    const err = new Error(error.message || "Failed to fetch address");
    err.statusCode = error.statusCode || 400; // Default to 400 if no status code is provided
    throw err; // Re-throw the error for middleware to handle
  }
};

