"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProjectsDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGallery(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call backend API to create project
    alert(JSON.stringify({ title, description, mainImage, gallery }, null, 2));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Project Title"
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Project Description"
          rows={4}
        />
        <input
          className="w-full border p-2 rounded"
          value={mainImage}
          onChange={e => setMainImage(e.target.value)}
          placeholder="Main Image URL"
          type="text"
        />
        <input
          className="w-full border p-2 rounded"
          type="file"
          multiple
          onChange={handleGalleryChange}
        />
        <div className="flex flex-wrap gap-2">
          {gallery.map((img, idx) => (
            <img key={idx} src={img} alt="Gallery" className="w-24 h-24 object-cover rounded" />
          ))}
        </div>
        <Button type="submit">Create Project</Button>
      </form>
      {/* TODO: List existing projects here */}
    </div>
  );
} 