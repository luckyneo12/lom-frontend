"use client";

import React, { useState, useEffect } from "react";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

// Define Blog type
type Blog = {
  image: string;
  tag: string[];
  title: string;
  date: string;
  readTime: string;
  id: number;
};

// Blog data
const blogs: Blog[] = [
  {
    image: "/s1.jpeg",
    tag: ["Featured", "Marketing"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 1,
  },
  {
    image: "/s5.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 2,
  },
  {
    image: "/s3.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 3,
  },
  {
    image: "/s4.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 4,
  },
  {
    image: "/s2.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 5,
  },
  {
    image: "/v1.jpeg",
    tag: ["Featured", "Marketing"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 6,
  },
  {
    image: "/v4.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 7,
  },
  {
    image: "/s3.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 8,
  },
];

// BlogCard props type
type BlogCardProps = Blog;

const BlogCard: React.FC<BlogCardProps> = ({ image, tag, title, date, readTime, id }) => (
  <div className="space-y-4">
    <Link href={`/blog/${id}`}>
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </Link>

    <div className="flex gap-2 flex-wrap">
      {tag.map((t, i) => (
        <span key={i} className="bg-yellow-400 text-black text-xs font-bold py-1 px-2 rounded">
          {t}
        </span>
      ))}
    </div>

    <h3 className="text-sm font-semibold leading-tight">{title}</h3>
    <div className="flex items-center text-gray-500 text-xs space-x-2">
      <FaRegCalendarAlt />
      <span>{date}</span>
      <FaRegClock />
      <span>{readTime}</span>
    </div>
  </div>
);

type MarketingblogProps = {
  blogs: Blog[];
};

const Marketingblog: React.FC<MarketingblogProps> = ({ blogs }) => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  // Ensure blogs is an array
  const validBlogs = Array.isArray(blogs) ? blogs : [];

  // Get the first blog for featured section
  const featuredBlog = validBlogs[0];

  // Get next 3 blogs for side section
  const sideBlogs = validBlogs.slice(1, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Blog */}
        {featuredBlog && (
          <div className="lg:col-span-2">
            <Link href={`/blog/${featuredBlog.slug}`}>
              <div className="relative rounded-xl overflow-hidden cursor-pointer group">
                <img
                  src={featuredBlog.mainImage || '/placeholder-image.jpg'}
                  alt={featuredBlog.title}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    setError(`Failed to load image for blog: ${featuredBlog.title}`);
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6">
                  <div className="flex gap-2 mb-3">
                    {featuredBlog.tags?.map((tag, index) => (
                      <span key={index} className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold mb-2 line-clamp-2">{featuredBlog.title}</h2>
                  <p className="text-sm text-gray-200 line-clamp-2 mb-3">
                    {featuredBlog.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FaRegCalendarAlt />
                      {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRegClock />
                      {featuredBlog.readTime || '5 min read'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Side Blogs */}
        <div className="space-y-6">
          {sideBlogs.map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog._id}>
              <div className="flex gap-4 cursor-pointer group">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={blog.mainImage || '/placeholder-image.jpg'}
                    alt={blog.title}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      setError(`Failed to load image for blog: ${blog.title}`);
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    {blog.tags?.slice(0, 1).map((tag, index) => (
                      <span key={index} className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {blog.title}
                  </h3>
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
                      {blog.readTime || '5 min read'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {validBlogs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No marketing articles found.</p>
        </div>
      )}
    </div>
  );
};

export default Marketingblog;
