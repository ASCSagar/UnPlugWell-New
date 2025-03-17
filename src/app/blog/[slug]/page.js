import axios from "axios";
import ResponsiveBlogContainer from "@/components/BlogDetails/ResponsiveBlogContainer";

export const generateMetadata = async ({ params }) => {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    if (!slug) {
      return {
        title: "Blog",
        description: "Unplugwell Blog",
      };
    }
    const { data: blog } = await axios.get(
      `https://unplugwell.com/blog/api/post/${slug}/`
    );
    return {
      title: blog.meta_title,
      description: blog.meta_description,
      openGraph: {
        title: blog.meta_title,
        description: blog.meta_description,
        images: [
          {
            url: blog.featured_image,
            alt: blog.image_alt || blog.meta_title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.meta_title,
        description: blog.meta_description,
        images: [blog.featured_image],
      },
    };
  } catch (error) {
    console.log("error", error);
  }
};

export default async function BlogDetail({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug) {
    return <div>Blog not found</div>;
  }
  return <ResponsiveBlogContainer slug={slug} />;
}