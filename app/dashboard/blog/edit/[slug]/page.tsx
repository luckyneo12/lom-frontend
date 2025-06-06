"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: "draft" | "published";
  featured: boolean;
  category: {
    _id: string;
    name: string;
  };
  section: string; // MongoDB ObjectId as string
  tags: string[];
  meta: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
  };
  sections: {
    section_img?: string;
    section_title: string;
    section_description: string;
    section_list: string[];
    order: number;
  }[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Section {
  _id: string;
  title: string;
  order: number;
  isActive: boolean;
}

export default function EditBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    featured: false,
    category: "",
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
    display_section: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchSections();
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

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
      console.log('Fetched sections:', data); // Debug log
      const activeSections = data.filter((section: Section) => section.isActive);
      setAvailableSections(activeSections);
      
      // If we have a blog with a section, make sure it's in the available sections
      if (blog?.section && !activeSections.find((section: Section) => section._id === blog.section)) {
        console.log('Current section not found in active sections:', blog.section);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sections",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchBlog = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${slug}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }

      const data = await response.json();
      console.log('Fetched blog data:', data.blog);
      setBlog(data.blog);
      
      // Set the section ID directly from the blog data
      const sectionId = data.blog.section || "";
      console.log('Setting section ID:', sectionId);
      
      setFormData({
        title: data.blog.title,
        description: data.blog.description,
        status: data.blog.status,
        featured: data.blog.featured,
        category: data.blog.category?._id || "",
        tags: data.blog.tags || [],
        meta: data.blog.meta || {
          meta_title: "",
          meta_description: "",
          meta_keywords: [],
        },
        sections: data.blog.sections || [],
        display_section: sectionId, // This will be the section ID
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog details",
        variant: "destructive",
      });
      router.push('/dashboard/blog/edit');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;

    setSaving(true);
    setError(null);
    try {
      // Validate required fields
      if (!formData.display_section) {
        throw new Error("Section is required");
      }

      // Prepare the update data according to schema
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: blog.content ? blog.content.trim() : '',
        status: formData.status,
        featured: formData.featured,
        category: formData.category,
        tags: formData.tags.filter(tag => tag.trim()),
        meta: {
          meta_title: formData.meta.meta_title.trim(),
          meta_description: formData.meta.meta_description.trim(),
          meta_keywords: formData.meta.meta_keywords.filter((keyword: string) => keyword.trim()),
        },
        sections: formData.sections.map((section, index) => ({
          ...section,
          order: index
        })),
        section: formData.display_section, // Send the selected section ID
      };

      console.log('Submitting update data:', updateData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${slug}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();
      console.log('Update response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blog');
      }

      toast({
        title: "Success",
        description: "Blog updated successfully",
      });

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/blog');
      }, 1500);
    } catch (error) {
      console.error('Error updating blog:', error);
      setError(error instanceof Error ? error.message : 'Failed to update blog');
      setShowErrorDialog(true);
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          section_title: "",
          section_description: "",
          section_list: [],
        },
      ],
    });
  };

  const removeSection = (index: number) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index),
    });
  };

  const updateSection = (index: number, field: string, value: string) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p className="text-gray-600">Blog updated successfully</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
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
              <Label htmlFor="description">Description</Label>
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
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
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
              <Label htmlFor="display_section">Display Section <span className="text-red-500">*</span></Label>
              <div className="space-y-2">
                <Select
                  value={formData.display_section}
                  onValueChange={(value) => {
                    console.log('Selected section:', value);
                    setFormData(prev => ({
                      ...prev,
                      display_section: value
                    }));
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section">
                      {availableSections.find(section => section._id === formData.display_section)?.title || "Select a section"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableSections.map((section) => (
                      <SelectItem key={section._id} value={section._id}>
                        {section.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm space-y-1">
                  {formData.display_section ? (
                    <p className="text-green-600">
                      Currently displaying in: {availableSections.find(section => section._id === formData.display_section)?.title}
                    </p>
                  ) : (
                    <p className="text-amber-600">
                      Please select a section to display this blog.
                    </p>
                  )}
                  <p className="text-gray-500">
                    Select a section to display this blog in that section. This field is required.
                  </p>
                </div>
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
              "Save Changes"
            )}
          </Button>
        </div>
      </form>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Updating Blog</AlertDialogTitle>
            <AlertDialogDescription>
              {error || "An error occurred while updating the blog. Please try again."}
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
    </div>
  );
} 