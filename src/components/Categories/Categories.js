"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Search, Folder } from "lucide-react";
import axios from "axios";
import Link from "next/link";

const gradientColors = [
  "from-pink-500 to-red-500",
  "from-green-400 to-green-700",
  "from-blue-500 to-indigo-600",
  "from-yellow-400 to-orange-500",
  "from-purple-500 to-purple-800",
  "from-teal-500 to-cyan-600",
];

export default function Categories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://unplugwell.com/blog/api/get-categories/?site=unplugwell.com"
        );
        setCategories(
          response.data.results.map((item, index) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            description: item.description,
            colorIndex: index % gradientColors.length,
          }))
        );
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="py-12 min-h-screen bg-gradient-to-r from-indigo-50 to-pink-50">
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Categories
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Discover focused content across various aspects of digital wellness
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-200" />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden bg-white rounded-2xl shadow-lg"
              >
                <div className="p-8 h-full min-h-[320px] flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gray-200 p-3 rounded-xl animate-pulse">
                      <div className="h-6 w-6"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-3/4"></div>
                  <div className="mt-auto">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category, index) => (
              <Link key={index} href={`/categories/${category.slug}`}>
                <div className="relative group overflow-hidden bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      gradientColors[category.colorIndex]
                    } opacity-90`}
                  />
                  <div className="relative p-8 h-full min-h-[320px] flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <Folder className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 mb-6">{category.description}</p>
                    <div className="mt-auto">
                      <div className="inline-flex items-center gap-2 text-white font-medium group/link">
                        Explore Category
                        <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div className="text-center text-gray-600">
              No Category Found.
            </div>
          </div>
        )}
      </section>
    </main>
  );
}