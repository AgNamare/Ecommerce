import SkeletonCard from "@/components/skeletons/SkeletonCard";
import React from "react";

const ProductGroupSkeleton = () => {
  return (
    <div className="flex justify-center gap-1">
      {/* Small screens: 2 items, Medium screens: 4 items, Large screens: 6 items */}
      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6">
        <SkeletonCard />
      </div>
      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6">
        <SkeletonCard />
      </div>
      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 hidden sm:block">
        <SkeletonCard />
      </div>
      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 hidden md:block">
        <SkeletonCard />
      </div>
      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 hidden lg:block">
        <SkeletonCard />
      </div>
      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 hidden lg:block">
        <SkeletonCard />
      </div>
    </div>
  );
};

export default ProductGroupSkeleton;
