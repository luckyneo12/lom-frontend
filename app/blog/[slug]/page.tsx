import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Metadata generation function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${params.slug}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    );
    
    if (!response.ok) {
      return {
        title: 'Blog Post Not Found',
        description: 'The blog post you\'re looking for doesn\'t exist or has been removed.'
      };
    }
    
    const data = await response.json();
    const post = data.blog;
    
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.slug}`;
    
    // Format dates
    const publishedDate = new Date(post.createdAt).toISOString();
    const modifiedDate = new Date(post.updatedAt || post.createdAt).toISOString();
    
    // Prepare meta title and description
    const metaTitle = post.meta?.meta_title || post.title || 'Blog Post';
    const metaDescription = post.meta?.meta_description || post.description || '';
    const metaKeywords = post.meta?.meta_keywords?.join(', ') || '';
    
    return {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords,
      authors: [{ name: post.author?.name || 'Legend Of Marketing' }],
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: canonicalUrl,
        siteName: 'Legend Of Marketing',
        locale: 'en_US',
        type: 'article',
        images: post.mainImage ? [
          {
            url: post.mainImage,
            width: 1200,
            height: 630,
            alt: post.title
          }
        ] : [],
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: post.mainImage ? [post.mainImage] : [],
        creator: '@legendofmktg',
        site: '@legendofmktg',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'article:published_time': publishedDate,
        'article:modified_time': modifiedDate,
        'article:section': post.category?.name || 'Marketing',
        'article:tag': metaKeywords,
      },
    };
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while loading the blog post.'
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  return <BlogPostClient slug={params.slug} />;
} 