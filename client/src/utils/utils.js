export const months = {
  January: "1",
  February: "2",
  March: "3",
  April: "4",
  May: "5",
  June: "6",
  July: "7",
  August: "8",
  September: "9",
  October: "10",
  November: "11",
  December: "12",
};

export const categories = [
  {
    id: 1,
    name: "Fruits & Vegetables",
    groups: [
      {
        title: "Fruits",
        subcategories: [
          {
            id: 1,
            name: "Citrus Fruits",
            link: encodeURIComponent("Citrus Fruits"),
          },
          {
            id: 2,
            name: "Tropical Fruits",
            link: encodeURIComponent("Tropical Fruits"),
          },
          { id: 3, name: "Berries", link: encodeURIComponent("Berries") },
        ],
      },
      {
        title: "Vegetables",
        subcategories: [
          {
            id: 4,
            name: "Leafy Greens",
            link: encodeURIComponent("Leafy Greens"),
          },
          {
            id: 5,
            name: "Roots & Tubers",
            link: encodeURIComponent("Roots & Tubers"),
          },
          {
            id: 6,
            name: "Fruits & Other Vegetables",
            link: encodeURIComponent("Fruits & Other Vegetables"),
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Meat & Fish",
    groups: [
      {
        title: "Fresh Meat",
        subcategories: [
          { id: 7, name: "Red Meat", link: encodeURIComponent("Red Meat") },
          { id: 8, name: "Poultry", link: encodeURIComponent("Poultry") },
          {
            id: 9,
            name: "Processed Meat",
            link: encodeURIComponent("Processed Meat"),
          },
        ],
      },
      {
        title: "Fish",
        subcategories: [
          {
            id: 10,
            name: "Fresh Water Fish",
            link: encodeURIComponent("Fresh Water Fish"),
          },
          {
            id: 11,
            name: "Saltwater Fish",
            link: encodeURIComponent("Saltwater Fish"),
          },
          { id: 12, name: "Seafood", link: encodeURIComponent("Seafood") },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Dairy Products",
    groups: [
      {
        title: "Milk & Cream",
        subcategories: [
          {
            id: 13,
            name: "Fresh Milk",
            link: encodeURIComponent("Fresh Milk"),
          },
          { id: 14, name: "Cream", link: encodeURIComponent("Cream") },
        ],
      },
      {
        title: "Cheese & Yoghurt",
        subcategories: [
          { id: 15, name: "Yoghurt", link: encodeURIComponent("Yoghurt") },
          { id: 16, name: "Cheese", link: encodeURIComponent("Cheese") },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Bakery",
    groups: [
      {
        title: "Breads",
        subcategories: [
          { id: 17, name: "Loaves", link: encodeURIComponent("Loaves") },
          {
            id: 18,
            name: "Buns & Rolls",
            link: encodeURIComponent("Buns & Rolls"),
          },
        ],
      },
      {
        title: "Pastries",
        subcategories: [
          {
            id: 19,
            name: "Savory Pastries",
            link: encodeURIComponent("Savory Pastries"),
          },
          {
            id: 20,
            name: "Sweet Pastries",
            link: encodeURIComponent("Sweet Pastries"),
          },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Snacks",
    groups: [
      {
        title: "Chips & Crisps",
        subcategories: [
          {
            id: 21,
            name: "Potato Chips",
            link: encodeURIComponent("Potato Chips"),
          },
          {
            id: 22,
            name: "Vegetable Chips",
            link: encodeURIComponent("Vegetable Chips"),
          },
        ],
      },
      {
        title: "Confectionery",
        subcategories: [
          {
            id: 23,
            name: "Chocolates",
            link: encodeURIComponent("Chocolates"),
          },
          { id: 24, name: "Biscuits", link: encodeURIComponent("Biscuits") },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Beverages",
    groups: [
      {
        title: "Soft Drinks",
        subcategories: [
          {
            id: 25,
            name: "Carbonated Drinks",
            link: encodeURIComponent("Carbonated Drinks"),
          },
          { id: 26, name: "Juices", link: encodeURIComponent("Juices") },
        ],
      },
      {
        title: "Hot Drinks",
        subcategories: [
          { id: 27, name: "Coffee", link: encodeURIComponent("Coffee") },
          { id: 28, name: "Tea", link: encodeURIComponent("Tea") },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "Rice, Pasta & Grains",
    groups: [
      {
        title: "Rice & Pasta",
        subcategories: [
          { id: 29, name: "Rice", link: encodeURIComponent("Rice") },
          { id: 30, name: "Pasta", link: encodeURIComponent("Pasta") },
        ],
      },
      {
        title: "Flours",
        subcategories: [
          {
            id: 31,
            name: "Baking Flours",
            link: encodeURIComponent("Baking Flours"),
          },
          {
            id: 32,
            name: "Specialty Flours",
            link: encodeURIComponent("Specialty Flours"),
          },
        ],
      },
    ],
  },
];

export const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
