import { motion } from "framer-motion";
import { Sparkles, Tag } from "lucide-react";
export default function RelatedArticles({ relatedBlogs }) {
  return (
    relatedBlogs.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-12"
      >
        <div className="flex items-center mb-6">
          <Sparkles className="h-6 w-6 text-indigo-600 mr-3" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Related Articles
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {relatedBlogs.slice(0, 4).map((relatedBlog) => (
            <motion.div
              key={relatedBlog.id}
              whileHover={{ y: -5 }}
              className="rounded-card overflow-hidden shadow-card bg-backgroundColor-paper"
            >
              {relatedBlog.featured_image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={relatedBlog.featured_image}
                    alt={relatedBlog.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-purple-600 text-sm font-medium">
                      <Tag className="h-3 w-3" />
                      {relatedBlog.category.name}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600">
                  {relatedBlog.title}
                </h3>
                <p className="text-gray-600 flex-grow">{relatedBlog.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  );
}
