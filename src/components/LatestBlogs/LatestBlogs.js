"use client";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, Clock, Tag, ChevronDown } from "lucide-react";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://unplugwell.com/blog/api/posts-latest/?site_domain=unplugwell.com"
        );
        setBlogs(response.data.results);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://unplugwell.com/blog/api/get-categories/?site=unplugwell.com"
        );
        setCategories((prev) => [
          "All",
          ...response.data.results.map((category) => category.name),
        ]);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = blogs;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (blog) => blog.category.name === selectedCategory
      );
    }

    setFilteredBlogs(filtered);
  }, [selectedCategory, blogs]);

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-50 to-pink-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Latest Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our newest articles on digital wellness and mindful
            technology use
          </p>
        </div>
        <div className="md:hidden w-full py-4">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg"
          >
            <span>Categories</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isCategoryOpen && (
            <div className="mt-2 space-y-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        {categories.length > 1 ? (
          <div className="hidden md:flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <button
                key={category + index}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mb-12">
            No Categories Available.
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-2xl shadow-lg h-full flex flex-col"
              >
                <div className="relative h-64 bg-purple-100 animate-pulse"></div>
                <div className="p-6 bg-white flex flex-col flex-grow">
                  <div className="h-6 bg-purple-100 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-purple-100 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-purple-100 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-purple-100 rounded animate-pulse mb-4 w-2/3"></div>

                  <div className="flex items-center gap-3 mb-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-purple-100 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-purple-100 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-purple-100 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-purple-100 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-purple-100 rounded animate-pulse"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBlogs.map((blog, index) => (
              <Link key={index} href={`/blog/${blog.slug}`}>
                <article className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={blog.featured_image}
                      alt={blog.image_alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-purple-600 text-sm font-medium">
                        <Tag className="h-3 w-3" />
                        {blog.category.name}
                      </span>
                    </div>
                  </div>
                  <div className="relative p-6 bg-white flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-100 flex items-center justify-center bg-purple-100 text-purple-600 font-semibold">
                        {blog.author.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {blog.author.full_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {moment(blog.published_at).format("ll")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center justify-between text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {moment(blog.published_at).format("ll")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {moment(blog.published_at).startOf("hour").fromNow()}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No Blogs Available For The {selectedCategory}.
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogs;
