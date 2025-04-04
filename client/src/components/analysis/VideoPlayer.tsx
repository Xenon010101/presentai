import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Evaluation } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface VideoPlayerProps {
  evaluation: Evaluation | null;
  videoUrl: string;
}

export default function VideoPlayer({ evaluation, videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Update current time while video is playing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);
  
  // Simulate feedback at certain timestamps
  useEffect(() => {
    if (!videoRef.current || !evaluation) return;
    
    // Show different feedback based on timestamp
    const checkForFeedback = () => {
      const time = videoRef.current?.currentTime || 0;
      
      if (time < 5) {
        setFeedback("Good opening posture, maintain eye contact.");
      } else if (time < 10) {
        setFeedback("Try to reduce hand fidgeting to appear more confident.");
      } else if (time < 15) {
        setFeedback("Good smile! Keep up the positive expression.");
      } else if (time < 20) {
        setFeedback("Excellent use of gestures to emphasize your point.");
      } else {
        setFeedback(null);
      }
    };
    
    const interval = setInterval(checkForFeedback, 1000);
    return () => clearInterval(interval);
  }, [evaluation]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!evaluation) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-slate-900">Video Analysis</h2>
          <Badge variant={evaluation.status === "completed" ? "default" : "outline"} className="capitalize">
            {evaluation.status}
          </Badge>
        </div>
        
        {/* Video Player */}
        <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
          <video 
            ref={videoRef}
            className="w-full h-full" 
            src={videoUrl}
            controls
            controlsList="nodownload"
          />
          
          {/* Feedback overlay */}
          {feedback && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
              <div className="flex items-center">
                <i className="ri-emotion-happy-line text-green-500 mr-2 text-lg"></i>
                <p>{feedback}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Timeline */}
        <div className="mt-4 px-2">
          <div className="h-6 bg-slate-100 rounded-full relative">
            {/* Progress indicator */}
            <div 
              className="absolute h-full bg-primary-200 bg-opacity-50 rounded-l-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            
            {/* Current position indicator */}
            <div 
              className="absolute h-full w-1 bg-primary-600 rounded-full"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
            
            {/* Timeline markers (simulated feedback points) */}
            <div className="absolute top-0 left-0 h-full w-full">
              <div className="absolute h-full w-1 bg-green-500 rounded-full" style={{ left: '15%' }}></div>
              <div className="absolute h-full w-1 bg-amber-500 rounded-full" style={{ left: '35%' }}></div>
              <div className="absolute h-full w-1 bg-red-500 rounded-full" style={{ left: '60%' }}></div>
              <div className="absolute h-full w-1 bg-green-500 rounded-full" style={{ left: '80%' }}></div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
