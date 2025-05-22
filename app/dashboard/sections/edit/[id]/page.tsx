"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

export default function EditSectionPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showOrderConflictDialog, setShowOrderConflictDialog] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchSections();
    if (id) {
      fetchSection();
    }
  }, [id]);

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
      setSections(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sections",
        variant: "destructive",
      });
    }
  };

  const fetchSection = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch section");
      }

      const data = await response.json();
      setFormData({
        title: data.title,
        order: data.order,
        isActive: data.isActive,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch section details",
        variant: "destructive",
      });
      router.push('/dashboard/sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the new order conflicts with any existing section
    const orderConflict = sections.some(
      section => section.order === formData.order && section._id !== id
    );

    if (orderConflict) {
      setShowOrderConflictDialog(true);
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sections/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: formData.title.trim(),
            order: formData.order,
            isActive: formData.isActive,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update section');
      }

      toast({
        title: "Success",
        description: "Section updated successfully",
      });
      router.push('/dashboard/sections');
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update section',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setShowConfirmDialog(false);
    }
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
        <h1 className="text-2xl font-bold">Edit Section</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Section Information</CardTitle>
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
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter a unique order number. If you use an existing order, you'll be prompted to confirm.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this section? The display order will be {formData.order}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showOrderConflictDialog} onOpenChange={setShowOrderConflictDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Conflict</AlertDialogTitle>
            <AlertDialogDescription>
              The order number {formData.order} is already in use by another section. Would you like to:
              <ul className="list-disc list-inside mt-2">
                <li>Use a different order number</li>
                <li>Swap orders with the existing section</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowOrderConflictDialog(false)}>
              Change Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 