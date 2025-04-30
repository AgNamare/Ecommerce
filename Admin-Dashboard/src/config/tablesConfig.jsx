import React from "react";
import { Truck, Bike, Car } from "lucide-react"; // Ensure you import relevant icons
import { Link } from "react-router-dom";
export const productTableConfig = {
  columns: {
    images: {
      label: "Image",
      render: (value) => {
        return value[0]
          ? React.createElement("img", {
              src: value[0],
              alt: "Product Image",
              style: { width: "40px", height: "40px", borderRadius: "10px" },
            })
          : null;
      },
    },
    SKU: {
      label: "SKU",
    },
    productName: {
      label: "Product Name",
    },
    price: {
      label: "Price",
    },
    createdAt: {
      label: "Created At",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    updatedAt: {
      label: "Updated At",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  },
  order: ["images", "SKU", "productName", "price", "createdAt", "updatedAt"],
};

export const userTableConfig = {
  columns: {
    fName: { label: "First Name" },
    lName: { label: "Last Name" },
    gender: { label: "Gender" },
    phoneNumber: { label: "Phone Number" },
    email: { label: "Email" },
    DOB: { label: "Date of Birth" },
    // Add more columns as needed
  },
  order: ["fName", "lName", "gender", "phoneNumber", "email", "DOB"], // Order of columns to display
  // You can add additional configuration options as needed
};

export const orderTableConfig = {
  columns: {
    orderId: {
      label: "Order ID",
      render: (value) => <span>{value}</span>,
    },
    totalAmount: {
      label: "Total Amount (KES)",
      render: (value) => <span>KES {value}</span>,
    },
    totalQuantity: {
      label: "Total Quantity",
      render: (value) => <span>{value}</span>,
    },
    status: {
      label: "Status",
      render: (value) => <span>{value}</span>,
    },
    deliverySlot: {
      label: "Delivery Slot",
      render: (value) => <span>{value}</span>,
    },
    branch: {
      label: "Branch",
      render: (value) => <span>{value.name}</span>,
    },
    user: {
      label: "Customer",
      render: (value) => <span>{`${value.fName} ${value.lName}`}</span>,
    },
  },
  order: [
    "orderId",
    "totalAmount",
    "totalQuantity",
    "status",
    "deliverySlot",
    "branch",
    "user",
  ],
};

// src/config/tablesConfig.js

export const logisticsTableConfig = {
  columns: {
    driver_name: {
      label: "Driver Name",
      render: (value) => <span>{value}</span>, // Render driver name directly
    },
    vehicle_type: {
      label: "Vehicle Type",
      render: (value) => {
        const icons = {
          Truck: <Truck />,
          Bike: <Bike />,
          Van: <Car />,
        };
        return (
          <div className="flex items-center">
            {icons[value] || <span>{value}</span>}
            <span className="ml-2">{value}</span>
          </div>
        );
      },
    },
    driver_photo: {
      label: "Driver Photo",
      render: (value) => (
        <img src={value} alt="Driver" className="w-12 h-12 rounded-full" />
      ),
    },
    vehicle_registration_number: {
      label: "Vehicle Registration",
      render: (value) => <span>{value}</span>, // Render vehicle registration directly
    },
  },
  order: [
    "driver_photo",
    "driver_name",
    "vehicle_type",
    "vehicle_registration_number",
  ], // Specify the order of columns, including the new one
};

export const categoriesTableConfig = {
  columns: {
    imageUrl: {
      label: "Image",
      render: (value) => {
        return value
          ? React.createElement("img", {
              src: value,
              alt: "Category Image",
              style: { width: "50px", height: "50px", borderRadius: "20px" },
            })
          : null;
      },
    },
    name: {
      label: "Category Name",
    },
    description: {
      label: "Description",
      render: (value) => {
        const trimmedDescription =
          value?.length > 20 ? value.substring(0, 20) + "..." : value;
        return <span>{trimmedDescription}</span>;
      },
    },
    parent: {
      label: "Parent Category",
      render: (value, row) => {
        // Assuming `parent` is populated with the parent category's name
        return value ? value.name : "None";
      },
    },
    createdAt: {
      label: "Created At",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    updatedAt: {
      label: "Updated At",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  },
  order: [
    "imageUrl",
    "name",
    "description",
    "parent",
    "createdAt",
    "updatedAt",
  ],
};
