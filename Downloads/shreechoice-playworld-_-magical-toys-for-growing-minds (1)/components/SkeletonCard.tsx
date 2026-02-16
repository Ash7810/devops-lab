
import React from 'react';

// This base class combines a gradient background with the shimmer animation from index.html.
const shimmerClass = "bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-shimmer bg-[length:2000px_100%]";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-3 border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="relative flex-shrink-0 mb-3">
        {/* Image Skeleton */}
        <div className={`aspect-square w-full rounded-2xl ${shimmerClass}`} />
      </div>
      
      {/* Info Section Skeleton */}
      <div className="flex flex-col flex-grow">
        {/* Title Skeleton */}
        <div className={`h-4 rounded w-3/4 mb-2 ${shimmerClass}`} />
        <div className={`h-4 rounded w-1/2 mb-auto ${shimmerClass}`} />
        
        {/* Price Skeleton */}
        <div className={`h-6 w-1/3 rounded mt-4 mb-2 ${shimmerClass}`} />
        
        {/* Rating Skeleton */}
        <div className={`h-3 w-1/4 rounded mb-3 ${shimmerClass}`} />
      </div>
      
      {/* Button Skeleton */}
      <div className="h-[60px] flex items-end">
          <div className={`h-10 w-full rounded-xl ${shimmerClass}`} />
      </div>
    </div>
  );
};