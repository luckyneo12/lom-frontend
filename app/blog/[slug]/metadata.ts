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
        description: 'The blog post you\'re looking for doesn\'t exist or has been removed.'
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
      verification: {
        google: 'your-google-site-verification',
        yandex: 'your-yandex-verification',
        yahoo: 'your-yahoo-verification',
      },
      category: 'marketing',
      applicationName: 'Legend Of Marketing',
      generator: 'Tech Branzzo',
      creator: 'Tech Branzzo',
      publisher: 'Legend Of Marketing',
      formatDetection: {
        telephone: false,
        address: false,
        email: false,
      },
      other: {
        'word-count': wordCount.toString(),
        'keywords': metaKeywords,
        'author': post.author?.name || 'Legend Of Marketing',
        'publisher': 'Legend Of Marketing',
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
        'application-name': 'Legend Of Marketing',
        'msapplication-TileColor': '#ffffff',
        'msapplication-TileImage': '/mstile-144x144.png',
        'theme-color': '#ffffff',
        'format-detection': 'telephone=no',
        'viewport': 'width=device-width, initial-scale=1',
      },
    };
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while loading the blog post.'
    };
  }
} 