"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FaNewspaper } from "react-icons/fa";
import { Loader2 } from "lucide-react";

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  description: string;
  mainImage: string;
  status: "published" | "draft";
  createdAt: string;
  category: string;
  featured: boolean;
}

export default function BlogManagementPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'blog' | 'category';
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.push("/");
          return;
        }

        const data = await res.json();
        if (data?.user?.role !== "admin") {
          router.push("/");
        } else {
          setIsAdmin(true);
          fetchPosts(token);
          fetchCategories(token);
        }
      } catch (error) {
        console.error("Token check failed", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchPosts = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      // Handle both array and object response formats
      const postsArray = Array.isArray(data) ? data : data.blogs || [];
      setPosts(postsArray);
      setFilteredPosts(postsArray);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  // Filter posts based on search query and selected category
  useEffect(() => {
    let filtered = [...posts];
    
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category && post.category._id === selectedCategory
      );
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  const handleDelete = async (slug: string) => {
    const post = posts.find(p => p.slug === slug);
    if (!post) return;

    setDeleteModal({
      isOpen: true,
      type: 'blog',
      id: slug,
      title: post.title
    });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    if (!category) return;

    setDeleteModal({
      isOpen: true,
      type: 'category',
      id: categoryId,
      title: category.name
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      if (deleteModal.type === 'blog') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${deleteModal.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to delete post");
        }

        setPosts(posts.filter(post => post.slug !== deleteModal.id));
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${deleteModal.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to delete category");
        }

        setCategories(categories.filter(cat => cat._id !== deleteModal.id));
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to delete ${deleteModal.type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setDeleteModal(null);
    }
  };

  const toggleStatus = async (slug: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const post = posts.find(p => p.slug === slug);
    if (!post) return;

    const newStatus = post.status === "published" ? "draft" : "published";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post status");
      }

      const updatedPost = await response.json();
      setPosts(posts.map(p => p.slug === slug ? updatedPost : p));
      toast({
        title: "Success",
        description: `Post ${newStatus} successfully`,
      });
    } catch (error) {
      console.error("Error updating post status:", error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Link href="/dashboard">
          <Button>Create New Blog</Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Blog List */}
      <div className="grid gap-4">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="relative w-[80px] h-[80px] rounded-md overflow-hidden">
                  {post.mainImage ? (
                    <img
                      src={post.mainImage}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center ${post.mainImage ? 'hidden' : ''}`}>
                    <FaNewspaper className="w-8 h-8 text-white opacity-80" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                  <div className="flex gap-2 mt-2">
                    {post.category && (
                      <Badge variant="secondary">{post.category.name}</Badge>
                    )}
                    <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                      {post.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/blog/${post._id}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteModal({
                    isOpen: true,
                    type: 'blog',
                    id: post._id,
                    title: post.title
                  })}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No blogs found</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <AlertDialog open={deleteModal.isOpen} onOpenChange={(open) => !open && setDeleteModal(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {deleteModal.type === 'blog' ? 'the blog' : 'the category'} "{deleteModal.title}".
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('No token found');

                    const response = await fetch(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${deleteModal.type}/${deleteModal.id}`,
                      {
                        method: 'DELETE',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      }
                    );

                    if (!response.ok) throw new Error('Failed to delete');

                    toast({
                      title: "Success",
                      description: `${deleteModal.type === 'blog' ? 'Blog' : 'Category'} deleted successfully`,
                    });

                    if (deleteModal.type === 'blog') {
                      fetchPosts(token);
                    } else {
                      fetchCategories(token);
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to delete",
                      variant: "destructive",
                    });
                  } finally {
                    setDeleteModal(null);
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
} 