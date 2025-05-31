import { Metadata, Viewport } from "next";
import BlogPostClient from "./BlogPostClient";
import { notFound } from "next/navigation";

// Function to fetch blog post data
async function fetchBlogPost(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${apiUrl}/api/blog/slug/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch blog post: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.blog) {
      throw new Error('Blog post data is missing');
    }
    return data.blog;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  viewportFit: 'cover'
};

// Dynamic metadata function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await fetchBlogPost(params.slug);
    return {
      title: post.meta?.meta_title || post.title || 'Blog Post',
      description: post.meta?.meta_description || post.description || 'Read our latest blog post',
      openGraph: {
        title: post.meta?.meta_title || post.title || 'Blog Post',
        description: post.meta?.meta_description || post.description || 'Read our latest blog post',
        images: post.mainImage ? [post.mainImage] : [],
      },
      robots: {
        index: true,
        follow: true
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post',
      robots: {
        index: true,
        follow: true
      }
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  try {
    const post = await fetchBlogPost(params.slug);
    return <BlogPostClient slug={params.slug} post={post} />;
  } catch (error) {
    console.error("Error in BlogPostPage:", error);
    throw error;
  }
}
