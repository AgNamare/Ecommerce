import React from "react";
import ProductGroupSkeleton from "./ProductGroupSkeleton";

const SkeletonProductPage = () => {
  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <div className="py-4">
        <nav aria-label="breadcrumb">
          <ol className="flex space-x-2 text-sm text-gray-500">
            <li className="flex items-center">
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
            </li>
            <span className="mx-2">/</span>
            <li className="flex items-center">
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
            </li>
            <span className="mx-2">/</span>
            <li className="flex items-center">
              <div className="w-24 h-4 bg-gray-300 rounded"></div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex w-fit gap-16">
        {/* Image Carousel Skeleton */}
        <div className="w-[400px]">
          <div className="h-[300px] bg-gray-300 rounded"></div>
        </div>

        {/* Product Details Skeleton */}
        <div className="flex flex-col gap-2 w-[50%]">
          <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-gray-300 rounded mb-4"></div>
          <div className="w-1/4 h-4 bg-gray-300 rounded mb-4"></div>

          {/* Quantity Dropdown Skeleton */}
          <div className="w-24 h-8 bg-gray-300 rounded mb-4"></div>

          <div className="flex gap-10 mt-4">
            <button
              type="button"
              className="flex text-white items-center justify-center rounded-3xl py-2 px-4 bg-gray-300 cursor-not-allowed"
            >
              <div className="w-20 h-4 bg-gray-300 rounded"></div>
            </button>
            <button
              type="button"
              className="flex text-white items-center justify-center rounded-3xl py-2 px-4 bg-gray-300 cursor-not-allowed"
            >
              <div className="w-20 h-4 bg-gray-300 rounded"></div>
            </button>
          </div>

          {/* Share Button Skeleton */}
          <div className="w-24 h-6 bg-gray-300 rounded mt-4"></div>
        </div>
      </div>

      {/* Best Sellers Carousel Skeleton */}
      <div className="mt-8 h-fit">
        <div className="w-1/2 h-6 bg-gray-300 rounded mb-4"></div>
        <ProductGroupSkeleton />
      </div>
    </div>
  );
};

export default SkeletonProductPage;
