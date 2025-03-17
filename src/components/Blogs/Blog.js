"use client";
import { useEffect, useState } from "react";
import { Search, Tag, Clock, BookCheck, ChevronDown, Filter, X, Sparkles, ChevronRight, Heart, BookOpen, Bookmark } from "lucide-react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [featuredBlog, setFeaturedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `https://unplugwell.com/blog/api/posts/?site_domain=unplugwell.com&page=${page}`
        );
        
        if (page === 1) {
          // Set the first blog as featured if available
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

    // Apply sorting
    if (sortBy === "newest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      );
    } else if (sortBy === "oldest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.published_at) - new Date(b.published_at)
      );
    } else if (sortBy === "reading_time") {
      filtered = [...filtered].sort(
        (a, b) => a.estimated_reading_time - b.estimated_reading_time
      );
    }

    setFilteredBlogs(filtered);
  }, [selectedCategory, searchQuery, blogs, sortBy]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("newest");
    setIsFilterOpen(false);
  };

  return (
    <main className="pt-16 min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      {/* Hero Section with parallax effect */}
      <section className="relative py-16 md:py-28 overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div 
          className="absolute -inset-x-0 top-0 h-40 bg-[url('/pattern-light.svg')] opacity-10"
          style={{
            backgroundSize: '24px',
            transform: 'translateY(-50%) rotate(180deg)'
          }}
        />
        <div 
          className="absolute -inset-x-0 bottom-0 h-40 bg-[url('/pattern-light.svg')] opacity-10"
          style={{
            backgroundSize: '24px',
            transform: 'translateY(50%)'
          }}
        />
        
        <div className="relative container mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">Blog</span>
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
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
              
              <div className="flex justify-center gap-4 mt-6">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </motion.button>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex p-1 rounded-full bg-white/10 border border-white/20"
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-1 rounded-full text-sm ${viewMode === "grid" ? "bg-white text-purple-900" : "text-white"} transition-all duration-300`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-1 rounded-full text-sm ${viewMode === "list" ? "bg-white text-purple-900" : "text-white"} transition-all duration-300`}
                  >
                    List
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Categories Bar - sticky on scroll */}
      <section className="sticky top-16 z-20 bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-700"
              >
                <Filter className="h-5 w-5" />
              </button>
              
              <div className="relative w-full md:w-auto">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full md:w-auto flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-purple-600" />
                    <span>{selectedCategory}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-30 max-h-80 overflow-y-auto"
                    >
                      <div className="p-2 space-y-1">
                        {categories.map((category, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left rounded-lg text-sm font-medium transition-all duration-300 ${
                              selectedCategory === category
                                ? "bg-purple-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="hidden md:flex flex-wrap items-center gap-2 overflow-x-auto py-1 max-w-3xl">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/25"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="reading_time">Reading Time</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-30"
              onClick={() => setIsFilterOpen(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-40 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedCategory(category)}
                          className={`block w-full px-4 py-2 text-left rounded-lg text-sm font-medium transition-all duration-300 ${
                            selectedCategory === category
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
                    <div className="space-y-2">
                      {["newest", "oldest", "reading_time"].map((option) => (
                        <button
                          key={option}
                          onClick={() => setSortBy(option)}
                          className={`block w-full px-4 py-2 text-left rounded-lg text-sm font-medium transition-all duration-300 ${
                            sortBy === option
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {option === "newest" && "Newest First"}
                          {option === "oldest" && "Oldest First"}
                          {option === "reading_time" && "Reading Time"}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">View Mode</h4>
                    <div className="flex p-1 rounded-lg bg-gray-100 w-full">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          viewMode === "grid"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-700"
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          viewMode === "list"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-700"
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 px-4 py-3 rounded-lg bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

       {/* Quick Categories Section */}
 {/* <section className="container mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.filter(cat => cat !== "All").slice(0, 8).map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -5 }}
              onClick={() => {
                setSelectedCategory(category);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{category}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {filteredBlogs.filter(blog => blog.category.name === category).length} articles
              </p>
            </motion.button>
          ))}
        </div>
      </section> */}
      
      {/* Featured Blog */}
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
      




      {/* Main Blog Listing */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            {searchQuery ? `Search Results for "${searchQuery}"` : 
             selectedCategory !== "All" ? `${selectedCategory} Articles` : 
             "All Articles"}
          </h2>
          
          <div className="text-sm text-gray-600">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
          </div>
        </div>
        
        {loading ? (
          // Skeleton loading state
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg ${viewMode === "list" ? "flex flex-col md:flex-row" : ""}`}
              >
                <div className={`relative ${viewMode === "list" ? "md:w-1/3 h-48" : "h-48"} bg-gray-200 animate-pulse`}></div>
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
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {filteredBlogs.map((blog, index) => (
                <Link key={index} href={`/blog/${blog.slug}`}>
                  <motion.article 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className={`h-full flex flex-col ${viewMode === "list" ? "md:flex-row" : ""} bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group`}
                  >
                    <div className={`relative ${viewMode === "list" ? "md:w-1/3" : ""} h-48`}>
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
                      
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-gray-700 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-gray-700 hover:text-purple-600 transition-colors">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className={`p-6 flex flex-col flex-1 ${viewMode === "list" ? "md:w-2/3" : ""}`}>
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
                            {moment(blog.published_at).startOf("hour").fromNow()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
            
            {/* Load More Button */}
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
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
      
      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16 mt-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter to receive the latest articles and digital wellness tips directly in your inbox.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </section>
      
     
    </main>
  );
}