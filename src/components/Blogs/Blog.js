"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Tag,
  Clock,
  BookCheck,
  ChevronDown,
  X,
  Sparkles,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `https://unplugwell.com/blog/api/posts/?site_domain=unplugwell.com&page=${page}`
        );

        if (page === 1) {
          if (response.data.results.length > 0) {
            setFeaturedBlog(response.data.results[0]);
            setBlogs(response.data.results.slice(1));
          } else {
            setBlogs(response.data.results);
          }
        } else {
          setBlogs((prev) => [...prev, ...response.data.results]);
        }
        setHasMore(response.data.next !== null);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

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

    if (searchQuery) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBlogs(filtered);
  }, [selectedCategory, searchQuery, blogs]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <main className="py-12 min-h-screen bg-gradient-to-r from-indigo-50 to-pink-50">
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="absolute -inset-x-0 top-0 h-40 bg-[url('/pattern-light.svg')] opacity-10" />
        <div className="absolute -inset-x-0 bottom-0 h-40 bg-[url('/pattern-light.svg')] opacity-10" />
        <div className="relative container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Explore Our Blog
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Discover insights and strategies for maintaining digital wellness
              in today's connected world.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 md:py-5 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-200" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
              <div className="flex justify-center gap-4 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex p-1 rounded-full bg-white/10 border border-white/20"
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-1 rounded-full text-sm ${
                      viewMode === "grid"
                        ? "bg-white text-purple-900"
                        : "text-white"
                    } transition-all duration-300`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-1 rounded-full text-sm ${
                      viewMode === "list"
                        ? "bg-white text-purple-900"
                        : "text-white"
                    } transition-all duration-300`}
                  >
                    List
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="sticky top-16 z-10 bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="md:hidden w-full">
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
            <div className="hidden md:flex items-center gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {!searchQuery && selectedCategory === "All" && featuredBlog && (
        <section className="container mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Post</h2>
          </div>
          <Link href={`/blog/${featuredBlog.slug}`}>
            <motion.article
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <img
                    src={featuredBlog.featured_image}
                    alt={featuredBlog.image_alt || featuredBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-purple-600 text-sm font-medium">
                      <Tag className="h-3 w-3" />
                      {featuredBlog.category.name}
                    </span>
                  </div>
                </div>

                <div className="md:w-1/2 p-6 md:p-8 bg-white flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-purple-600">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-4 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredBlog.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full border-2 border-purple-100 flex items-center justify-center bg-purple-100 text-purple-600 font-semibold">
                        {featuredBlog.author.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {featuredBlog.author.full_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {moment(featuredBlog.published_at).format("ll")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <BookCheck className="h-4 w-4 text-pink-500" />
                        {featuredBlog.estimated_reading_time} min read
                      </span>

                      <button className="inline-flex items-center gap-1 px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium hover:bg-purple-200 transition-colors">
                        Read Article <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </Link>
        </section>
      )}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory !== "All"
              ? `${selectedCategory} Articles`
              : "All Articles"}
          </h2>

          <div className="text-sm text-gray-600">
            {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "article" : "articles"}
          </div>
        </div>

        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg ${
                  viewMode === "list" ? "flex flex-col md:flex-row" : ""
                }`}
              >
                <div
                  className={`relative ${
                    viewMode === "list" ? "md:w-1/3 h-48" : "h-48"
                  } bg-gray-200 animate-pulse`}
                ></div>
                <div className={`p-6 ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {[...Array(3)].map((_, tagIndex) => (
                      <div
                        key={tagIndex}
                        className="h-6 w-16 bg-gray-200 rounded-md animate-pulse"
                      ></div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-8"
              }
            >
              {filteredBlogs.map((blog, index) => (
                <Link key={index} href={`/blog/${blog.slug}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className={`h-full flex flex-col ${
                      viewMode === "list" ? "md:flex-row" : ""
                    } bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group`}
                  >
                    <div
                      className={`relative ${
                        viewMode === "list" ? "md:w-1/3 h-64" : "h-48" // Ensure image takes up one-third in list view
                      }`}
                    >
                      <img
                        src={blog.featured_image}
                        alt={blog.image_alt || blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-purple-600 text-sm font-medium">
                          <Tag className="h-3 w-3" />
                          {blog.category.name}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-6 flex flex-col flex-1 ${
                        viewMode === "list" ? "md:w-2/3" : ""
                      }`}
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {blog.title}
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-600"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-1 rounded-md text-sm text-gray-500">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center gap-3 mb-3">
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
                            <BookCheck className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
                            {blog.estimated_reading_time} min read
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            {moment(blog.published_at)
                              .startOf("hour")
                              .fromNow()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-12"
              >
                <button
                  onClick={loadMore}
                  className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden"
                >
                  <span className="relative z-10">Load More Articles</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Articles Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : `No articles available in the ${selectedCategory} category.`}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}
