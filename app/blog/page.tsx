"use client";

import { useEffect, useState } from "react";
import BlogGrid from "@/components/BlogGrid";
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

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();
        
        // Transform the data to include readTime
        const transformedBlogs = data.map((blog: any) => ({
          ...blog,
          readTime: `${Math.ceil(blog.description.split(' ').length / 200)} min read`
        }));

        setBlogs(transformedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast({
          title: "Error",
          description: "Failed to load blogs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return <BlogGrid blogs={blogs} />;
} 