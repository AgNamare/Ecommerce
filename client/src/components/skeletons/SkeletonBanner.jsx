import React from 'react';

const SkeletonBanner = () => {
  return (
    <div className="animate-pulse bg-gray-200 h-64 w-full rounded-md">
      <div className="bg-gray-300 h-full w-full rounded-md"></div>
    </div>
  );
};

export default SkeletonBanner;
