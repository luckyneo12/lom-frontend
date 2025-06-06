"use client";
import { useState, useEffect } from "react";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";
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
  tags: string[];
  createdAt: string;
  readTime: string;
}

const BlogSection = () => {
  const [blogs, setBlogs] = useState<{ featuredPost?: Blog; sidePosts: Blog[]; textPosts: Blog[] }>({ sidePosts: [], textPosts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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

  const fetchLatestBlogs = async (pageNum: number) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/blog?page=${pageNum}&limit=10&sort=-createdAt`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to fetch latest blogs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle both array and object response formats
      let blogsArray = [];
      if (Array.isArray(data)) {
        blogsArray = data;
      } else if (data && typeof data === 'object') {
        blogsArray = data.blogs || data.posts || data.data || [];
      }

      // Sort blogs by creation date in descending order
      blogsArray.sort((a: Blog, b: Blog) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Skip first 3 blogs
      const remainingBlogs = blogsArray.slice(3);

      // Check if we have more blogs to load
      setHasMore(remainingBlogs.length === 10);

      // Transform the data to include readTime
      const transformedBlogs = remainingBlogs
        .map((blog: any) => ({
          ...blog,
          readTime: `${Math.ceil(blog.description.split(' ').length / 200)} min read`
        }));

      // Separate blogs with and without images
      const blogsWithImages = transformedBlogs.filter((blog: Blog) => blog.mainImage);
      const blogsWithoutImages = transformedBlogs.filter((blog: Blog) => !blog.mainImage);

      // Get featured and side posts from blogs with images
      const featuredPost = pageNum === 1 ? blogsWithImages[0] : undefined;
      const sidePosts = pageNum === 1 ? blogsWithImages.slice(1, 5) : [...blogs.sidePosts, ...blogsWithImages];
      
      // Get text posts from blogs without images
      const textPosts = pageNum === 1 ? blogsWithoutImages.slice(0, 5) : [...blogs.textPosts, ...blogsWithoutImages];

      setBlogs({
        featuredPost,
        sidePosts,
        textPosts
      });
    } catch (error) {
      console.error("Error fetching latest blogs:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch latest blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestBlogs(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLatestBlogs(nextPage);
  };

  if (loading) {
    return (
      <div className="bg-[#fafafa]">
        <section className="px-4 md:px-10 py-6 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-gray-200 rounded mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-44 h-20 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!blogs.featuredPost && blogs.sidePosts.length === 0 && blogs.textPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#fafafa]">
      <section className="px-4 md:px-10 py-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-10 flex items-center gap-2">
          <span className="h-10 w-1 bg-yellow-500 inline-block"></span>
          Latest Blogs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Featured Blog */}
          {blogs.featuredPost && (
            <Link href={`/blog/${blogs.featuredPost.slug}`} className="flex flex-col overlay:hidden group">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={blogs.featuredPost.mainImage}
                  alt={blogs.featuredPost.title}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              <div className="flex gap-2 mt-4">
                {blogs.featuredPost.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="bg-yellow-400 text-xs font-semibold px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mt-3">{blogs.featuredPost.title}</h3>
              <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                <div className="flex items-center gap-1">
                  <FaRegCalendarAlt />
                  <span>{new Date(blogs.featuredPost.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaRegClock />
                  <span>{blogs.featuredPost.readTime}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Middle Image Blogs */}
          <div className="flex flex-col gap-6">
            {blogs.sidePosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post._id} className="flex gap-4">
                <img
                  src={post.mainImage}
                  alt={post.title}
                  className="max-w-40 min-w-14 max-h-20 min-h-14 rounded-lg "
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="flex flex-col justify-between">
                  <h4 className="text-sm font-semibold">{post.title}</h4>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                    <FaRegCalendarAlt />
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                    <FaRegClock />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Text Blogs */}
          <div className="flex flex-col gap-4">
            {blogs.textPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post._id} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <img src="/l1.png" alt="" className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold">{post.title}</h4>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                    <FaRegCalendarAlt />
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                    <FaRegClock />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'View More'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogSection;