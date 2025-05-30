import { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

// Function to fetch blog post data
async function fetchBlogPost(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${apiUrl}/api/blog/slug/${slug}`, {
      cache: 'no-store'
    });
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

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Dynamic metadata function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await fetchBlogPost(params.slug);
    return {
      title: post.meta?.meta_title || post.title,
      description: post.meta?.meta_description || post.description,
      openGraph: {
        title: post.meta?.meta_title || post.title,
        description: post.meta?.meta_description || post.description,
        images: post.mainImage ? [post.mainImage] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post',
    };
  }
}

export default async function BlogPostPage(props: Props) {
  const slug = props.params.slug;
  return <BlogPostClient slug={slug} />;
}
