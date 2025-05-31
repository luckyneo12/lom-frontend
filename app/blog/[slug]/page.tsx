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
    return data.blog; // Extract blog object from response
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}

type Props = {
  params: Promise<{ slug: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

// Viewport configuration
export async function generateViewport(): Promise<Viewport> {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ffffff',
    viewportFit: 'cover'
  };
}

// Dynamic metadata function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const post = await fetchBlogPost(resolvedParams.slug);
    return {
      title: post.meta?.meta_title || post.title,
      description: post.meta?.meta_description || post.description,
      openGraph: {
        title: post.meta?.meta_title || post.title,
        description: post.meta?.meta_description || post.description,
        images: post.mainImage ? [post.mainImage] : [],
      },
      robots: {
        index: true,
        follow: true
      }
    };
  } catch (error) {
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
  const resolvedParams = await params;
  const post = await fetchBlogPost(resolvedParams.slug);
  return <BlogPostClient slug={resolvedParams.slug} post={post} />;
}
