import React from 'react';

const SkeletonOrderSummary = () => {
  return (
    <div className="w-full lg:w-80 bg-gray-100 p-4 rounded-lg">
      <div className="h-4 bg-gray-300 mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-300 mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-300 mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-300 mb-4 animate-pulse"></div>
    </div>
  );
};

export default SkeletonOrderSummary;
