"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Clock, Search } from "lucide-react";
import "swiper/css";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import moment from "moment";
import Link from "next/link";

export default function CategoriesBlogs({ slug }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (!slug) return;
      try {
        const response = await axios.get(
          `https://unplugwell.com/blog/api/posts-category/?site_domain=unplugwell.com&category_slug=${slug}`
        );
        setRelatedBlogs(response.data.results);
        setFilteredBlogs(response.data.results);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [slug]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = relatedBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(relatedBlogs);
    }
  }, [searchQuery, relatedBlogs]);

  return (
    <main className="py-12 min-h-screen bg-gradient-to-r from-indigo-50 to-pink-50">
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {slug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
              's Blogs
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Discover insights and strategies for maintaining digital wellness
              in today's connected world.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search blogs..."
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
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            modules={[Autoplay]}
            className="mySwiper"
          >
            {filteredBlogs.map((blog, index) => (
              <SwiperSlide key={index}>
                <Link href={`/blog/${blog.slug}`}>
                  <article className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48">
                      <img
                        src={blog.featured_image}
                        alt={blog.image_alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 flex-grow">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-3 my-3">
                        <div className="w-8 h-8 rounded-full border-2 border-purple-100 flex items-center justify-center bg-purple-100 text-purple-600 font-semibold">
                          {blog.author.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">
                            {blog.author.full_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {moment(blog.published_at).format("ll")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {moment(blog.published_at).startOf("hour").fromNow()}
                        </span>
                        <button className="text-purple-600">
                          Read More
                        </button>
                      </div>
                    </div>
                  </article>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-600">
            No Blogs Available.
          </div>
        )}
      </section>
    </main>
  );
}
