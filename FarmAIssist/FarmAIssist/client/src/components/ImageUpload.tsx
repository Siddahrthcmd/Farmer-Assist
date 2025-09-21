import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";

interface ImageUploadProps {
  onImageUpload?: (file: File, preview: string) => void;
  maxSize?: number; // in MB
  disabled?: boolean;
}

export default function ImageUpload({ 
  onImageUpload = (file, preview) => console.log('Image uploaded:', file.name, preview),
  maxSize = 5, // 5MB default
  disabled = false
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setUploadedFile(file);
      onImageUpload(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'ring-2 ring-primary border-primary' : ''}`}>
      <CardContent className="p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={preview}
                alt="Uploaded crop/plant"
                className="w-full h-48 object-cover rounded-md"
                data-testid="img-preview"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={clearImage}
                disabled={disabled}
                data-testid="button-clear-image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium" data-testid="text-filename">
                {uploadedFile?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {uploadedFile && `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={openFileDialog}
              disabled={disabled}
              data-testid="button-change-image"
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Image
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={disabled ? undefined : openFileDialog}
            data-testid="area-drop-zone"
          >
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">
                  Upload crop/plant photo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag and drop or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  Max size: {maxSize}MB
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button size="sm" disabled={disabled} data-testid="button-upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button size="sm" variant="outline" disabled={disabled} data-testid="button-camera">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Upload images of crops, pests, diseases, or soil conditions for AI analysis
        </p>
      </CardContent>
    </Card>
  );
}