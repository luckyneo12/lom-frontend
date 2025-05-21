"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  mainImage: string;
  status: "published" | "draft";
  createdAt: string;
  category: string;
  featured: boolean;
}

export default function PostsManagementPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter(post => post._id !== id));
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const post = posts.find(p => p._id === id);
    if (!post) return;

    const newStatus = post.status === "published" ? "draft" : "published";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/${id}`, {
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
      setPosts(posts.map(p => p._id === id ? updatedPost : p));
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
              Blog Posts Management
            </CardTitle>
            <Link href="/dashboard/posts/new" passHref>
              <Button className="bg-yellow-500 text-black hover:bg-yellow-600">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={post.mainImage}
                    alt={post.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
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
                  <Link href={`/dashboard/posts/edit/${post._id}`}>
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
                    onClick={() => toggleStatus(post._id)}
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
                    onClick={() => handleDelete(post._id)}
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
    </div>
  );
} 