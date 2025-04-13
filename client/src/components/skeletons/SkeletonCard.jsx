import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col justify-between w-[170px] sm:w-[180px] h-[330px] px-2 py-2 animate-pulse">
      <div className="flex-1 flex flex-col">
        <div className="h-[150px] w-[170px] bg-gray-200"></div>
        <div className="py-1 mt-2 font-bold">
          <div className="bg-gray-200 h-5 w-full rounded"></div>
        </div>
        <div className="py-1 flex items-start justify-start">
          <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
        </div>
        <div className="py-1">
          <div className="bg-gray-200 h-4 w-3/5 rounded"></div>
        </div>
        <div className="py-1">
          <div className="bg-gray-200 h-5 w-2/5 rounded"></div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center mt-1">
        <div className="bg-gray-200 h-10 w-32 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
