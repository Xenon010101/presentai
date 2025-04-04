import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Evaluation } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  evaluation: Evaluation | null;
  videoUrl: string;
}

export default function VideoPlayer({ evaluation, videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'positive' | 'negative' | 'neutral';
    message: string;
  } | null>(null);
  const [activeArea, setActiveArea] = useState<'expressions' | 'eyeContact' | 'bodyLanguage' | 'confidence'>('expressions');
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Update current time and playing state while video is playing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);
  
  // Get feedback based on timestamp and selected area
  useEffect(() => {
    if (!videoRef.current || !evaluation || evaluation.status !== "completed") return;
    
    // Show different feedback based on timestamp and selected area
    const checkForFeedback = () => {
      const time = videoRef.current?.currentTime || 0;
      
      // Get feedback from evaluation feedback array based on timestamp
      const relevantFeedback = evaluation.feedback?.find(item => {
        // Find feedback within 3 seconds of current timestamp
        return item.timestamp !== undefined && 
               Math.abs(item.timestamp - time) < 3;
      });
      
      if (relevantFeedback) {
        setFeedback({
          type: relevantFeedback.type,
          message: relevantFeedback.message
        });
      } else {
        // Generate contextual feedback based on selected area if no timestamp feedback
        switch (activeArea) {
          case 'expressions':
            if (time < 5) setFeedback({ type: 'positive', message: "Good facial expressions during your introduction." });
            else if (time < 15) setFeedback({ type: 'neutral', message: "Try varying your expressions more when explaining concepts." });
            else setFeedback(null);
            break;
          case 'eyeContact':
            if (time < 10) setFeedback({ type: 'negative', message: "You're looking down too often during this section." });
            else if (time < 20) setFeedback({ type: 'positive', message: "Excellent eye contact during this key point." });
            else setFeedback(null);
            break;
          case 'bodyLanguage':
            if (time < 8) setFeedback({ type: 'neutral', message: "Your posture is good but gestures could be more expressive." });
            else if (time < 18) setFeedback({ type: 'positive', message: "Great hand gestures to emphasize this key point." });
            else setFeedback(null);
            break;
          case 'confidence':
            if (time < 5) setFeedback({ type: 'positive', message: "Strong, confident start to your presentation." });
            else if (time < 15) setFeedback({ type: 'negative', message: "You seem hesitant during the technical explanation." });
            else setFeedback(null);
            break;
        }
      }
    };
    
    const interval = setInterval(checkForFeedback, 1000);
    return () => clearInterval(interval);
  }, [evaluation, activeArea]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Playback controls
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    video.currentTime = pos * video.duration;
  };
  
  const skipBackward = () => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.max(0, video.currentTime - 10);
  };
  
  const skipForward = () => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };
  
  const handleVolumeChange = (newValue: number[]) => {
    const video = videoRef.current;
    if (video) {
      const volumeValue = newValue[0];
      setVolume(volumeValue);
      video.volume = volumeValue / 100;
    }
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (video) {
      setPlaybackRate(rate);
      video.playbackRate = rate;
    }
  };
  
  // Get feedback icon based on type
  const getFeedbackIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <i className="ri-emotion-happy-line text-green-500 mr-2 text-lg"></i>;
      case 'negative':
        return <i className="ri-emotion-unhappy-line text-amber-500 mr-2 text-lg"></i>;
      default:
        return <i className="ri-emotion-normal-line text-blue-500 mr-2 text-lg"></i>;
    }
  };
  
  // Generate feedback markers for timeline
  const generateTimelineMarkers = () => {
    if (!evaluation || !evaluation.feedback || evaluation.status !== "completed") return null;
    
    return evaluation.feedback
      .filter(item => item.timestamp !== undefined)
      .map((item, index) => {
        const position = (item.timestamp! / (duration || 100)) * 100;
        const color = item.type === 'positive' ? 'bg-green-500' 
                    : item.type === 'negative' ? 'bg-amber-500' 
                    : 'bg-blue-500';
        
        return (
          <div 
            key={index}
            className={`absolute h-full w-1 ${color} rounded-full hover:w-2 transition-all cursor-pointer`} 
            style={{ left: `${position}%` }}
            title={item.message}
            onClick={() => {
              if (videoRef.current) videoRef.current.currentTime = item.timestamp!;
            }}
          />
        );
      });
  };
  
  if (!evaluation) return null;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-slate-900">Video Analysis</h2>
          <Badge variant={evaluation.status === "completed" ? "default" : "outline"} className="capitalize">
            {evaluation.status}
          </Badge>
        </div>
        
        {/* Analysis Focus Tabs */}
        <Tabs defaultValue="expressions" className="mb-4" onValueChange={(value) => setActiveArea(value as any)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="expressions">Expressions</TabsTrigger>
            <TabsTrigger value="eyeContact">Eye Contact</TabsTrigger>
            <TabsTrigger value="bodyLanguage">Body Language</TabsTrigger>
            <TabsTrigger value="confidence">Confidence</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Video Player with Overlay */}
        <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
          <video 
            ref={videoRef}
            className="w-full h-full" 
            src={videoUrl}
            controlsList="nodownload"
          />
          
          {/* Feedback overlay */}
          {feedback && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
              <div className="flex items-center">
                {getFeedbackIcon(feedback.type)}
                <p>{feedback.message}</p>
              </div>
            </div>
          )}
          
          {/* Video controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
            {/* Progress bar */}
            <div 
              className="h-2 bg-slate-600 rounded-full relative mb-4 cursor-pointer"
              onClick={handleSeek}
            >
              {/* Progress indicator */}
              <div 
                className="absolute h-full bg-primary-500 rounded-l-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              
              {/* Current position indicator */}
              <div 
                className="absolute h-4 w-4 bg-white border-2 border-primary-500 rounded-full -translate-y-1/4"
                style={{ left: `${(currentTime / duration) * 100}%`, top: '50%' }}
              />
              
              {/* Timeline markers (feedback points) */}
              <div className="absolute top-0 left-0 h-full w-full">
                {generateTimelineMarkers()}
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20"
                  onClick={skipBackward}
                >
                  <i className="ri-rewind-mini-fill text-lg"></i>
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-10 w-10 rounded-full p-0 text-white hover:bg-white/20"
                  onClick={togglePlayPause}
                >
                  {isPlaying 
                    ? <i className="ri-pause-fill text-2xl"></i>
                    : <i className="ri-play-fill text-2xl"></i>
                  }
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20"
                  onClick={skipForward}
                >
                  <i className="ri-speed-mini-fill text-lg"></i>
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Volume control */}
                <div className="flex items-center space-x-2 w-24">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20"
                    onClick={() => handleVolumeChange([volume === 0 ? 100 : 0])}
                  >
                    {volume === 0 
                      ? <i className="ri-volume-mute-fill text-lg"></i>
                      : volume < 50 
                        ? <i className="ri-volume-down-fill text-lg"></i>
                        : <i className="ri-volume-up-fill text-lg"></i>
                    }
                  </Button>
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-16"
                  />
                </div>
                
                {/* Playback rate */}
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-8 p-0 text-xs rounded ${playbackRate === 0.5 ? 'bg-white/30' : 'text-white hover:bg-white/20'}`}
                    onClick={() => handlePlaybackRateChange(0.5)}
                  >
                    0.5x
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-8 p-0 text-xs rounded ${playbackRate === 1 ? 'bg-white/30' : 'text-white hover:bg-white/20'}`}
                    onClick={() => handlePlaybackRateChange(1)}
                  >
                    1x
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-8 p-0 text-xs rounded ${playbackRate === 1.5 ? 'bg-white/30' : 'text-white hover:bg-white/20'}`}
                    onClick={() => handlePlaybackRateChange(1.5)}
                  >
                    1.5x
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-8 p-0 text-xs rounded ${playbackRate === 2 ? 'bg-white/30' : 'text-white hover:bg-white/20'}`}
                    onClick={() => handlePlaybackRateChange(2)}
                  >
                    2x
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Analysis Focus Description */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-sm font-medium text-slate-800 mb-1">
            {activeArea === 'expressions' && "Analyzing Facial Expressions"}
            {activeArea === 'eyeContact' && "Analyzing Eye Contact"}
            {activeArea === 'bodyLanguage' && "Analyzing Body Language"}
            {activeArea === 'confidence' && "Analyzing Confidence Indicators"}
          </h3>
          <p className="text-xs text-slate-600">
            {activeArea === 'expressions' && "Watch for facial expressions that engage your audience. Vary your expressions to match your content and maintain interest."}
            {activeArea === 'eyeContact' && "Good eye contact builds trust with your audience. Watch for consistent engagement and avoid looking down too frequently."}
            {activeArea === 'bodyLanguage' && "Effective body language reinforces your message. Notice your posture, hand gestures, and movement patterns."}
            {activeArea === 'confidence' && "Confident presenters appear prepared and knowledgeable. Pay attention to voice steadiness, posture, and deliberate movements."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
