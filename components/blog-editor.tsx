"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Define categories array
const categories = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Marketing" },
  { id: "3", name: "Design" },
  { id: "4", name: "Development" },
  { id: "5", name: "Business" },
];

// Define a type for title-description pairs
interface TitleDescription {
  id: string;
  title: string;
  description: string;
  image?: string;
  list?: string[];
}

// Define a type for images
interface BlogImage {
  id: string;
  url: string;
}

interface Category {
  _id: string;
  name: string;
  blogCount: number;
  status: "published" | "draft";
}

interface Section {
  _id: string;
  title: string;
  order: number;
  isActive: boolean;
}

const formSchema = z.object({
  mainTitle: z.string().min(5, {
    message: "Main title must be at least 5 characters.",
  }),
  metaTitle: z.string().min(5, {
    message: "Meta title must be at least 5 characters.",
  }),
  metaDescription: z.string().min(10, {
    message: "Meta description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  display_section: z.string({
    required_error: "Please select a display section.",
  }),
  author: z.string().min(2, {
    message: "Author name must be at least 2 characters.",
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  images: z.array(z.string()).optional(),
});

export function BlogEditor() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const [titleDescriptions, setTitleDescriptions] = useState<
    TitleDescription[]
  >([]);
  const [images, setImages] = useState<BlogImage[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainTitle: "",
      metaTitle: "",
      metaDescription: "",
      category: "",
      display_section: "",
      author: "",
      content: "",
      images: [],
    },
  });

  // Check admin status on component mount
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        router.push("/");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Auth response status:", res.status);

        if (!res.ok) {
          console.error("Auth failed, status:", res.status);
          localStorage.removeItem("token"); // Clear invalid token
          router.push("/");
          return;
        }

        const data = await res.json();
        console.log("User data:", data);

        if (data?.user?.role !== "admin") {
          console.error("User is not admin");
          router.push("/");
        } else {
          setAdmin(true);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections`
        );
        if (!response.ok) throw new Error("Failed to fetch sections");
        const data = await response.json();
        setSections(data.filter((section: Section) => section.isActive));
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, []);

  // Add a new title-description pair
  const addTitleDescription = () => {
    setTitleDescriptions([
      ...titleDescriptions,
      {
        id: `td-${Date.now()}`,
        title: "",
        description: "",
        image: "",
        list: [],
      },
    ]);
  };

  // Remove a title-description pair
  const removeTitleDescription = (id: string) => {
    setTitleDescriptions(titleDescriptions.filter((item) => item.id !== id));
  };

  // Update a title-description pair
  const updateTitleDescription = (
    id: string,
    field: "title" | "description" | "image" | "list",
    value: string | string[]
  ) => {
    setTitleDescriptions(
      titleDescriptions.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Add a new image
  const addImage = (imageUrl: string) => {
    const newImage = { id: `img-${Date.now()}`, url: imageUrl };
    setImages((prevImages) => [...prevImages, newImage]);
  };

  // Remove an image
  const removeImage = (id: string) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((img) => img.id !== id);
      console.log("Removing image:", id);
      console.log("New images array:", newImages);
      return newImages;
    });
  };

  // Add a new tag
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    setSubmitting(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      // Create form data for the blog post
      const formData = new FormData();

      // Add basic blog information
      formData.append("title", values.mainTitle);
      formData.append("description", values.content);
      formData.append("category", values.category);
      formData.append("section", values.display_section);
      formData.append("author", values.author);
      formData.append("status", "draft");
      formData.append("featured", "false");

      // Add meta information
      const meta = {
        meta_title: values.metaTitle,
        meta_description: values.metaDescription,
        meta_keywords: tags,
      };
      formData.append("meta", JSON.stringify(meta));

      // Add tags
      formData.append("tags", JSON.stringify(tags));

      // Add main image if available
      if (images.length > 0) {
        const mainImageUrl = images[0].url;
        const mainImageResponse = await fetch(mainImageUrl);
        const mainImageBlob = await mainImageResponse.blob();
        const mainImageFile = new File(
          [mainImageBlob],
          `main-image-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
        formData.append("mainImage", mainImageFile);
      }

      // Add sections
      const sections = titleDescriptions.map((section, index) => ({
        section_title: section.title,
        section_description: section.description,
        section_list: section.list || [],
        order: index,
      }));
      formData.append("sections", JSON.stringify(sections));

      // Add section images
      for (const section of titleDescriptions) {
        if (section.image) {
          const base64Data = section.image.split(",")[1];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          const blob = new Blob(byteArrays, { type: "image/jpeg" });
          formData.append("section_images", blob, `section_${Date.now()}.jpg`);
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create blog post");
      }

      // Show success animation
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        form.reset();
        setTitleDescriptions([]);
        setImages([]);
        setTags([]);
        setCurrentTag("");
        setShowSuccess(false);
        
        // Redirect to the new blog post
        router.push(`/blog/${data.blog.slug}`);
      }, 2000);

    } catch (error) {
      console.error("Error creating blog post:", error);
      setShowError(true);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="grid gap-6 max-w-7xl mx-auto px-4 py-8">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>Blog post created successfully!</span>
          </motion.div>
        )}

        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <AlertCircle className="h-5 w-5" />
            <span>Failed to create blog post</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black py-3 text-lg font-medium"
          >
            Edit Post
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black py-3 text-lg font-medium"
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Card className="border-2 border-yellow-500 shadow-lg">
            <CardHeader className="text-yellow-500 p-6 border-b-2 border-yellow-500">
              <CardTitle className="text-2xl font-bold">Blog Editor</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="mainTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black font-semibold text-lg">
                              Main Blog Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter main blog title"
                                {...field}
                                className="border-2 border-gray-400 h-12 text-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black font-semibold text-lg">
                              Author Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter author name"
                                {...field}
                                className="border-2 border-gray-400 h-12"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="display_section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black font-semibold text-lg">
                              Display Section <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-2 border-gray-400 h-12">
                                  <SelectValue placeholder="Select a display section" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sections.map((section) => (
                                  <SelectItem
                                    key={section._id}
                                    value={section._id}
                                  >
                                    {section.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-gray-600 mt-2">
                              Select where this blog will be displayed on the home page
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      {/* Additional Title-Description Sections */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-lg font-semibold leading-none text-black">
                            Additional Sections
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTitleDescription}
                            className="h-10 gap-2 border-gray-400 text-black hover:bg-yellow-500 hover:text-black px-4"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Section</span>
                          </Button>
                        </div>

                        {titleDescriptions.map((item) => (
                          <div
                            key={item.id}
                            className="space-y-4 p-6 border-2 border-gray-400 rounded-lg relative bg-white"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTitleDescription(item.id)}
                              className="h-8 w-8 absolute top-3 right-3 text-black hover:text-red-500 hover:bg-transparent"
                            >
                              <Trash2 className="h-5 w-5" />
                              <span className="sr-only">Remove</span>
                            </Button>

                            <div>
                              <label className="text-lg font-semibold leading-none block mb-3 text-black">
                                Section Title
                              </label>
                              <Input
                                placeholder="Enter section title"
                                value={item.title}
                                onChange={(e) =>
                                  updateTitleDescription(
                                    item.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="border-2 border-gray-400 h-12"
                              />
                            </div>

                            <div>
                              <label className="text-lg font-semibold leading-none block mb-3 text-black">
                                Section Description
                              </label>
                              <Textarea
                                placeholder="Enter section description"
                                value={item.description}
                                onChange={(e) =>
                                  updateTitleDescription(
                                    item.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="resize-none border-2 border-gray-400 min-h-[120px]"
                              />
                            </div>

                            <div>
                              <label className="text-lg font-semibold leading-none block mb-3 text-black">
                                Section Image
                              </label>
                              <div className="border-2 border-dashed border-gray-400 rounded-lg p-6">
                                {item.image ? (
                                  <div className="relative aspect-video">
                                    <img
                                      src={item.image}
                                      alt="Section image"
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      onClick={() =>
                                        updateTitleDescription(
                                          item.id,
                                          "image",
                                          ""
                                        )
                                      }
                                      className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center aspect-video">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        const fileInput =
                                          document.createElement("input");
                                        fileInput.type = "file";
                                        fileInput.accept = "image/*";
                                        fileInput.onchange = (e) => {
                                          const file = (
                                            e.target as HTMLInputElement
                                          ).files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                              if (event.target?.result) {
                                                updateTitleDescription(
                                                  item.id,
                                                  "image",
                                                  event.target.result as string
                                                );
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        };
                                        fileInput.click();
                                      }}
                                      className="border-gray-400 text-black hover:bg-yellow-500 hover:text-black h-12 px-6"
                                    >
                                      <Plus className="h-5 w-5 mr-2" />
                                      Add Image
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black font-semibold text-lg">
                              Content
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write your blog content here..."
                                className="min-h-[300px] border-2 border-gray-400 text-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black font-semibold text-lg">
                              Category
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-2 border-gray-400 h-12">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      {/* Multiple Images Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-lg font-semibold leading-none text-black">
                            Blog Images
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const fileInput = document.createElement("input");
                              fileInput.type = "file";
                              fileInput.accept = "image/*";
                              fileInput.onchange = (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (event.target?.result) {
                                      addImage(event.target.result as string);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              };
                              fileInput.click();
                            }}
                            className="h-10 gap-2 border-gray-400 text-black hover:bg-yellow-500 hover:text-black px-4"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Image</span>
                          </Button>
                        </div>

                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                          {images.map((image, index) => (
                            <div
                              key={image.id}
                              className="relative aspect-video border-2 border-gray-400 rounded-lg overflow-hidden group"
                            >
                              <img
                                src={image.url}
                                alt={`Blog image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeImage(image.id);
                                }}
                                className="absolute top-3 right-3 h-8 w-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}

                          {images.length === 0 && (
                            <div className="col-span-full">
                              <div className="border-2 border-dashed border-gray-400 rounded-lg hover:border-yellow-500 transition-colors">
                                <ImageUploader
                                  image={null}
                                  setImage={(url) => {
                                    if (url) addImage(url);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                        <FormField
                          control={form.control}
                          name="metaTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black font-semibold text-lg">
                                Meta Title
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter SEO meta title"
                                  {...field}
                                  className="border-2 border-gray-400 h-12"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-600 mt-2">
                                Recommended length: 50-60 characters
                              </FormDescription>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="metaDescription"
                          render={({ field }) => (
                            <FormItem className="mt-6">
                              <FormLabel className="text-black font-semibold text-lg">
                                Meta Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter SEO meta description"
                                  className="resize-none border-2 border-gray-400 min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-gray-600 mt-2">
                                Recommended length: 150-160 characters
                              </FormDescription>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        {/* Meta Tags Section */}
                        <FormItem className="mt-6">
                          <FormLabel className="text-black font-semibold text-lg">
                            Meta Tags
                          </FormLabel>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  className="bg-black text-yellow-500 px-4 py-2 text-sm font-medium flex items-center gap-2"
                                >
                                  {tag}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTag(tag)}
                                    className="h-5 w-5 text-yellow-500 hover:text-white hover:bg-transparent"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a tag (press Enter)"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTag();
                                  }
                                }}
                                className="border-2 border-gray-400 h-12"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={addTag}
                                className="border-gray-400 text-black hover:bg-yellow-500 hover:text-black h-12 px-4"
                                disabled={!currentTag.trim()}
                              >
                                <Plus className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                          <FormDescription className="text-gray-600 mt-2">
                            Add relevant tags to help with SEO (e.g., "web-development", "design-tips")
                          </FormDescription>
                        </FormItem>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button
                      variant="outline"
                      className="border-gray-400 text-black hover:bg-yellow-500 hover:text-black h-12 px-8 text-lg"
                      disabled={submitting}
                    >
                      Save Draft
                    </Button>
                    <Button
                      type="submit"
                      className="bg-black text-yellow-500 hover:bg-yellow-500 hover:text-black h-12 px-8 text-lg"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-6 w-6 border-2 border-yellow-500 border-t-transparent rounded-full"
                        />
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="border-2 border-yellow-500 shadow-lg">
            <CardHeader className="text-yellow-500 p-6 border-b-2 border-yellow-500">
              <CardTitle className="text-2xl font-bold">Blog Preview</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 bg-white">
              <div className="prose max-w-none dark:prose-invert">
                <h1 className="text-4xl font-bold text-black mb-6">
                  {form.watch("mainTitle") || "Blog Title"}
                </h1>

                {images.length > 0 && (
                  <div className="my-8">
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <img
                        src={images[0].url || "/placeholder.svg"}
                        alt={form.watch("mainTitle") || "Blog image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-base text-gray-600 mb-8">
                  <Badge className="bg-yellow-500 text-black px-4 py-2 text-base">
                    {form.watch("category") || "Category"}
                  </Badge>
                  <span>By {form.watch("author") || "Author"}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {tags.map((tag) => (
                      <Badge key={tag} className="bg-black text-yellow-500 px-4 py-2 text-base">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="text-gray-800 leading-relaxed text-lg">
                  {form.watch("content") || "Your blog content will appear here..."}
                </div>

                {titleDescriptions.length > 0 && (
                  <div className="mt-12 space-y-8">
                    <h2 className="text-3xl font-bold text-black border-b-2 border-yellow-500 pb-3">
                      Additional Sections
                    </h2>
                    {titleDescriptions.map((item) => (
                      <div key={item.id} className="space-y-4">
                        <h3 className="text-2xl font-semibold text-black">
                          {item.title || "Section Title"}
                        </h3>
                        <p className="text-gray-700 text-lg">
                          {item.description || "Section description..."}
                        </p>
                        {item.image && (
                          <div className="aspect-video relative rounded-lg overflow-hidden mt-4">
                            <img
                              src={item.image}
                              alt={item.title || "Section image"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {images.length > 1 && (
                  <div className="mt-12">
                    <h2 className="text-3xl font-bold text-black border-b-2 border-yellow-500 pb-3 mb-6">
                      Gallery
                    </h2>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                      {images.slice(1).map((image) => (
                        <div key={image.id} className="aspect-video relative rounded-lg overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt="Additional blog image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
