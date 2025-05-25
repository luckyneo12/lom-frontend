"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface Category {
  _id: string;
  name: string; 
  description: string;
  blogCount: number;
  status: "published" | "draft";
}

export default function CategoryManagementPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
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
          fetchCategories(token);
        }
      } catch (error) {
        console.error("Token check failed", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      console.log("Fetched categories:", data);
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newCategory.trim(),
            description: newDescription.trim(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add category");
        }

        const newCat = await response.json();
        setCategories([...categories, newCat]);
        setNewCategory("");
        setNewDescription("");
        setError(null);
      } catch (error) {
        console.error("Error adding category:", error);
        setError(
          error instanceof Error ? error.message :"Failed to add category"
        );
      }
    }
  }; 

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setEditValue(category.name);
    setEditDescription(category.description || "");
  };

  const handleSaveEdit = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editValue.trim(),
          description: editDescription.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category");
      }

      const updatedCategory = await response.json();
      setCategories(
        categories.map((cat) => (cat._id === id ? updatedCategory : cat))
      );
      setEditingId(null);
      setError(null);
    } catch (error) {
      console.error("Error updating category:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update category"
      );
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      setCategories(categories.filter((cat) => cat._id !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    }
  };

  const toggleStatus = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const category = categories.find((cat) => cat._id === id);
    if (!category) return;

    const newStatus = category.status === "published" ? "draft" : "published";

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category status");
      }

      const updatedCategory = await response.json();
      setCategories(
        categories.map((cat) => (cat._id === id ? updatedCategory : cat))
      );
      setError(null);
    } catch (error) {
      console.error("Error updating category status:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update category status"
      );
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Will redirect to home
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <Card className="border-2 border-yellow-500 shadow-lg">
        <CardHeader className="bg-black text-yellow-500 px-4 py-3 sm:py-4 border-b-2 border-yellow-500">
          <CardTitle className="text-lg sm:text-xl text-center sm:text-left">
            Category Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create New Category */}
            <div className="md:col-span-1">
              <Card className="border-2 border-black h-full">
                <CardHeader className="bg-yellow-50 px-4 py-3 border-b-2 border-black">
                  <h3 className="font-bold text-base sm:text-lg">
                    Create New Category
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <Input
                      placeholder="Category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="border-2 border-black focus:border-yellow-500"
                    />
                    <Textarea
                      placeholder="Category description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="border-2 border-black focus:border-yellow-500 resize-none"
                      rows={4}
                    />
                    <Button
                      onClick={handleAddCategory}
                      className="w-full bg-black text-yellow-500 hover:bg-yellow-500 hover:text-black text-sm sm:text-base"
                      disabled={!newCategory.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Categories List */}
            <div className="md:col-span-2">
              <Card className="border-2 border-black h-full">
                <CardHeader className="bg-yellow-50 px-4 py-3 border-b-2 border-black">
                  <h3 className="font-bold text-base sm:text-lg">
                    All Categories
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {categories.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 text-sm sm:text-base">
                        No categories found. Create your first category!
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div
                            key={category._id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border-2 border-black rounded-md hover:bg-yellow-50 gap-4"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              {editingId === category._id ? (
                                <div className="space-y-2 w-full">
                                  <Input
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    className="border-2 border-black focus:border-yellow-500 h-8"
                                    autoFocus
                                  />
                                  <Textarea
                                    placeholder="Category description"
                                    value={editDescription}
                                    onChange={(e) =>
                                      setEditDescription(e.target.value)
                                    }
                                    className="border-2 border-black focus:border-yellow-500 resize-none"
                                    rows={3}
                                  />
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <span className="font-medium text-sm sm:text-base">
                                    {category.name}
                                  </span>
                                  {category.description && (
                                    <p className="text-sm text-gray-600">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                              )}
                              <Badge
                                variant={
                                  category.status === "published"
                                    ? "default"
                                    : "secondary"
                                }
                                className={`${
                                  category.status === "published"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-300 text-black"
                                }`}
                              >
                                {category.status}
                              </Badge>
                              <Badge className="bg-yellow-500 text-black">
                                {category.blogCount}{" "}
                                {category.blogCount === 1 ? "blog" : "blogs"}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {editingId === category._id ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleSaveEdit(category._id)}
                                    className="h-8 w-8 text-green-600 hover:bg-green-100"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingId(null)}
                                    className="h-8 w-8 text-red-600 hover:bg-red-100"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(category)}
                                    className="h-8 w-8 text-black hover:bg-yellow-100"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleStatus(category._id)}
                                    className={`h-8 w-8 ${
                                      category.status === "published"
                                        ? "text-yellow-600 hover:bg-yellow-100"
                                        : "text-blue-600 hover:bg-blue-100"
                                    }`}
                                  >
                                    <span className="text-xs sm:text-sm">
                                      {category.status === "published"
                                        ? "Draft"
                                        : "Publish"}
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(category._id)}
                                    className="h-8 w-8 text-red-600 hover:bg-red-100"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 