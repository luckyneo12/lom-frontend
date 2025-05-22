"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Label,
} from "@/components/ui/label";
import {
  Input,
  Textarea,
} from "@/components/ui/input";
import {
  Button,
} from "@/components/ui/button";
import {
  Switch,
} from "@/components/ui/switch";
import {
  Plus,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
} from "lucide-react";
import {
  Loader2,
} from "lucide-react";

interface Section {
  _id: string;
  title: string;
  order: number;
  isActive: boolean;
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    featured: false,
    category: "",
    section: "",
    tags: [] as string[],
    meta: {
      meta_title: "",
      meta_description: "",
      meta_keywords: [] as string[],
    },
    sections: [] as {
      section_title: string;
      section_description: string;
      section_img?: string;
      section_list?: string[];
    }[],
  });

  useEffect(() => {
    fetchCategories();
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }

      const data = await response.json();
      setAvailableSections(data.filter((section: Section) => section.isActive));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sections",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.section) {
        throw new Error("Please select a display section for the blog");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            title: formData.title.trim(),
            description: formData.description.trim(),
            status: formData.status,
            featured: formData.featured,
            category: formData.category,
            section: formData.section,
            tags: formData.tags.filter((tag) => tag.trim()),
            meta: {
              meta_title: formData.meta.meta_title.trim(),
              meta_description: formData.meta.meta_description.trim(),
              meta_keywords: formData.meta.meta_keywords.filter((keyword: string) => keyword.trim()),
            },
            sections: formData.sections.map((section, index) => ({
              ...section,
              order: index
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create blog");
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/blog");
      }, 1500);
    } catch (error) {
      console.error("Error creating blog:", error);
      setError(error instanceof Error ? error.message : "Failed to create blog");
      setShowErrorDialog(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="section">Display Section <span className="text-red-500">*</span></Label>
              <div className="space-y-2">
                <Select
                  value={formData.section}
                  onValueChange={(value) => {
                    setFormData({ ...formData, section: value });
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSections.map((section) => (
                      <SelectItem key={section._id} value={section._id}>
                        {section.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Select the section where this blog will be displayed on the home page. This is required.
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
              />
              <Label htmlFor="featured">Featured Post</Label>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as "published" | "draft" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta.meta_title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meta: { ...formData.meta, meta_title: e.target.value },
                  })
                }
                placeholder="If left empty, blog title will be used"
              />
            </div>

            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta.meta_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meta: { ...formData.meta, meta_description: e.target.value },
                  })
                }
                placeholder="If left empty, blog description will be used"
              />
            </div>

            <div>
              <Label htmlFor="meta_keywords">Meta Keywords (comma-separated)</Label>
              <Input
                id="meta_keywords"
                value={formData.meta.meta_keywords.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meta: {
                      ...formData.meta,
                      meta_keywords: e.target.value.split(",").map((tag) => tag.trim()),
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Content Sections</CardTitle>
            <Button type="button" onClick={addSection} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.sections.map((section, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeSection(index)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={section.section_title}
                    onChange={(e) =>
                      updateSection(index, "section_title", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Section Description</Label>
                  <Textarea
                    value={section.section_description}
                    onChange={(e) =>
                      updateSection(index, "section_description", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Section Image URL</Label>
                  <Input
                    value={section.section_img || ""}
                    onChange={(e) =>
                      updateSection(index, "section_img", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Blog"
            )}
          </Button>
        </div>
      </form>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Creating Blog</AlertDialogTitle>
            <AlertDialogDescription>
              {error || "An error occurred while creating the blog. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p className="text-gray-600">Blog created successfully</p>
          </div>
        </div>
      )}
    </div>
  );
} 