import React from "react";
import { Bike, ShoppingBasket, Truck } from "lucide-react";

const DeliveryMethod = ({ activeMethod, onMethodChange }) => {
  // Function to handle tab selection
  const handleTabChange = (method) => {
    onMethodChange(method); // Notify parent component of selected method
  };

  console.log(activeMethod)

  const deliveryMethods = [
    {
      method: "normal",
      icon: <Truck className="text-lg sm:text-xl md:text-2xl" />,
      label: "Normal",
    },
    {
      method: "express",
      icon: <Bike className="text-lg sm:text-xl md:text-2xl" />,
      label: "Express",
    },
    {
      method: "pick-up",
      icon: <ShoppingBasket className="text-lg sm:text-xl md:text-2xl" />,
      label: "Pick Up",
    },
  ];

  return (
    <div className="bg-[#FAF0E660] border p-2 rounded-lg mt-3">
      <div className="flex">
        {deliveryMethods.map(({ method, icon, label }) => (
          <div
            key={method}
            className={`flex-1 flex justify-center p-3 rounded-lg cursor-pointer ${
              activeMethod === method ? "bg-white" : ""
            }`}
            onClick={() => handleTabChange(method)}
          >
            <label className="flex items-center cursor-pointer text-xs sm:text-sm md:text-base">
              <input
                type="radio"
                name="deliveryMethod"
                value={method}
                checked={activeMethod === method}
                onChange={() => handleTabChange(method)}
                className="sr-only"
              />
              {icon}
              <span className="ml-2">{label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryMethod;
