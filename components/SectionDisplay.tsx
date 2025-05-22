"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegClock, FaRegCalendarAlt, FaNewspaper } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  _id: string;
  slug: string;
  title: string;
  description: string;
  mainImage: string;
  status: "published" | "draft";
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  section: {
    _id: string;
    title: string;
  };
  meta: {
    meta_title: string;
    meta_description: string;
  };
  tags: string[];
  createdAt: string;
  readTime: string;
}

interface Section {
  _id: string;
  title: string;
  order: number;
  isActive: boolean;
  posts: Post[];
}

const demoImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop";

const truncateText = (text: string, wordLimit: number = 25) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const BlogCard: React.FC<{ post: Post }> = ({ post }) => (
  <div className="group space-y-4">
    <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-lg">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={post.mainImage || demoImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    </Link>

    <div className="flex gap-2 flex-wrap">
      {post.tags?.map((tag, i) => (
        <span key={i} className="bg-yellow-400 text-black text-xs font-bold py-1 px-2 rounded">
          {tag}
        </span>
      ))}
    </div>

    <Link href={`/blog/${post.slug}`} className="block">
      <h3 className="text-lg font-semibold leading-tight hover:text-yellow-500 transition-colors">
        {post.title}
      </h3>
    </Link>

    <p className="text-gray-600 text-sm line-clamp-2">
      {truncateText(post.description || '', 20)}
    </p>

    <div className="flex items-center text-gray-500 text-xs space-x-4">
      <div className="flex items-center space-x-1">
        <FaRegCalendarAlt className="w-3 h-3" />
        <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        })}</span>
      </div>
      <div className="flex items-center space-x-1">
        <FaRegClock className="w-3 h-3" />
        <span>{post.readTime || '5 Min read'}</span>
      </div>
    </div>
  </div>
);

const SectionDisplay = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Add placeholder image constant
  const PLACEHOLDER_IMAGE = '/placeholder.jpg';

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        
        // Fetch sections
        const sectionsResponse = await fetch(`${apiUrl}/api/sections`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!sectionsResponse.ok) {
          throw new Error('Failed to fetch sections');
        }

        const sectionsData = await sectionsResponse.json();
        console.log('Raw Sections Data:', sectionsData);

        // Sort sections by order
        const sortedSections = sectionsData.sort((a: Section, b: Section) => a.order - b.order);
        console.log('Sorted Sections:', sortedSections);

        // Fetch posts for each section
        const sectionsWithPosts = await Promise.all(
          sortedSections.map(async (section: Section) => {
            try {
              const postsResponse = await fetch(
                `${apiUrl}/api/blog?section=${section._id}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );

              if (!postsResponse.ok) {
                throw new Error(`Failed to fetch posts for section ${section._id}`);
              }

              const postsData = await postsResponse.json();
              console.log(`Posts for section ${section.title}:`, postsData);

              // Transform posts to include readTime
              const transformedPosts = Array.isArray(postsData) ? postsData : postsData.posts || [];
              const posts = transformedPosts.map((post: any) => ({
                ...post,
                readTime: `${Math.ceil(post.description.split(' ').length / 200)} min read`
              }));

              return {
                ...section,
                posts
              };
            } catch (error) {
              console.error(`Error fetching posts for section ${section._id}:`, error);
              return {
                ...section,
                posts: []
              };
            }
          })
        );

        // Filter out sections with no posts
        const validSections = sectionsWithPosts.filter(section => section.posts.length > 0);
        console.log('Valid Sections with Posts:', validSections);

        setSections(validSections);
      } catch (error) {
        console.error('Error fetching sections:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch sections');
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        duration: 5000,
      });
      setError(null);
    }
  }, [error, toast]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-4">
                    <div className="h-48 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">No sections found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {sections.map((section) => {
        // Filter blogs for this section
        const sectionBlogs = section.posts.filter(post => post.section && post.section._id === section._id);
        
        return (
          <div key={section._id} className="mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 flex items-center gap-2 text-gray-800">
              <span className="h-10 w-1 bg-yellow-500 inline-block rounded-full"></span>
              <span className="border-b-2 border-yellow-500 pb-2">
                {section.title || 'Unnamed Section'}
              </span>
            </h2>

            {sectionBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sectionBlogs.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post._id}>
                    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group h-full flex flex-col">
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        {post.mainImage ? (
                          <img 
                            src={post.mainImage} 
                            alt={post.meta?.meta_title || post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center ${post.mainImage ? 'hidden' : ''}`}>
                          <FaNewspaper className="w-12 h-12 text-white opacity-80" />
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.tags?.slice(0, 2).map((tag, index) => (
                            <span key={index} className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-base font-bold leading-tight line-clamp-2 mb-2">
                          {post.meta?.meta_title || post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                          {post.meta?.meta_description || post.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
                          <span className="flex items-center gap-1">
                            <FaRegCalendarAlt />
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegClock />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No blogs found in this section.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SectionDisplay; 