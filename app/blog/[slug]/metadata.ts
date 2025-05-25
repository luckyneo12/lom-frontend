import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
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
        description: 'The requested blog post could not be found.',
        robots: {
          index: false,
          follow: false,
        }
      };
    }
    
    const data = await response.json();
    const post = data.blog;
    
    // Calculate word count
    const totalContent = [
      post.title,
      post.description,
      ...(post.sections || []).map((section: { section_title: string; section_description: string; section_list?: string[] }) => 
        `${section.section_title} ${section.section_description} ${section.section_list?.join(' ') || ''}`
      )
    ].join(' ');
    const wordCount = totalContent.trim().split(/\s+/).length;
    
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.slug}`;
    
    // Format dates
    const publishedDate = new Date(post.createdAt).toISOString();
    const modifiedDate = new Date(post.updatedAt || post.createdAt).toISOString();
    
    // Prepare meta title and description
    const metaTitle = post.meta.meta_title || post.title;
    const metaDescription = post.meta.meta_description || post.description.substring(0, 160);
    const metaKeywords = post.meta.meta_keywords || post.tags;
    
    return {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords,
      authors: [{ name: post.author?.name || 'Legend of Marketing' }],
      publisher: 'Legend of Marketing',
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
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: canonicalUrl,
        siteName: 'Legend of Marketing',
        title: metaTitle,
        description: metaDescription,
        images: post.mainImage ? [
          {
            url: post.mainImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : undefined,
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        authors: [post.author?.name || 'Legend of Marketing'],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: post.mainImage ? [post.mainImage] : undefined,
        creator: '@legendofmktg',
        site: '@legendofmktg',
      },
      other: {
        'word-count': wordCount.toString(),
        'keywords': metaKeywords.join(', '),
        'author': post.author?.name || 'Legend of Marketing',
        'publisher': 'Legend of Marketing',
        'language': 'en',
        'revisit-after': '7 days',
        'distribution': 'global',
        'rating': 'general',
        'coverage': 'Worldwide',
        'target': 'all',
        'HandheldFriendly': 'true',
        'MobileOptimized': 'width',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black',
        'apple-mobile-web-app-title': metaTitle,
        'application-name': 'Legend of Marketing',
        'msapplication-TileColor': '#ffffff',
        'msapplication-TileImage': '/mstile-144x144.png',
        'theme-color': '#ffffff',
        'format-detection': 'telephone=no',
        'viewport': 'width=device-width, initial-scale=1',
      },
    };
  } catch (error) {
    return {
      title: 'Error Loading Blog Post',
      description: 'There was an error loading the blog post.',
      robots: {
        index: false,
        follow: false,
      }
    };
  }
} 