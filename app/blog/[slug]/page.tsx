import { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

// Function to fetch blog post data
async function fetchBlogPost(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${apiUrl}/api/blog/slug/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.blog; // Extract blog object from response
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}

// Dynamic metadata function
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  return {
    title: post.meta.meta_title,
    description: post.meta.meta_description,
    openGraph: {
      title: post.meta.meta_title,
      description: post.meta.meta_description,
      images: [post.mainImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
