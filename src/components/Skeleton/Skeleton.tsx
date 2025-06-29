import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${className}`}
      {...props}
    />
  );
};

export { Skeleton };