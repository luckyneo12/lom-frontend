"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { ImageUploader } from "@/components/image-uploader";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  mainImage: string;
  status: "published" | "draft";
  category: string;
  featured: boolean;
  tags: string[];
  meta: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
  };
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTag, setCurrentTag] = useState("");

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
          fetchPost(token);
        }
      } catch (error) {
        console.error("Token check failed", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router, params.id]);

  const fetchPost = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blog post",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(post),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (url: string) => {
    if (post) {
      setPost({ ...post, mainImage: url });
    }
  };

  const addTag = () => {
    if (!currentTag.trim() || !post) return;
    if (post.tags.includes(currentTag.trim())) {
      toast({
        title: "Error",
        description: "Tag already exists",
        variant: "destructive",
      });
      return;
    }
    setPost({
      ...post,
      tags: [...post.tags, currentTag.trim()],
    });
    setCurrentTag("");
  };

  const removeTag = (tagToRemove: string) => {
    if (!post) return;
    setPost({
      ...post,
      tags: post.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!isAdmin || !post) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <Card className="border-2 border-yellow-500 shadow-lg">
        <CardHeader className="bg-black text-yellow-500 px-4 py-3 sm:py-4 border-b-2 border-yellow-500">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/posts" passHref>
              <Button
                variant="ghost"
                className="text-yellow-500 hover:bg-white text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Posts
              </Button>
            </Link>
            <CardTitle className="text-lg sm:text-xl">Edit Blog Post</CardTitle>
            <div className="w-24" /> {/* Spacer for alignment */}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={post.title}
                  onChange={(e) =>
                    setPost({ ...post, title: e.target.value })
                  }
                  className="border-2 border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Textarea
                  value={post.description}
                  onChange={(e) =>
                    setPost({ ...post, description: e.target.value })
                  }
                  className="min-h-[100px] border-2 border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Main Image
                </label>
                <div className="border-2 border-dashed border-gray-400 rounded-md p-4">
                  <ImageUploader
                    image={post.mainImage}
                    setImage={handleImageChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag"
                    className="border-2 border-gray-400"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="bg-yellow-500 text-black hover:bg-yellow-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Title
                </label>
                <Input
                  value={post.meta.meta_title}
                  onChange={(e) =>
                    setPost({
                      ...post,
                      meta: { ...post.meta, meta_title: e.target.value },
                    })
                  }
                  className="border-2 border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Description
                </label>
                <Textarea
                  value={post.meta.meta_description}
                  onChange={(e) =>
                    setPost({
                      ...post,
                      meta: { ...post.meta, meta_description: e.target.value },
                    })
                  }
                  className="min-h-[100px] border-2 border-gray-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={post.featured}
                    onChange={(e) =>
                      setPost({ ...post, featured: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Featured Post</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={post.status === "published"}
                    onChange={(e) =>
                      setPost({
                        ...post,
                        status: e.target.checked ? "published" : "draft",
                      })
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Published</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/posts")}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-yellow-500 text-black hover:bg-yellow-600">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 