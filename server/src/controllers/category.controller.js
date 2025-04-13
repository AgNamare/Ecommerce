import { pagination } from "../middlewares/paginationHandler.js";
import Category from "../models/category.models.js";
import Product from "../models/products.models.js";
import {
  addCategory,
  findCategoryByName,
  populateCategoryAncestors,
} from "../utils/category.utils.js";

const products = [
  {
    category: "66b0b419d1768893ac877ea0",
    productName: "Samsung Galaxy S21",
    brand: "Samsung",
    SKU: "SGS21-001",
    measurementUnit: "Piece",
    size: "6.2 inches",
    price: "799.99",
    discountPrice: "749.99",
    noOfUnits: "50",
    images: ["https://example.com/images/sgs21.jpg"],
    description:
      "The Samsung Galaxy S21 features a 6.2-inch screen and a powerful camera.",
  },
  {
    category: "66b0b419d1768893ac877ea0",
    productName: "iPhone 13 Pro",
    brand: "Apple",
    SKU: "IP13P-002",
    measurementUnit: "Piece",
    size: "6.1 inches",
    price: "999.99",
    discountPrice: "949.99",
    noOfUnits: "30",
    images: ["https://example.com/images/iphone13pro.jpg"],
    description:
      "Apple iPhone 13 Pro with a 6.1-inch display and A15 Bionic chip.",
  },
  // ... Include all 50 products here
  {
    category: "66b0b994e6ddadd64a23547b",
    productName: "Dumbbell Set",
    brand: "Bowflex",
    SKU: "DS-025",
    measurementUnit: "Piece",
    size: "Adjustable",
    price: "199.99",
    discountPrice: "179.99",
    noOfUnits: "20",
    images: ["https://example.com/images/dumbbellset.jpg"],
    description: "Adjustable dumbbell set for home workouts.",
  },
  {
    category: "66b0b419d1768893ac877ea0", // Mobile Phones
    productName: "Samsung Galaxy S21",
    brand: "Samsung",
    SKU: "SGS21-001",
    measurementUnit: "Piece",
    size: "6.2 inches",
    price: "799.99",
    discountPrice: "749.99",
    noOfUnits: "50",
    images: ["https://example.com/images/sgs21.jpg"],
    description:
      "The Samsung Galaxy S21 features a 6.2-inch screen and a powerful camera.",
  },
  {
    category: "66b0b419d1768893ac877ea0", // Mobile Phones
    productName: "iPhone 13 Pro",
    brand: "Apple",
    SKU: "IP13P-002",
    measurementUnit: "Piece",
    size: "6.1 inches",
    price: "999.99",
    discountPrice: "949.99",
    noOfUnits: "30",
    images: ["https://example.com/images/iphone13pro.jpg"],
    description:
      "Apple iPhone 13 Pro with a 6.1-inch display and A15 Bionic chip.",
  },
  {
    category: "66b0b71de6ddadd64a235469", // Computers
    productName: "Dell XPS 13",
    brand: "Dell",
    SKU: "DX13-003",
    measurementUnit: "Piece",
    size: "13.3 inches",
    price: "1299.99",
    discountPrice: "1199.99",
    noOfUnits: "20",
    images: ["https://example.com/images/dellxps13.jpg"],
    description:
      "The Dell XPS 13 is a high-performance laptop with a 13.3-inch screen.",
  },
  {
    category: "66b0b71de6ddadd64a235469", // Computers
    productName: "MacBook Pro 16",
    brand: "Apple",
    SKU: "MBP16-004",
    measurementUnit: "Piece",
    size: "16 inches",
    price: "2399.99",
    discountPrice: "2299.99",
    noOfUnits: "15",
    images: ["https://example.com/images/macbookpro16.jpg"],
    description: "Apple MacBook Pro 16-inch with M1 Pro chip.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0a", // Electronics
    productName: "Sony WH-1000XM4",
    brand: "Sony",
    SKU: "WH1000XM4-005",
    measurementUnit: "Piece",
    size: "N/A",
    price: "349.99",
    discountPrice: "299.99",
    noOfUnits: "40",
    images: ["https://example.com/images/sonywh1000xm4.jpg"],
    description: "Sony WH-1000XM4 wireless noise-canceling headphones.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0b", // Clothing
    productName: "Leather Jacket",
    brand: "Urban Outfitters",
    SKU: "LJ-006",
    measurementUnit: "Piece",
    size: "M",
    price: "199.99",
    discountPrice: "179.99",
    noOfUnits: "25",
    images: ["https://example.com/images/leatherjacket.jpg"],
    description: "A stylish leather jacket perfect for any occasion.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0b", // Clothing
    productName: "Summer Dress",
    brand: "H&M",
    SKU: "SD-007",
    measurementUnit: "Piece",
    size: "S",
    price: "49.99",
    discountPrice: "39.99",
    noOfUnits: "60",
    images: ["https://example.com/images/summerdress.jpg"],
    description: "A lightweight summer dress ideal for hot weather.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0c", // Home & Kitchen
    productName: "Instant Pot Duo",
    brand: "Instant Pot",
    SKU: "IPD-008",
    measurementUnit: "Piece",
    size: "6 Quart",
    price: "89.99",
    discountPrice: "79.99",
    noOfUnits: "35",
    images: ["https://example.com/images/instantpotduo.jpg"],
    description: "A versatile Instant Pot Duo for cooking a variety of meals.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0c", // Home & Kitchen
    productName: "Coffee Maker",
    brand: "Keurig",
    SKU: "CM-009",
    measurementUnit: "Piece",
    size: "Single Serve",
    price: "59.99",
    discountPrice: "49.99",
    noOfUnits: "45",
    images: ["https://example.com/images/coffeemaker.jpg"],
    description:
      "A single-serve coffee maker for quick and easy coffee brewing.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0d", // Books
    productName: "The Great Gatsby",
    brand: "Scribner",
    SKU: "TGG-010",
    measurementUnit: "Piece",
    size: "N/A",
    price: "14.99",
    discountPrice: "12.99",
    noOfUnits: "100",
    images: ["https://example.com/images/thegreatgatsby.jpg"],
    description: "F. Scott Fitzgerald's classic novel, The Great Gatsby.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0d", // Books
    productName: "1984",
    brand: "Harcourt",
    SKU: "1984-011",
    measurementUnit: "Piece",
    size: "N/A",
    price: "19.99",
    discountPrice: "17.99",
    noOfUnits: "80",
    images: ["https://example.com/images/1984.jpg"],
    description: "George Orwell's dystopian novel, 1984.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0e", // Sports & Outdoors
    productName: "Running Shoes",
    brand: "Nike",
    SKU: "RS-012",
    measurementUnit: "Piece",
    size: "10",
    price: "89.99",
    discountPrice: "79.99",
    noOfUnits: "70",
    images: ["https://example.com/images/runningshoes.jpg"],
    description: "Comfortable running shoes suitable for all terrains.",
  },
  {
    category: "66b0b7c345ccc367a8e8fd0e", // Sports & Outdoors
    productName: "Camping Tent",
    brand: "Coleman",
    SKU: "CT-013",
    measurementUnit: "Piece",
    size: "4-person",
    price: "129.99",
    discountPrice: "119.99",
    noOfUnits: "20",
    images: ["https://example.com/images/campingtent.jpg"],
    description: "A durable camping tent for outdoor adventures.",
  },
  {
    category: "66b0b81ce6ddadd64a23546d", // Men's Clothing
    productName: "Slim Fit Jeans",
    brand: "Levi's",
    SKU: "SFJ-014",
    measurementUnit: "Piece",
    size: "32",
    price: "59.99",
    discountPrice: "49.99",
    noOfUnits: "40",
    images: ["https://example.com/images/slimfitjeans.jpg"],
    description: "Comfortable slim fit jeans for men.",
  },
  {
    category: "66b0b81ce6ddadd64a23546d", // Men's Clothing
    productName: "Oxford Shirt",
    brand: "Tommy Hilfiger",
    SKU: "OS-015",
    measurementUnit: "Piece",
    size: "L",
    price: "69.99",
    discountPrice: "59.99",
    noOfUnits: "30",
    images: ["https://example.com/images/oxfordshirt.jpg"],
    description: "A stylish Oxford shirt suitable for formal occasions.",
  },
  {
    category: "66b0b831e6ddadd64a23546f", // Women's Clothing
    productName: "Summer Skirt",
    brand: "Zara",
    SKU: "SS-016",
    measurementUnit: "Piece",
    size: "M",
    price: "39.99",
    discountPrice: "29.99",
    noOfUnits: "50",
    images: ["https://example.com/images/summerskirt.jpg"],
    description: "A breezy summer skirt perfect for warm weather.",
  },
  {
    category: "66b0b831e6ddadd64a23546f", // Women's Clothing
    productName: "Winter Coat",
    brand: "North Face",
    SKU: "WC-017",
    measurementUnit: "Piece",
    size: "L",
    price: "199.99",
    discountPrice: "179.99",
    noOfUnits: "25",
    images: ["https://example.com/images/wintercoat.jpg"],
    description: "A warm winter coat designed for extreme cold.",
  },
  {
    category: "66b0b8a2e6ddadd64a235471", // Kitchen Appliances
    productName: "Blender",
    brand: "Ninja",
    SKU: "BL-018",
    measurementUnit: "Piece",
    size: "N/A",
    price: "79.99",
    discountPrice: "69.99",
    noOfUnits: "40",
    images: ["https://example.com/images/blender.jpg"],
    description: "A powerful blender for making smoothies and soups.",
  },
  {
    category: "66b0b8a2e6ddadd64a235471", // Kitchen Appliances
    productName: "Toaster",
    brand: "Cuisinart",
    SKU: "TS-019",
    measurementUnit: "Piece",
    size: "2-slice",
    price: "39.99",
    discountPrice: "29.99",
    noOfUnits: "60",
    images: ["https://example.com/images/toaster.jpg"],
    description: "A 2-slice toaster with adjustable settings.",
  },
  {
    category: "66b0b924e6ddadd64a235477", // Furniture
    productName: "Dining Table",
    brand: "IKEA",
    SKU: "DT-020",
    measurementUnit: "Piece",
    size: "4-person",
    price: "149.99",
    discountPrice: "139.99",
    noOfUnits: "15",
    images: ["https://example.com/images/diningtable.jpg"],
    description: "A stylish dining table that seats 4.",
  },
  {
    category: "66b0b924e6ddadd64a235477", // Furniture
    productName: "Office Chair",
    brand: "Herman Miller",
    SKU: "OC-021",
    measurementUnit: "Piece",
    size: "Adjustable",
    price: "349.99",
    discountPrice: "299.99",
    noOfUnits: "20",
    images: ["https://example.com/images/officechair.jpg"],
    description: "An ergonomic office chair for comfort and support.",
  },
  {
    category: "66b0b994e6ddadd64a235479", // Outdoor Gear
    productName: "Hiking Backpack",
    brand: "Osprey",
    SKU: "HB-022",
    measurementUnit: "Piece",
    size: "50L",
    price: "149.99",
    discountPrice: "139.99",
    noOfUnits: "25",
    images: ["https://example.com/images/hikingbackpack.jpg"],
    description: "A durable hiking backpack with ample storage.",
  },
  {
    category: "66b0b994e6ddadd64a235479", // Outdoor Gear
    productName: "Sleeping Bag",
    brand: "Marmot",
    SKU: "SB-023",
    measurementUnit: "Piece",
    size: "Regular",
    price: "99.99",
    discountPrice: "89.99",
    noOfUnits: "30",
    images: ["https://example.com/images/sleepingbag.jpg"],
    description: "A cozy sleeping bag for outdoor camping.",
  },
  {
    category: "66b0b994e6ddadd64a23547b", // Fitness Equipment
    productName: "Yoga Mat",
    brand: "Liforme",
    SKU: "YM-024",
    measurementUnit: "Piece",
    size: "Standard",
    price: "49.99",
    discountPrice: "39.99",
    noOfUnits: "50",
    images: ["https://example.com/images/yogamat.jpg"],
    description: "A high-quality yoga mat for all types of exercises.",
  },
  {
    category: "66b0b994e6ddadd64a23547b", // Fitness Equipment
    productName: "Dumbbell Set",
    brand: "Bowflex",
    SKU: "DS-025",
    measurementUnit: "Piece",
    size: "Adjustable",
    price: "199.99",
    discountPrice: "179.99",
    noOfUnits: "20",
    images: ["https://example.com/images/dumbbellset.jpg"],
    description: "Adjustable dumbbell set for home workouts.",
  },
  // Add 40 more products in a similar format
];

export const addProducts = async (req, res) => {
  try {
    await Product.insertMany(products);
    res.status(200).json({ message: "Products added successfully" });
  } catch (error) {
    console.error("Error adding products:", error);
    res.status(500).json({ message: "Failed to add products", error });
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("parent");
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// Get a single category by ID with all ancestors populated
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await populateCategoryAncestors(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Create a new category
export const createCategory = async (req, res, next) => {
  const { name, description, parent, imageUrl, bannerImageUrl } = req.body;

  // Log input details
  console.log("Incoming request body for creating category:", req.body);
  console.log("Creating category with name:", name);
  console.log("Creating category with description:", description);
  console.log("Creating category with parent:", parent);
  console.log("Creating category with imageUrl:", imageUrl);
  console.log("Creating category with bannerImageUrl:", bannerImageUrl);

  try {
    console.log("Checking for existing category with name:", name);

    // Check if a category with the same name already exists
    const existingCategory = await findCategoryByName(name);
    console.log("Existing category check result:", existingCategory);

    if (existingCategory) {
      console.log("Category already exists:", existingCategory);
      return res
        .status(400)
        .json({ message: "Category with the same name already exists" });
    }

    console.log(
      "No existing category found. Proceeding to create new category:",
      name
    );

    // Proceed to create the new category if it doesn't exist
    const newCategory = await addCategory(
      name,
      description,
      bannerImageUrl,
      parent,
      imageUrl
    );
    console.log("New category created:", newCategory);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    next(error);
  }
};

// Update an existing category
export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const {
      name,
      description,
      parent: newParentId,
      imageUrl,
      bannerImageUrl,
    } = req.body;

    // Find the current category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Updating category:", category);

    // Check if the parent is changing
    const parentChanged =
      newParentId && category.parent?.toString() !== newParentId.toString();

    // If the parent has changed, update the path field
    if (parentChanged) {
      // Find the new parent category
      const newParentCategory = await Category.findById(newParentId);
      if (!newParentCategory) {
        return res
          .status(404)
          .json({ message: "New parent category not found" });
      }

      console.log("New parent category:", newParentCategory);

      // Set the new path
      category.path = newParentCategory.path.concat(newParentId);
      category.parent = newParentId;

      console.log("Updated path:", category.path);
    } else {
      // If parent hasn't changed, retain current path
      category.path = category.path; // or simply omit this line if path is unchanged
    }

    // Update other fields
    category.name = name || category.name;
    category.description = description || category.description;
    category.imageUrl = imageUrl || category.imageUrl;
    category.bannerImageUrl = bannerImageUrl;

    console.log("Updated category:", category);

    // Save the updated category
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    console.error("Error updating category:", err);
    next(err);
  }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};

export const getPaginatedCategories = [
  pagination(Category, {}, {}, ["name"], ["parent"]),
  (req, res) => {
    res.json(res.paginatedResults);
  },
];
