import { Metadata } from 'next';
import BlogGrid from '@/components/BlogGrid';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoryName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${categoryName} - Articles`,
    description: `Discover the latest articles and insights about ${categoryName}`,
    openGraph: {
      title: `${categoryName} - Articles`,
      description: `Discover the latest articles and insights about ${categoryName}`,
      type: 'website',
      url: `/blog/category/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} - Articles`,
      description: `Discover the latest articles and insights about ${categoryName}`,
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <BlogGrid blogs={[]} categoryName={params.slug} isCategoryPage={true} />
    </main>
  );
} 