"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all categories
        const categoriesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`
        );
        const categoriesData = await categoriesResponse.json();
        console.log("All Categories:", categoriesData);
        setCategories(categoriesData);

        // Fetch all blogs
        const blogsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`
        );
        const blogsData = await blogsResponse.json();
        console.log("All Blogs:", blogsData);
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(categories, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Blogs</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(blogs, null, 2)}
        </pre>
      </div>
    </div>
  );
}
