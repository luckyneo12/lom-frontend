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

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let filtered = [...posts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
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
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <Card className="border-2 border-yellow-500 shadow-lg">
        <CardHeader className="bg-black text-yellow-500 px-4 py-3 sm:py-4 border-b-2 border-yellow-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <Link href="/dashboard" passHref>
              <Button
                variant="ghost"
                className="text-yellow-500 hover:bg-white text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <CardTitle className="text-lg sm:text-xl text-center sm:text-left">
              Blog Management
            </CardTitle>
            <Link href="/dashboard/" passHref>
              <Button className="bg-yellow-500 text-black hover:bg-yellow-600">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-gray-400"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px] border-2 border-gray-400">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{category.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category._id);
                        }}
                        className="h-6 w-6 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
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
                    <div className={cn("absolute inset-0", post.mainImage ? "hidden" : "")}>
                      <PlaceholderImage text={post.title ? post.title.slice(0, 10) : 'Blog'} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={post.status === "published" ? "default" : "secondary"}
                      >
                        {post.status}
                      </Badge>
                      {post.featured && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          Featured
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/blog/edit/${post.slug}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-black hover:bg-yellow-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStatus(post.slug)}
                    className={`h-8 w-8 ${
                      post.status === "published"
                        ? "text-yellow-600 hover:bg-yellow-100"
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <span className="text-xs">
                      {post.status === "published" ? "Draft" : "Publish"}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.slug)}
                    className="h-8 w-8 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteModal?.type === 'blog' ? 'Blog Post' : 'Category'}`}
        description={`Are you sure you want to delete "${deleteModal?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
      />
    </div>
  );
} 