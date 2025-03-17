export const metadata = {
  title: "UnplugWell: Your Guide to Mindful Digital Detox and Wellness",
  description:
    "Discover the benefits of digital detox with UnplugWell. Explore expert tips, resources, and strategies to disconnect, recharge, and find balance in a tech-driven world.",
};

import Hero from "@/components/Hero/Hero";
import TrendingBlogs from "@/components/TrendingBlogs/TrendingBlogs";
import LatestBlogs from "@/components/LatestBlogs/LatestBlogs";
import NewsLetter from "@/components/NewsLetter/NewsLetter";

export default function Home() {
  return (
    <div className="blob-container">
      <Hero />
      <TrendingBlogs />
      <LatestBlogs />
      <NewsLetter />
    </div>
  );
}
