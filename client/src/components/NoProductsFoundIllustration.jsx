import React from "react";
import { Link } from "react-router-dom";
import NoProductsFound from "../assets/images/NoProductsFound.png";

const NoProductsFoundIllustration = () => {
  return (
    <div className="flex flex-col min-h-screen mt-4 items-center">
      <img src={NoProductsFound} className="w-[300px]" />

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-600">No Products Found</h2>
      <Link
        to="/"
        className="border border-primary border-1 px-4 py-2 mt-2 text-primary rounded-full"
      >
        Go Back To Homepage
      </Link>
    </div>
  );
};

export default NoProductsFoundIllustration;
