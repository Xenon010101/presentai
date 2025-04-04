import { useEffect } from "react";
import { useParams } from "wouter";
import Header from "@/components/layout/Header";
import { useAnalysis } from "@/contexts/AnalysisContext";
import VideoPlayer from "@/components/analysis/VideoPlayer";
import OverallScore from "@/components/analysis/OverallScore";
import CategoryScores from "@/components/analysis/CategoryScores";
import FeedbackList from "@/components/analysis/FeedbackList";
import DetailedAnalysis from "@/components/analysis/DetailedAnalysis";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function VideoAnalysis() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);
  
  const { setCurrentEvaluationId, evaluation, isLoading, error, refetchEvaluation } = useAnalysis();
  
  // Poll for updates if the evaluation is still processing
  useEffect(() => {
    setCurrentEvaluationId(id);
    
    let intervalId: number | undefined;
    
    if (evaluation && evaluation.status === "processing") {
      intervalId = window.setInterval(() => {
        refetchEvaluation();
      }, 3000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, evaluation?.status, setCurrentEvaluationId, refetchEvaluation]);
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "An error occurred while fetching the evaluation."}
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <p className="text-slate-600 mt-4">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Header 
        title={isLoading ? "Loading..." : `Analysis: ${evaluation?.title || "Presentation"}`}
        description="AI-powered feedback on your presentation"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video and Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-40 mb-4" />
                <Skeleton className="aspect-video rounded-lg" />
              </CardContent>
            </Card>
          ) : (
            <VideoPlayer
              evaluation={evaluation}
              videoUrl={evaluation?.videoUrl || ""}
            />
          )}
        </div>
        
        {/* Scores and Feedback */}
        <div className="lg:col-span-1 space-y-6">
          {isLoading ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-40 mb-4" />
                  <Skeleton className="h-36 w-36 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-40 mb-4" />
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <OverallScore evaluation={evaluation} />
              <CategoryScores evaluation={evaluation} />
              <FeedbackList evaluation={evaluation} />
            </>
          )}
        </div>
      </div>
      
      {/* Detailed Analysis */}
      <div className="mt-6">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-40 mb-4" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
          </Card>
        ) : (
          <DetailedAnalysis evaluation={evaluation} />
        )}
      </div>
    </div>
  );
}
