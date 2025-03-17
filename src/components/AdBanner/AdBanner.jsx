"use client";
import AdUnit from "../AdUnit/AdUnit";

export default function AdBanner() {
  return (
    <div className="w-full sticky top-14 md:top-16 lg:top-20 z-20 flex justify-center py-2 bg-gray-50 border-b border-gray-100 shadow-sm">
      <AdUnit format="banner" />
    </div>
  );
}
