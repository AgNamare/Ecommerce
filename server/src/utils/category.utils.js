import Category from "../models/category.models.js";
export const populateCategoryAncestors = async (categoryId, depth = 0) => {
  const category = await Category.findById(categoryId)
    .populate("parent")
    .populate("path");

  if (!category || !category.parent || depth >= 10) {
    // Limit recursion to avoid infinite loops
    return category;
  }

  category.parent = await populateCategoryAncestors(
    category.parent._id,
    depth + 1
  );

  return category;
};

export const addCategory = async (
  name,
  description = null,
  bannerImageUrl = null,
  parent = null,
  imageUrl = null
) => {
  try {
    console.log("Creating category in addCategory function:");
    console.log("Category name:", name);
    console.log("Description:", description);
    console.log("Parent ID:", parent);
    console.log("Image URL:", imageUrl);
    console.log("Banner Image URL:", bannerImageUrl);

    let parentPath = [];

    if (parent) {
      console.log("Finding parent category with ID:", parent);
      // Find the parent category and get its path
      const parentCategory = await Category.findById(parent).exec();
      if (!parentCategory) {
        console.error("Parent category not found for ID:", parent);
        throw new Error("Parent category not found");
      }
      parentPath = parentCategory.path || []; // Get the path from the parent category
      console.log("Found parent category:", parentCategory);
      console.log("Parent category path:", parentPath);
    }

    // Create a new category with the updated path
    const newCategory = new Category({
      name,
      description,
      parent,
      imageUrl,
      bannerImageUrl,
      path: parentPath.concat(parent || []), // Append the parent ID to the path
    });

    console.log("Prepared new category object for saving:", newCategory);

    // Save the new category
    await newCategory.save();
    console.log("New category saved successfully:", newCategory);
    return newCategory;
  } catch (error) {
    console.error("Error creating category in addCategory function:", error);
    throw error;
  }
};

export const findAllDescendantCategories = async (parentId) => {
  // Find direct children of the parent category
  const subcategories = await Category.find({ parent: parentId }).select("_id");

  let allCategoryIds = subcategories.map((cat) => cat._id);

  // For each subcategory, find its descendants
  for (const subcategory of subcategories) {
    const descendantCategoryIds = await findAllDescendantCategories(
      subcategory._id
    );
    allCategoryIds = allCategoryIds.concat(descendantCategoryIds);
  }
  allCategoryIds.push(parentId);

  return allCategoryIds;
};

export const findCategoryByName = async (name) => {
  return await Category.findOne({ name });
};
