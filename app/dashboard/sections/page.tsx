"use client";

import { useState, useEffect } from "react";
import { Section } from "@/app/api/sections/route";

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/sections");
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
  };

  const handleDelete = async (sectionId: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      try {
        const response = await fetch(`/api/sections/${sectionId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchSections();
        }
      } catch (error) {
        console.error("Error deleting section:", error);
      }
    }
  };

  const handleToggle = async (sectionId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (response.ok) {
        fetchSections();
      }
    } catch (error) {
      console.error("Error toggling section:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Sections</h1>
        <button
          onClick={() => setEditingSection({} as Section)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Section
        </button>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <div
            key={section._id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-gray-600">{section.description}</p>
              <div className="text-sm text-gray-500 mt-1">
                Type: {section.type} | Style: {section.displayStyle} | Limit: {section.limit}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(section)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(section._id!)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleToggle(section._id!, section.isActive)}
                className={`${
                  section.isActive ? "bg-green-500" : "bg-gray-500"
                } text-white px-3 py-1 rounded hover:opacity-90`}
              >
                {section.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingSection._id ? "Edit Section" : "Add New Section"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={editingSection.description}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={editingSection.type}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, type: e.target.value as Section['type'] })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="featured">Featured</option>
                  <option value="latest">Latest</option>
                  <option value="category">Category</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Display Style</label>
                <select
                  value={editingSection.displayStyle}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      displayStyle: e.target.value as Section['displayStyle'],
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Limit</label>
                <input
                  type="number"
                  value={editingSection.limit}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      limit: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 