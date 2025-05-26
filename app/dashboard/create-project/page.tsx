"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, Edit2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Project {
  _id: string;
  title: string;
  mainImage: string;
  images: string[];
  category: string;
  description: string;
  createdAt: string;
}

interface ProjectCategory {
  _id: string;
  name: string;
  slug: string;
}

interface ApiResponse {
  success: boolean;
  data: Project[];
  message?: string;
}

interface CategoryResponse {
  success: boolean;
  data: ProjectCategory[];
  message?: string;
}

const CreateProject = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    mainImage: null as File | null,
    images: [] as File[],
  });
  const [previewUrls, setPreviewUrls] = useState<{
    mainImage: string;
    images: string[];
  }>({
    mainImage: "",
    images: [],
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.push("/");
          return;
        }

        const data = await res.json();
        if (data?.user?.role !== "admin") {
          router.push("/");
        } else {
          setAdmin(true);
          fetchProjects(token);
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

  const fetchProjects = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const responseData: ApiResponse = await response.json();
      if (responseData.success && Array.isArray(responseData.data)) {
        setProjects(responseData.data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const responseData: CategoryResponse = await response.json();
      if (responseData.success && Array.isArray(responseData.data)) {
        setCategories(responseData.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories");
      setCategories([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'mainImage' | 'images') => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (type === 'mainImage') {
      const file = files[0];
      if (file) {
        // Validate file type
        if (!allowedTypes.includes(file.type.toLowerCase())) {
          toast.error(`Please upload a valid image file (JPEG, PNG, GIF, WEBP)`);
          e.target.value = ''; // Clear the input
          return;
        }
        // Validate file size
        if (file.size > maxSize) {
          toast.error('File size should be less than 10MB');
          e.target.value = ''; // Clear the input
          return;
        }
        setFormData(prev => ({ ...prev, mainImage: file }));
        setPreviewUrls(prev => ({
          ...prev,
          mainImage: URL.createObjectURL(file),
        }));
      }
    } else {
      const newFiles = Array.from(files);
      // Validate each file
      const validFiles = newFiles.filter(file => {
        if (!allowedTypes.includes(file.type.toLowerCase())) {
          toast.error(`${file.name} is not a valid image file. Please upload JPEG, PNG, GIF, or WEBP files.`);
          return false;
        }
        if (file.size > maxSize) {
          toast.error(`${file.name} is larger than 10MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: Array.isArray(prev.images) ? [...prev.images, ...validFiles] : validFiles,
        }));
        setPreviewUrls(prev => ({
          ...prev,
          images: Array.isArray(prev.images) ? [...prev.images, ...validFiles.map(file => URL.createObjectURL(file))] : validFiles.map(file => URL.createObjectURL(file)),
        }));
      }
    }
  };

  const removeImage = (index: number, type: 'mainImage' | 'images') => {
    if (type === 'mainImage') {
      setFormData(prev => ({ ...prev, mainImage: null }));
      setPreviewUrls(prev => ({ ...prev, mainImage: "" }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: Array.isArray(prev.images) ? prev.images.filter((_, i) => i !== index) : [],
      }));
      setPreviewUrls(prev => ({
        ...prev,
        images: Array.isArray(prev.images) ? prev.images.filter((_, i) => i !== index) : [],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }
    if (!formData.mainImage && !editingProject) {
      toast.error("Main image is required");
      return;
    }
    // Only require additional images for new projects
    if (!editingProject && (!formData.images || formData.images.length === 0)) {
      toast.error("At least one additional image is required");
      return;
    }

    try {
      // Create FormData for all files
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("category", formData.category);
      
      // Add main image if it's a new file
      if (formData.mainImage) {
        formDataToSend.append("mainImage", formData.mainImage);
      }

      // Add additional images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append("additionalImages", image);
        });
      }

      // Log the form data for debugging
      console.log('Form data being sent:', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        hasMainImage: !!formData.mainImage,
        additionalImagesCount: formData.images.length,
        isUpdate: !!editingProject
      });

      const url = editingProject
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${editingProject._id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`;

      const response = await fetch(url, {
        method: editingProject ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save project");
      }

      if (responseData.success) {
        await fetchProjects(token);
        setIsModalOpen(false);
        setEditingProject(null);
        setFormData({
          title: "",
          description: "",
          category: "",
          mainImage: null,
          images: [],
        });
        setPreviewUrls({
          mainImage: "",
          images: [],
        });
        toast.success(`Project ${editingProject ? "updated" : "created"} successfully`);
      } else {
        throw new Error(responseData.message || "Failed to save project");
      }
    } catch (err) {
      console.error("Error saving project:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects(prev => prev.filter(proj => proj._id !== id));
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      mainImage: null,
      images: [], // Reset images array for new uploads
    });
    setPreviewUrls({
      mainImage: project.mainImage,
      images: project.images || [], // Set existing images as preview
    });
    setIsModalOpen(true);
  };

  const renderAdditionalImages = () => {
    const images = Array.isArray(previewUrls?.images) ? previewUrls.images : [];
    return images.length > 0 ? (
      <div className="grid grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Additional image ${index + 1}`}
              className="h-24 w-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(index, 'images')}
              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <label className="relative cursor-pointer bg-gray-50 rounded-md p-2 border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-colors">
          <div className="flex flex-col items-center">
            <Plus className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-600">Add more</span>
          </div>
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(e, 'images')}
          />
        </label>
      </div>
    ) : (
      <>
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-400 hover:text-yellow-500">
            <span>Upload files</span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e, 'images')}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </>
    );
  };

  const handleNextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev < selectedProject.images.length ? prev + 1 : 0
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedProject.images.length
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Projects</h1>
          <p className="text-gray-600">Manage your projects</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setFormData({
              title: "",
              description: "",
              category: "",
              mainImage: null,
              images: [],
            });
            setPreviewUrls({
              mainImage: "",
              images: [],
            });
            setIsModalOpen(true);
          }}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.images && project.images.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      {project.images.length + 1} images
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  {project.images && project.images.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {project.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Additional image ${index + 1}`}
                          className="h-16 w-16 object-cover rounded cursor-pointer"
                          onClick={() => {
                            setSelectedProject(project);
                            setCurrentImageIndex(index + 1);
                          }}
                        />
                      ))}
                      {project.images.length > 4 && (
                        <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                          +{project.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No projects found. Click "Add Project" to create one.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  rows={4}
                  required
                  placeholder="Enter project description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {previewUrls.mainImage ? (
                      <div className="relative">
                        <img
                          src={previewUrls.mainImage}
                          alt="Main image preview"
                          className="mx-auto h-32 w-auto object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(0, 'mainImage')}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-400 hover:text-yellow-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, 'mainImage')}
                              required={!editingProject}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Images <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {renderAdditionalImages()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      mainImage: null,
                      images: [],
                    });
                    setPreviewUrls({
                      mainImage: "",
                      images: [],
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md"
                >
                  {editingProject ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button onClick={() => setSelectedProject(null)}>...</button>
            
            <div className="relative aspect-video">
              <img
                src={currentImageIndex === 0 ? selectedProject.mainImage : selectedProject.images[currentImageIndex - 1]}
                alt={selectedProject.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button onClick={handlePrevImage}>...</button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button onClick={handleNextImage}>...</button>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded">
                {currentImageIndex + 1} / {selectedProject.images.length + 1}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProject; 