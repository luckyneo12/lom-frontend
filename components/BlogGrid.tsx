"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaRegClock, FaRegCalendarAlt, FaNewspaper } from 'react-icons/fa';
import { useToast } from '@/components/ui/use-toast';

// Define types for blog data
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
  tags: string[];
  createdAt: string;
  readTime: string;
}

interface BlogGridProps {
  blogs: Blog[];
  categoryName?: string;
  isCategoryPage?: boolean;
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogs, categoryName, isCategoryPage = false }) => {
  const [visibleBlogs, setVisibleBlogs] = useState(18);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

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

  const loadMoreBlogs = () => {
    try {
      setVisibleBlogs((prev) => prev + 4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more blogs");
    }
  };

  // Featured blogs (first 2)
  const featuredBlogs = blogs.slice(0, 2);
  
  // Other blogs
  const otherBlogs = blogs.slice(2, visibleBlogs);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {!isCategoryPage && (
        <>
          <h1 className="text-3xl font-bold text-center mt-6 mb-2">Latest Articles</h1>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Explore our collection of insightful articles, expert opinions, and industry trends.
          </p>
        </>
      )}

      {/* Featured Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {featuredBlogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog._id}>
            <div className="relative rounded-xl overflow-hidden cursor-pointer group h-[400px]">
              {blog.mainImage ? (
                <img
                  src={blog.mainImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <FaNewspaper className="w-16 h-16 text-white opacity-80" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                <div className="flex gap-2 mb-2">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-semibold line-clamp-2">{blog.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <FaRegCalendarAlt />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaRegClock />
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {otherBlogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog._id}>
            <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group h-[300px] flex flex-col">
              <div className="relative h-40 w-full">
                {blog.mainImage ? (
                  <img 
                    src={blog.mainImage} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <FaNewspaper className="w-12 h-12 text-white opacity-80" />
                  </div>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-2">
                  {blog.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-sm font-bold leading-tight line-clamp-2 flex-1">{blog.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaRegCalendarAlt />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaRegClock />
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {visibleBlogs < blogs.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMoreBlogs}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Load More
          </button>
        </div>
      )}

      {blogs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {isCategoryPage 
              ? `No articles found in ${categoryName || 'this category'}`
              : 'No articles found.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogGrid; 