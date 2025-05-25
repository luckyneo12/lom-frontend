"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Dynamically import the rich text editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface Category {
  _id: string;
  name: string;
}

interface DisplaySection {
  _id: string;
  title: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  mainImage: string;
  status: "published" | "draft";
  featured: boolean;
  category: {
    _id: string;
    name: string;
  };
  tags: string[];
  sections: {
    _id?: string;
    section_img?: string;
    section_title: string;
    section_description: string;
    section_list?: string[];
    order: number;
    isActive?: boolean;
    blogs?: string[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }[];
  meta: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
  };
  author: {
    _id: string;
    name: string;
    email?: string;
  };
  section?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface FormData {
  title: string;
  description: string;
  content: string;
  mainImage: string;
  status: "published" | "draft";
  featured: boolean;
  category: string;
  tags: string[];
  sections: {
    _id?: string;
    section_img?: string;
    section_title: string;
    section_description: string;
    section_list?: string[];
    order: number;
    isActive?: boolean;
    blogs?: string[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }[];
  meta: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
  };
  authorName: string;
  section: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.blogId as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    content: "",
    mainImage: "",
    status: "draft" as "published" | "draft",
    featured: false,
    category: "",
    tags: [] as string[],
    sections: [] as {
      _id?: string;
      section_img?: string;
      section_title: string;
      section_description: string;
      section_list?: string[];
      order: number;
      isActive?: boolean;
      blogs?: string[];
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
    }[],
    meta: {
      meta_title: "",
      meta_description: "",
      meta_keywords: []
    },
    authorName: "",
    section: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [metaKeywordInput, setMetaKeywordInput] = useState("");
  const [currentSection, setCurrentSection] = useState({
    section_img: "",
    _id: undefined as string | undefined,
    section_title: "",
    section_description: "",
    order: 0,
    isActive: true,
  });
  const [sectionListInput, setSectionListInput] = useState("");
  const [displaySections, setDisplaySections] = useState<DisplaySection[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }

        // First fetch all blogs to get the slug for the given ID
        const blogsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!blogsResponse.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const blogsData = await blogsResponse.json();
        const blogsArray = Array.isArray(blogsData) ? blogsData : blogsData.blogs || [];
        const blogToEdit = blogsArray.find((b: Blog) => b._id === blogId);

        if (!blogToEdit) {
          throw new Error("Blog not found");
        }

        // Now fetch the specific blog using its slug
        const blogResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${blogToEdit.slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!blogResponse.ok) {
          throw new Error("Failed to fetch blog");
        }

        const responseData = await blogResponse.json();
        const blogData = responseData.blog; // Get the blog data from the response
        setBlog(blogData);
        console.log("Fetched blog data:", blogData);
        
        setFormData({
          title: blogData.title,
          description: blogData.description,
          content: blogData.content || "",
          mainImage: blogData.mainImage || "",
          status: blogData.status,
          featured: blogData.featured,
          category: blogData.category?._id || "",
          tags: blogData.tags || [],
          sections: blogData.sections || [],
          meta: blogData.meta || {
            meta_title: "",
            meta_description: "",
            meta_keywords: []
          },
          authorName: blogData.author?.name || "",
          section: blogData.section || "",
        });

        // Fetch categories
        const categoriesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch display sections
        const displaySectionsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!displaySectionsResponse.ok) {
          console.warn("Failed to fetch display sections.");
          setDisplaySections([]);
        } else {
          const displaySectionsData = await displaySectionsResponse.json();
          if (Array.isArray(displaySectionsData)) {
            setDisplaySections(displaySectionsData);
          } else {
            console.error("Display sections API did not return an array:", displaySectionsData);
            setDisplaySections([]);
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch blog data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      if (!blog) {
        throw new Error("Blog data not found");
      }

      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        meta: {
          ...formData.meta,
          meta_keywords: formData.tags
        },
        author: { name: formData.authorName },
        section: formData.section,
        tags: undefined,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${blog.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update blog");
      }

      toast({
        title: "Success",
        description: "Blog updated successfully",
      });

      router.push("/dashboard/blog");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast({
        title: "Error",
        description: "Failed to update blog",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, mainImage: data.url }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddMetaKeyword = () => {
    if (metaKeywordInput.trim() && !formData.meta.meta_keywords.includes(metaKeywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          meta_keywords: [...prev.meta.meta_keywords, metaKeywordInput.trim()]
        }
      }));
      setMetaKeywordInput("");
    }
  };

  const handleRemoveMetaKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        meta_keywords: prev.meta.meta_keywords.filter((keyword) => keyword !== keywordToRemove)
      }
    }));
  };

  const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        sections: prev.sections.map((section, index) => 
          index === sectionIndex 
            ? { ...section, section_img: data.url }
            : section
        )
      }));
      
      toast({
        title: "Success",
        description: "Section image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const handleAddSection = () => {
    if (currentSection.section_title && currentSection.section_description) {
      setFormData((prev) => ({
        ...prev,
        sections: [...prev.sections, { ...currentSection, order: prev.sections.length }]
      }));
      setCurrentSection({
        section_img: "",
        _id: undefined,
        section_title: "",
        section_description: "",
        order: 0,
        isActive: true,
      });
    }
  };

  const handleRemoveSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveSectionImage = (sectionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) => 
        index === sectionIndex 
          ? { ...section, section_img: "" }
          : section
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Link href="/dashboard/blog">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Blog</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Blog Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Main Blog Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter main blog title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, authorName: e.target.value }))
                    }
                    placeholder="Enter author name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Display Section <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, section: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a display section" />
                    </SelectTrigger>
                    <SelectContent>
                      {displaySections.map((section, index) => {
                        const isSectionObject = typeof section === 'object' && section !== null;
                        const hasValidId = isSectionObject && '_id' in section && typeof section._id === 'string';
                        const hasValidTitle = isSectionObject && 'title' in section && typeof section.title === 'string';

                        const key = hasValidId ? section._id : index;
                        const value = hasValidId ? section._id : String(index);
                        const children = hasValidTitle ? section.title : (typeof section === 'string' ? section : `Invalid Section ${index}`);

                        return (
                          <SelectItem key={key} value={value}>
                            {children}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Select where this blog will be displayed on the home page
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Additional Sections</Label>
                  
                  {formData.sections.length > 0 && (
                    <div className="space-y-4">
                      {formData.sections.map((section, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Section {index + 1}</h4>
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveSection(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={section.section_title}
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    sections: prev.sections.map((s, i) => 
                                      i === index ? { ...s, section_title: e.target.value } : s
                                    )
                                  }));
                                }}
                                placeholder="Section Title"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input
                                value={section.section_description}
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    sections: prev.sections.map((s, i) => 
                                      i === index ? { ...s, section_description: e.target.value } : s
                                    )
                                  }));
                                }}
                                placeholder="Section Description"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Section Image</Label>
                            <div className="flex items-center gap-4">
                              {section.section_img ? (
                                <div className="relative">
                                  <img
                                    src={section.section_img}
                                    alt={`Section ${index + 1}`}
                                    className="w-32 h-32 object-cover rounded-lg"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-md"
                                    onClick={() => handleRemoveSectionImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleSectionImageUpload(e, index)}
                                  className="hidden"
                                  id={`section-image-upload-${index}`}
                                />
                                <Label
                                  htmlFor={`section-image-upload-${index}`}
                                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
                                >
                                  {section.section_img ? "Change Image" : "Upload Image"}
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border p-4 rounded-md space-y-4">
                    <h4 className="font-semibold">Add New Section</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="Section Title"
                          value={currentSection.section_title}
                          onChange={(e) => setCurrentSection(prev => ({...prev, section_title: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          placeholder="Section Description"
                          value={currentSection.section_description}
                          onChange={(e) => setCurrentSection(prev => ({...prev, section_description: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Section Image</Label>
                      <div className="flex items-center gap-4">
                        {currentSection.section_img ? (
                          <div className="relative">
                            <img
                              src={currentSection.section_img}
                              alt="New Section"
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-2 -right-2 bg-white rounded-full shadow-md"
                              onClick={() => setCurrentSection(prev => ({...prev, section_img: ""}))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCurrentSection(prev => ({
                                    ...prev,
                                    section_img: reader.result as string
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id="new-section-image-upload"
                          />
                          <Label
                            htmlFor="new-section-image-upload"
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
                          >
                            {currentSection.section_img ? "Change Image" : "Upload Image"}
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      onClick={handleAddSection}
                      disabled={!currentSection.section_title || !currentSection.section_description}
                    >
                      Add Section
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <Editor
                    value={formData.content}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, content }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
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

              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Blog Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {formData.mainImage ? (
                    <img
                      src={formData.mainImage}
                      alt="Blog cover"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
                    >
                      Upload Image
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta.meta_title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta: { ...prev.meta, meta_title: e.target.value },
                      }))
                    }
                    placeholder="Enter SEO meta title"
                  />
                  <p className="text-sm text-gray-500">Recommended length: 50-60 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta.meta_description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta: { ...prev.meta, meta_description: e.target.value },
                      }))
                    }
                    placeholder="Enter SEO meta description"
                  />
                  <p className="text-sm text-gray-500">Recommended length: 150-160 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>Meta Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      +
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Add relevant tags to help with SEO (e.g., "web-development", "design-tips")</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Status</Label>
                    <p className="text-sm text-gray-500">
                      Choose whether to publish or save as draft
                    </p>
                  </div>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "published" | "draft") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" variant="outline" disabled={saving}>
            Save Draft
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 