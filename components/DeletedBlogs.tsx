"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaUndo } from 'react-icons/fa';
import { toast } from 'sonner';

interface Blog {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  slug: string;
}

export default function DeletedBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeletedBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog?status=draft`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deleted blogs');
      }

      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      setError('Error fetching deleted blogs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedBlogs();
  }, []);

  const handleRestore = async (blogData: Blog) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${blogData.slug}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: 'published',
          title: blogData.title,
          description: blogData.description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to restore blog');
      }

      toast.success('Blog restored successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4ade80',
          color: 'white',
          border: 'none',
        },
      });

      fetchDeletedBlogs();
    } catch (err) {
      console.error('Error restoring blog:', err);
      toast.error('Failed to restore blog. Please try again.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deleted Blogs</h1>
      
      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search deleted blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500">No deleted blogs found</p>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{blog.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleRestore(blog)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaUndo />
                  <span>Restore</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 