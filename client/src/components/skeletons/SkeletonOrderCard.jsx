import React from "react";

const SkeletonOrderCard = () => {
  return (
    <div className="border px-2 md:px-4 h-[180px] bg-white mt-1 py-2 animate-pulse">
      {/* Placeholder for Order ID and Status */}
      <div className="flex justify-between items-center mb-1">
        <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
      </div>

      {/* Placeholder for Branch, Delivery Slot, and Address */}
      <div className="flex justify-between flex-wrap gap-2 md:gap-4 w-full">
        <div className="flex items-center h-7 gap-2 py-1 md:py-2 bg-gray-100 rounded-full px-2 md:px-3">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="w-20 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center h-7 gap-2 py-1 md:py-2 bg-gray-100 rounded-full px-2 md:px-3">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="w-20 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center h-7 gap-2 py-1 md:py-2 bg-gray-100 rounded-full px-2 md:px-3">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Placeholder for Product Card */}
      <div className="h-20 bg-gray-100 rounded mt-2"></div>

      {/* Placeholder for View More/Less Button */}
      <div className="flex flex-wrap justify-between mt-2 items-center">
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
        <div className="w-24 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonOrderCard;
