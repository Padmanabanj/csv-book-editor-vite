import React from "react";
import "./Skeleton.css";

export default function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-cell shimmer"></div>
          ))}
        </div>
      ))}
    </div>
  );
}
