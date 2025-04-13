import React from "react";

const SkeletonCartItems = () => {
  return (
    <div className="flex flex-col gap-2 lg:gap-8 w-full">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 font-semibold text-left">
                Product Details
              </th>
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4 font-semibold text-left">Quantity</th>
              <th className="py-2 px-4 font-semibold text-left">Price</th>
              <th className="py-2 px-4 font-semibold text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, index) => (
              <tr key={index} className="bg-gray-100">
                <td className="py-2 px-4">
                  <div className="w-[70px] h-[70px] bg-gray-300 animate-pulse"></div>
                </td>
                <td className="py-2 px-4">
                  <div className="w-32 h-4 bg-gray-300 animate-pulse"></div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonCartItems;
