import { useState } from "react";
import Header from "@/components/layout/Header";
import VideoUploader from "@/components/upload/VideoUploader";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function UploadVideo() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleUpload = async (file: File, title: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title || `Presentation ${new Date().toLocaleDateString()}`);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      const response = await fetch("/api/evaluations/upload", {
        method: "POST",
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload video");
      }
      
      setUploadProgress(100);
      
      const data = await response.json();
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and is being processed.",
      });
      
      // Navigate to the analysis page
      setTimeout(() => {
        navigate(`/analysis/${data.id}`);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Header 
        title="Upload Presentation Video" 
        description="Upload your presentation for AI-powered feedback"
      />
      
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Upload Presentation Video</h2>
            
            <VideoUploader 
              onUpload={handleUpload} 
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Tips for better analysis:</h3>
              <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                <li>Ensure good lighting on your face</li>
                <li>Position yourself clearly in the frame</li>
                <li>Record in a quiet environment</li>
                <li>Try to face the camera as much as possible</li>
                <li>Use a tripod or stable surface for recording</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
