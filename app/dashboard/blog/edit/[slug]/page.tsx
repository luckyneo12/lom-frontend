"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  mainImage: string;
  status: "published" | "draft";
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  featured: boolean;
  tags: string[];
  meta: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
  };
  sections?: {
    section_title: string;
    section_description: string;
    section_img?: string;
    section_list?: string[];
  }[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function EditBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
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
  });

  useEffect(() => {
    fetchCategories();
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

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
      setBlog(data.blog);
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
      });
    } catch (error) {
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
    setSaving(true);

    try {
      // Format the data to match the API expectations
      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        featured: formData.featured,
        category: formData.category || null,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        meta: {
          meta_title: formData.meta.meta_title.trim(),
          meta_description: formData.meta.meta_description.trim(),
          meta_keywords: formData.meta.meta_keywords.filter(keyword => keyword.trim() !== ''),
        },
        sections: formData.sections.map(section => ({
          section_title: section.section_title.trim(),
          section_description: section.section_description.trim(),
          section_img: section.section_img?.trim() || null,
          section_list: section.section_list || [],
        })),
      };

      // Log the formatted data for debugging
      console.log('Sending data:', formattedData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: "include",
          body: JSON.stringify(formattedData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update blog");
      }

      toast({
        title: "Success",
        description: "Blog updated successfully",
      });

      router.push("/dashboard/blog/edit");
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blog",
        variant: "destructive",
      });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
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
    </div>
  );
} 