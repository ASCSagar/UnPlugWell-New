"use client";
import BlogDetails from "./BlogDetails";
import MobileBlogDetails from "./MobileBlogDetails";

export default function ResponsiveBlogContainer({ slug }) {
  return (
    <div className="bg-backgroundColor-default">
      {/* Hidden on mobile (below md breakpoint), visible on larger screens */}
      <div className="hidden md:block">
        <BlogDetails slug={slug} />
      </div>
      
      {/* Visible on mobile, hidden on md and larger screens */}
      <div className="block md:hidden">
        <MobileBlogDetails slug={slug} />
      </div>
    </div>
  );
}