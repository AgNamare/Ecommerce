import { Truck, CheckCircle, XCircle, Loader } from "lucide-react";
import React, { useState } from "react";

const OrderTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("pending");

  // Function to handle tab selection
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    onTabChange(tab); // Notify parent component of selected tab
  };

  return (
    <div className="bg-gray-100 border rounded-lg mt-3 p-1">
      <div className="flex h-8 ">
        <div
          className={`flex-1 flex text-xs justify-center p-2 rounded-full cursor-pointer ${
            activeTab === "pending" ? "bg-white" : ""
          }`}
          onClick={() => handleTabChange("pending")}
        >
          <div className="flex text-xs items-center gap-1 md:text-sm cursor-pointer">
            <Loader size={14} color="#b12e26" />
            <span className="">Pending</span>
          </div>
        </div>
        <div
          className={`flex-1 flex text-xs justify-center p-2 rounded-full cursor-pointer ${
            activeTab === "on-route" ? "bg-white" : ""
          }`}
          onClick={() => handleTabChange("on-route")}
        >
          <div className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
            <Truck size={14} color="#b12e26" />
            <span className="">Route</span>
          </div>
        </div>
        <div
          className={`flex-1 flex justify-center text-xs p-2 rounded-full cursor-pointer ${
            activeTab === "completed" ? "bg-white" : ""
          }`}
          onClick={() => handleTabChange("completed")}
        >
          <div className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
            <CheckCircle size={14} color="#b12e26" />
            <span className="">Completed</span>
          </div>
        </div>
        <div
          className={`flex-1 flex justify-center p-2 rounded-full cursor-pointer ${
            activeTab === "cancelled" ? "bg-white" : ""
          }`}
          onClick={() => handleTabChange("cancelled")}
        >
          <div className="flex items-center text-xs md:text-sm gap-2 cursor-pointer">
            <XCircle size={14} color="#b12e26" />
            <span className="">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTabs;
