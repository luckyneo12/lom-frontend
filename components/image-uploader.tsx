"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload, Crop, Trash2 } from "lucide-react";

interface ImageUploaderProps {
  image: string | null;
  setImage: (image: string | null) => void;
}

export function ImageUploader({ image, setImage }: ImageUploaderProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [scale, setScale] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResizeClick = () => {
    setIsResizing(true);
    // Reset scale when opening resize dialog
    setScale(100);
  };

  const applyResize = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || !imageRef.current) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaled dimensions
    const scaleFactor = scale / 100;
    const scaledWidth = imageRef.current.naturalWidth * scaleFactor;
    const scaledHeight = imageRef.current.naturalHeight * scaleFactor;

    // Set canvas dimensions
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Draw image with scaling
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      imageRef.current.naturalWidth,
      imageRef.current.naturalHeight,
      0,
      0,
      scaledWidth,
      scaledHeight
    );

    // Convert canvas to data URL
    const resizedImage = canvas.toDataURL("image/jpeg", 0.9);
    setImage(resizedImage);
    setIsResizing(false);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {image ? (
        <div className="relative">
          <img
            src={image || "/placeholder.svg"}
            alt="Blog image"
            className="w-full h-auto max-h-[300px] object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleResizeClick}
              className="h-8 w-8 bg-white/80 hover:bg-white"
            >
              <Crop className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              className="h-8 w-8 bg-white/80 hover:bg-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Click to upload image</p>
            <p className="text-sm text-muted-foreground">
              SVG, PNG, JPG or GIF (max. 2MB)
            </p>
          </div>
        </div>
      )}

      <Dialog open={isResizing} onOpenChange={setIsResizing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resize Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {image && (
              <>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Preview"
                    style={{ transform: `scale(${scale / 100})` }}
                    className="w-full h-auto max-h-[300px] object-contain transition-transform origin-center"
                    ref={(el) => {
                      imageRef.current = el;
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Resize</span>
                    <span className="text-sm font-medium">{scale}%</span>
                  </div>
                  <Slider
                    value={[scale]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(value) => setScale(value[0])}
                  />
                </div>
              </>
            )}

            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResizing(false)}>
              Cancel
            </Button>
            <Button onClick={applyResize}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
