"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Edit, Trash2, Plus, Eye, EyeOff, GripVertical, Pencil } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface Section {
  _id: string;
  title: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function SortableSection({ section, onToggleActive, onEdit, onDelete }: { 
  section: Section;
  onToggleActive: (section: Section) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-2"
    >
      <div className="flex items-center space-x-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </button>
        <span className="font-medium">{section.title}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(section._id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(section._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function SectionsPage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
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
      // Sort sections by order
      const sortedSections = data.sort((a: Section, b: Section) => a.order - b.order);
      setSections(sortedSections);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setUpdatingOrder(true);
      const oldIndex = sections.findIndex((section) => section._id === active.id);
      const newIndex = sections.findIndex((section) => section._id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);

      // Update order in backend
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections/reorder`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
            credentials: "include",
            body: JSON.stringify({
              sections: newSections.map((section, index) => ({
                id: section._id,
                order: index,
              })),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update section order");
        }

        toast({
          title: "Success",
          description: "Section order updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update section order",
          variant: "destructive",
        });
        // Revert to original order on error
        fetchSections();
      } finally {
        setUpdatingOrder(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setShowDeleteDialog(false);
    setSectionToDelete(id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete section');
      }

      // After successful deletion, fetch updated sections
      const updatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
        }
      );

      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated sections');
      }

      const updatedSections = await updatedResponse.json();
      
      // Update orders to be sequential starting from 0
      const reorderedSections = updatedSections.map((section: Section, index: number) => ({
        ...section,
        order: index // Start from 0
      }));

      // Update all sections with new orders
      await Promise.all(
        reorderedSections.map((section: Section) =>
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections/${section._id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              credentials: 'include',
              body: JSON.stringify({
                title: section.title,
                order: section.order,
                isActive: section.isActive,
              }),
            }
          )
        )
      );

      // Update local state with reordered sections
      setSections(reorderedSections);

      toast({
        title: "Success",
        description: "Section deleted successfully and orders updated",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete section',
        variant: "destructive",
      });
    } finally {
      setSectionToDelete(null);
    }
  };

  const handleToggleActive = async (section: Section) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections/${section._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isActive: !section.isActive }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update section");
      }

      setSections(sections.map(s => 
        s._id === section._id ? { ...s, isActive: !s.isActive } : s
      ));
      toast({
        title: "Success",
        description: `Section ${section.isActive ? "deactivated" : "activated"} successfully`,
      });
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        title: "Error",
        description: "Failed to update section status",
        variant: "destructive",
      });
    }
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold">Sections</h1>
        <Button onClick={() => router.push("/dashboard/sections/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Section
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredSections.map((section) => section._id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredSections.map((section) => (
                <SortableSection
                  key={section._id}
                  section={section}
                  onToggleActive={handleToggleActive}
                  onEdit={(id) => router.push(`/dashboard/sections/edit/${id}`)}
                  onDelete={(id) => {
                    setSectionToDelete(id);
                    setShowDeleteDialog(true);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this section? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(sectionToDelete as string)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 