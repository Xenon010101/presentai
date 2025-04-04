import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface VideoUploaderProps {
  onUpload: (file: File, title: string) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export default function VideoUploader({ onUpload, isUploading, uploadProgress }: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      }
    }
  };
  
  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = () => {
    if (file) {
      onUpload(file, title);
    }
  };
  
  return (
    <div className="space-y-4">
      {!file ? (
        <>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUploadArea}
          >
            <i className="ri-upload-cloud-2-line text-5xl text-slate-400 mb-4"></i>
            <p className="text-slate-600 mb-2">Drag and drop your video here or</p>
            <button 
              type="button" 
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-md bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Select File
            </button>
            <p className="text-xs text-slate-500 mt-2">Supported formats: .mp4, .mov, .webm (Max size: 200MB)</p>
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
            />
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                <i className="ri-video-line"></i>
              </div>
              <div className="ml-3 flex-1 truncate">
                <p className="text-sm font-medium text-primary-900 truncate">{file.name}</p>
                <p className="text-xs text-primary-700">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button 
                type="button"
                className="ml-2 text-primary-600 hover:text-primary-800"
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Presentation Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your presentation"
              disabled={isUploading}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-slate-700">Uploading...</span>
            <span className="text-sm font-medium text-slate-700">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  );
}
