import Categories from "../models/categories.models.js";
import { categoryExists } from "../utils/products.utils.js";

export const createCategorie = async (categorieData) => {
  const { level_1_name, level_2_name, ...rest } = categorieData;

  try {
    const exists = await categoryExists();
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

export const updateCategorie = async (categorieData) => {
  const { level_1_name,newLevel_1_name,...rest } = categorieData;

  try {
    const updatedCategorie = await Categories.findOneAndUpdate(
      { level_1_name: level_1_name },
      { level_1_name, level_1_name: newLevel_1_name || level_1_name, ...rest },
      { new: true }
    );
    
    if (!updatedCategorie) {
      throw new Error("updateCategorie not found");
    }

    return updatedCategorie;
  } catch (error) {
    throw new Error("Error updating categoreie: " + error.message);
  }
};
