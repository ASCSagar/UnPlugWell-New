"use client";
import Link from "next/link";

const tickerStyles = `
  @keyframes ticker {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .animate-ticker {
    animation: ticker 30s linear infinite;
  }

  .animate-ticker:hover {
    animation-play-state: paused;
  }

  .title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    cursor: pointer;
    color: #4F46E5;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .title:hover {
    color: #EC4899;
  }
`;

export default function BlogTicker({ relatedBlogs }) {
  return (
    relatedBlogs.length > 0 && (
      <div className="bg-gradient-to-r from-indigo-50 to-pink-50 text-gray-800 py-2 overflow-hidden shadow-md">
        <style>{tickerStyles}</style>
        <div className="flex animate-ticker">
          {relatedBlogs.concat(relatedBlogs).map((blog, index) => (
            <div
              key={index}
              className="flex items-center mx-4 whitespace-nowrap"
            >
              <div className="w-10 h-10 rounded-md overflow-hidden shadow-sm">
                <img
                  src={blog.featured_image}
                  alt={blog.image_alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <Link href={blog.slug} className="ml-2 font-bold w-60 title">
                {blog.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  );
}