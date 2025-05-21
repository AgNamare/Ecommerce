// Sidebar.js
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/quickmart.png";
import {
  Home,
  Users,
  Box,
  Truck,
  Grid,
  Settings,
  FileText,
  ShoppingCart,
  CircleUserIcon, // Import the ShoppingCart icon
} from "lucide-react"; // Import desired icons
import { useSelector } from "react-redux";
import { useGetOrders } from "@/api/OrdersApi";

const Sidebar = () => {
  const { admin } = useSelector((state) => state.admin);
  console.log(admin);
  const [expressOrders, setExpressOrders] = useState(0);
  const [pickupOrders, setPickupOrders] = useState(0);
  const [normalOrders, setNormalOrders] = useState(0);

  const [isLoadingExpress, setIsLoadingExpress] = useState(true);
  const [isLoadingPickup, setIsLoadingPickup] = useState(true);
  const [isLoadingNormal, setIsLoadingNormal] = useState(true);

  const { orders: expressData, isLoading: loadingExpress } = useGetOrders({
    searchQuery: "",
    page: 1,
    sortOption: "createdAt",
    deliverySlot: "",
    status: "paid",
    method: "express",
    startDate: "",
    endDate: "",
  });

  const { orders: pickupData, isLoading: loadingPickup } = useGetOrders({
    searchQuery: "",
    page: 1,
    sortOption: "createdAt",
    deliverySlot: "",
    status: "paid",
    method: "pick-up",
    startDate: "",
    endDate: "",
  });

  const { orders: normalData, isLoading: loadingNormal } = useGetOrders({
    searchQuery: "",
    page: 1,
    sortOption: "createdAt",
    deliverySlot: "",
    status: "paid",
    method: "normal",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    setIsLoadingExpress(loadingExpress);
    setIsLoadingPickup(loadingPickup);
    setIsLoadingNormal(loadingNormal);

    if (expressData) setExpressOrders(expressData.metadata.totalCount);
    if (pickupData) setPickupOrders(pickupData.metadata.totalCount);
    if (normalData) setNormalOrders(normalData.metadata.totalCount);
  }, [
    expressData,
    pickupData,
    normalData,
    loadingExpress,
    loadingPickup,
    loadingNormal,
  ]);

  return (
    <div className="w-52 h-screen bg-white border br-2 pt-4 flex flex-col justify-between py-3">
      <div className="">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="w-[40%] mx-auto " />
        </NavLink>
        <ul className="mt-1 py-3">
          <li className="py-0.5">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center w-full text-left cursor-pointer text-primary ${
                  isActive
                    ? "bg-primary bg-opacity-30 border-r-4 border-primary"
                    : ""
                } hover:bg-primary hover:bg-opacity-30 py-2 px-4`
              }
            >
              <Home className="mr-2" size={18} /> {/* Add icon here */}
              Dashboard
            </NavLink>
          </li>
          <li className="py-0.5">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center w-full text-left cursor-pointer text-primary ${
                  isActive
                    ? "bg-primary bg-opacity-30 border-r-4 border-primary"
                    : ""
                } hover:bg-primary hover:bg-opacity-30 py-2 px-4`
              }
            >
              <Users className="mr-2" size={18} />
              Users
            </NavLink>
          </li>
          <li className="py-0.5">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center w-full text-left cursor-pointer text-primary ${
                  isActive
                    ? "bg-primary bg-opacity-30 border-r-4 border-primary"
                    : ""
                } hover:bg-primary hover:bg-opacity-30 py-2 px-4`
              }
            >
              <Box className="mr-2" size={18} />
              Products
            </NavLink>
          </li>
          <li className="py-0.5">
            <NavLink
              to="/logistics"
              className={({ isActive }) =>
                `flex items-center w-full text-left cursor-pointer text-primary ${
                  isActive
                    ? "bg-primary bg-opacity-30 border-r-4 border-primary"
                    : ""
                } hover:bg-primary hover:bg-opacity-30 py-2 px-4`
              }
            >
              <Truck className="mr-2" size={18} />
              Logistics
            </NavLink>
          </li>
          <li className="py-0.5">
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `flex items-center w-full text-left cursor-pointer text-primary ${
                  isActive
                    ? "bg-primary bg-opacity-30 border-r-4 border-primary"
                    : ""
                } hover:bg-primary hover:bg-opacity-30 py-2 px-4`
              }
            >
              <Grid className="mr-2" size={18} />
              Categories
            </NavLink>
          </li>
          <li className="py-0.5">
            <NavLink
              to="/orders" // Set the route for orders
              className={({ isActive }) =>
                `flex items-center block w-full text-left cursor-pointer text-primary ${
                  isActive
                    ? "bg-primary bg-opacity-30 border-r-4 border-primary"
                    : ""
                } hover:bg-primary hover:bg-opacity-30 py-2 px-4`
              }
            >
              <ShoppingCart className="mr-2" size={18} />{" "}
              {/* Add icon for orders */}
              Orders
            </NavLink>
          </li>
          <li className="py-0.5">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center block w-full text-left cursor-pointer text-primary ${
                  isActive
                    ? "bg-primary bg-opacity-30 border-r-4 border-primary"
                    : ""
                } hover:bg-primary hover:bg-opacity-30 py-2 px-4`
              }
            >
              <Settings className="mr-2" size={18} />
              Settings
            </NavLink>
          </li>
          <li className="py-0.5">
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center block w-full text-left cursor-pointer text-primary ${
                  isActive
                    ? "bg-primary bg-opacity-30 border-r-4 border-primary"
                    : ""
                } hover:bg-primary hover:bg-opacity-30 py-2 px-4`
              }
            >
              <FileText className="mr-2" size={18} />
              Reports
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="">
        <div className="text-gray-400 py-4 px-4">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <ul className="text-sm mt-2">
            <li>
              <p>
                Express Orders{" "}
                {isLoadingExpress ? "(Loading...)" : `(${expressOrders})`}
              </p>
            </li>
            <li>
              <p>
                Pick-Up Orders{" "}
                {isLoadingPickup ? "(Loading...)" : `(${pickupOrders})`}
              </p>
            </li>
            <li>
              <p>
                Normal Orders{" "}
                {isLoadingNormal ? "(Loading...)" : `(${normalOrders})`}
              </p>
            </li>
          </ul>
        </div>
        <div className="text-primary flex items-center gap-2 ml-1  ">
          <CircleUserIcon size={32} />
          <div className="flex flex-col">
            <p className="text-sm">
              {admin.firstName} {admin.lastName}
            </p>
            <span className="text-gray-500 text-xs">{admin.branch.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
