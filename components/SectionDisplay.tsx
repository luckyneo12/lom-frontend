"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegClock, FaRegCalendarAlt, FaNewspaper } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

interface Blog {
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
  blogs: Blog[];
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

const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => (
  <div className="group space-y-4">
    <Link href={`/blog/${blog.slug}`} className="block overflow-hidden rounded-lg">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={blog.mainImage || demoImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    </Link>

    <div className="flex gap-2 flex-wrap">
      {blog.tags?.map((tag, i) => (
        <span key={i} className="bg-yellow-400 text-black text-xs font-bold py-1 px-2 rounded">
          {tag}
        </span>
      ))}
    </div>

    <Link href={`/blog/${blog.slug}`} className="block">
      <h3 className="text-lg font-semibold leading-tight hover:text-yellow-500 transition-colors">
        {blog.title}
      </h3>
    </Link>

    <p className="text-gray-600 text-sm line-clamp-2">
      {truncateText(blog.description || '', 20)}
    </p>

    <div className="flex items-center text-gray-500 text-xs space-x-4">
      <div className="flex items-center space-x-1">
        <FaRegCalendarAlt className="w-3 h-3" />
        <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        })}</span>
      </div>
      <div className="flex items-center space-x-1">
        <FaRegClock className="w-3 h-3" />
        <span>{blog.readTime || '5 Min read'}</span>
      </div>
    </div>
  </div>
);

const SectionDisplay = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleBlogs, setVisibleBlogs] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  // Initialize visible blogs count for each section
  useEffect(() => {
    if (sections.length > 0) {
      const initialVisibleBlogs = sections.reduce((acc, section) => {
        acc[section._id] = 8; // Start with 8 blogs visible
        return acc;
      }, {} as { [key: string]: number });
      setVisibleBlogs(initialVisibleBlogs);
    }
  }, [sections]);

  const loadMoreBlogs = (sectionId: string) => {
    setVisibleBlogs(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] || 8) + 8
    }));
  };

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

        // Fetch blogs for each section
        const sectionsWithBlogs = await Promise.all(
          sortedSections.map(async (section: Section) => {
            try {
              // Fetch blogs for this specific section
              const blogsResponse = await fetch(
                `${apiUrl}/api/blog?section=${section._id}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );

              if (!blogsResponse.ok) {
                throw new Error(`Failed to fetch blogs for section ${section._id}`);
              }

              const blogsData = await blogsResponse.json();
              console.log(`Blogs for section ${section.title}:`, blogsData);

              // Transform blogs to include readTime
              const postsArray = Array.isArray(blogsData) ? blogsData : blogsData.blogs || [];
              const blogs = postsArray.map((blog: any) => ({
                ...blog,
                readTime: `${Math.ceil(blog.description.split(' ').length / 200)} min read`
              }));

              return {
                ...section,
                blogs
              };
            } catch (error) {
              console.error(`Error fetching blogs for section ${section._id}:`, error);
              return {
                ...section,
                blogs: []
              };
            }
          })
        );

        // Filter out sections with no blogs
        const validSections = sectionsWithBlogs.filter(section => section.blogs.length > 0);
        console.log('Valid Sections with Blogs:', validSections);

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
      {sections.map((section) => (
        <div key={section._id} className="mb-16 relative">
          {/* Left border */}
          <div className="absolute left-0 top-0 h-[calc(100%-2rem)] w-1 bg-yellow-500 rounded-full"></div>
          
          <div className="pl-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 relative inline-block">
                {section.title || 'Unnamed Section'}
                {/* Bottom border */}
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-500 rounded-full"></div>
              </h2>
             
            </div>

            {section.blogs && section.blogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {section.blogs.slice(0, visibleBlogs[section._id] || 8).map((blog) => (
                    <Link href={`/blog/${blog.slug}`} key={blog._id}>
                      <div className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col border border-gray-100">
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                          {blog.mainImage ? (
                            <img 
                              src={blog.mainImage} 
                              alt={blog.meta?.meta_title || blog.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center ${blog.mainImage ? 'hidden' : ''}`}>
                            <FaNewspaper className="w-12 h-12 text-white opacity-80" />
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {blog.tags?.slice(0, 2).map((tag, index) => (
                              <span key={index} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-lg font-bold leading-tight line-clamp-2 mb-3 group-hover:text-yellow-600 transition-colors">
                            {blog.meta?.meta_title || blog.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                            {blog.meta?.meta_description || blog.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
                            <span className="flex items-center gap-1">
                              <FaRegCalendarAlt className="w-3 h-3" />
                              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaRegClock className="w-3 h-3" />
                              {blog.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All button */}
                {section.blogs.length > (visibleBlogs[section._id] || 8) && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => loadMoreBlogs(section._id)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                    >
                      Load More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600">No blogs found in this section.</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionDisplay; 