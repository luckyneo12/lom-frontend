"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import BlogGrid from "@/components/BlogGrid";

interface Blog {
  _id: string;
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  blogCount: number;
  description: string;
}

export default function CategoryPage() {
  const params = useParams();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for slug:", params.slug);

        // Get the API URL from environment variable or use fallback
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

        // Fetch category details
        const categoryResponse = await fetch(
          `${apiUrl}/api/categories/${params.slug}`
        );

        if (!categoryResponse.ok) {
          throw new Error(`Failed to fetch category: ${categoryResponse.statusText}`);
        }

        const categoryData = await categoryResponse.json();
        setCategory(categoryData);

        // Fetch all blogs
        const postsResponse = await fetch(
          `${apiUrl}/api/blog`
        );

        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch blog posts: ${postsResponse.statusText}`);
        }

        const postsData = await postsResponse.json();
        
        // Handle both array and object response formats
        const postsArray = Array.isArray(postsData) ? postsData : postsData.blogs || [];
        
        // Transform the data to include readTime and filter by category
        const transformedBlogs = postsArray
          .map((blog: any) => ({
            ...blog,
            readTime: `${Math.ceil(blog.description.split(' ').length / 200)} min read`
          }))
          .filter((blog: Blog) => blog.category && blog.category.slug === params.slug);

        console.log('Filtered blogs:', transformedBlogs);
        setBlogs(transformedBlogs);

        // Update category with actual blog count
        if (categoryData) {
          setCategory(prev => prev ? {
            ...prev,
            blogCount: transformedBlogs.length
          } : null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchData();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Category not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mt-6 mb-2">{category.name}</h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        {category.description || `Explore our collection of ${category.blogCount} articles in ${category.name}`}
      </p>

      {blogs.length > 0 ? (
        <BlogGrid blogs={blogs} categoryName={category.name} isCategoryPage={true} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No blogs found in this category.</p>
        </div>
      )}
    </div>
  );
}
