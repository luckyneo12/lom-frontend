"use client";

import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  mainImage?: string;
  createdAt: string;
  readTime?: string;
  featured?: boolean;
}

const SearchSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo image URL
  const demoImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop";

  // Function to truncate text to 25 words
  const truncateText = (text: string, wordLimit: number = 25) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/blog`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        
        // Handle both array and object response formats
        const postsArray = Array.isArray(data) ? data : data.blogs || [];
        
        // Get random 3 posts
        const randomPosts = postsArray
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        setPosts(randomPosts);
      } catch (error) {
        console.error("Error fetching random posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPosts();
  }, []);

  if (loading) {
    return (
      <main className="px-4 md:px-10 py-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-[500px] md:col-span-2 rounded-lg bg-gray-200 animate-pulse"></div>
          <div className="flex flex-col gap-6">
            <div className="h-[240px] rounded-lg bg-gray-200 animate-pulse"></div>
            <div className="h-[240px] rounded-lg bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </main>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <main className="px-4 md:px-10 py-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Big Card */}
        <Link
          href={`/blog/${posts[0].slug}`}
          className="relative h-[500px] md:col-span-2 rounded-lg overflow-hidden group"
        >
          <img
            src={posts[0].mainImage || demoImage}
            alt={posts[0].title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          {/* Badge */}
          {posts[0].featured && (
            <div className="absolute top-3 left-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
              Featured Post
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{posts[0].title}</h1>
            <p className="text-gray-200 text-sm mb-5">{truncateText(posts[0].description || '')}</p>
            <div className="flex items-center text-xs gap-4 text-gray-200">
              <div className="flex items-center gap-1">
                <FaRegCalendarAlt />
                <span>{new Date(posts[0].createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaRegClock />
                <span>{posts[0].readTime || '5 Min read'}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Right Two Small Cards */}
        <div className="flex flex-col gap-6">
          {posts.slice(1).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="relative h-[240px] rounded-lg overflow-hidden group"
            >
              <img
                src={post.mainImage || demoImage}
                alt={post.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>

              {/* Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <p className="text-sm text-gray-200 mb-2">{truncateText(post.description || '')}</p>
                <div className="flex items-center text-xs gap-4 text-gray-200">
                  <div className="flex items-center gap-1">
                    <FaRegCalendarAlt />
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaRegClock />
                    <span>{post.readTime || '5 Min read'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SearchSection;
