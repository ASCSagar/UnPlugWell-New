import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import moment from "moment";
import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";

export default function RelatedArticles({ relatedBlogs, loading }) {
  return (
    relatedBlogs.length > 0 && (
      <section className="bg-gradient-to-r from-indigo-50 to-pink-50 py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-indigo-600 mr-3" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Related Articles
              </h2>
            </div>
            <div className="hidden md:block">
              <Link
                href="/blog"
                className="px-5 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-indigo-600 font-medium"
              >
                View All
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : relatedBlogs.length > 0 ? (
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
              {relatedBlogs.map((blog, index) => (
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
                            {moment(blog.published_at)
                              .startOf("hour")
                              .fromNow()}
                          </span>
                          <button className="text-purple-600">Read More</button>
                        </div>
                      </div>
                    </article>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No Blogs Available.
            </div>
          )}
        </div>
      </section>
    )
  );
}
