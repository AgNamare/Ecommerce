import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-gray-500 min-h-screen">
      {/* Fixed Sidebar */}
      <div className="w-52 h-screen  text-white fixed">
        <Sidebar />
      </div>
      <div className="min-h-screen flex-1 ml-52 p-4 bg-white ">
        {" "}
        {/* Content area styling */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
