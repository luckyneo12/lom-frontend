"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "@/components/ui/use-toast";

interface BlogManagementProps {
  slug: string;
  onDelete?: () => void;
}

export default function BlogManagement({ slug, onDelete }: BlogManagementProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // First get the blog ID using the slug
      const getBlogResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${slug}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!getBlogResponse.ok) {
        throw new Error('Failed to fetch blog details');
      }

      const blogData = await getBlogResponse.json();
      const blogId = blogData.blog._id;

      // Now delete using the ID
      const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.message || 'Failed to delete blog post');
      }

      const data = await deleteResponse.json();
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      if (onDelete) {
        onDelete();
      }
      
      // Redirect to home page after successful deletion
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to delete blog post',
        variant: "destructive",
      });
      console.error('Error deleting blog:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/blog/edit/${slug}`);
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={handleEdit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Edit Blog
      </button>
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : 'Delete Blog'}
      </button>

      {error && (
        <div className="text-red-500 mt-2">
          {error}
        </div>
      )}
    </div>
  );
} 