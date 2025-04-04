import { Card, CardContent } from "@/components/ui/card";
import { Evaluation } from "@shared/schema";

interface OverallScoreProps {
  evaluation: Evaluation | null;
}

export default function OverallScore({ evaluation }: OverallScoreProps) {
  if (!evaluation) return null;
  
  if (evaluation.status !== "completed") {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Overall Performance</h2>
          <div className="flex items-center justify-center">
            <div className="p-8 text-center">
              <p className="text-slate-600">
                {evaluation.status === "processing" ? 
                  "Your presentation is being analyzed..." :
                  "Analysis failed. Please try uploading again."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate the dasharray offset for the SVG circle based on the score
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (evaluation.overallScore || 0) / 100 * circumference;
  
  // Generate a performance summary based on the overall score
  const getPerformanceSummary = (score: number) => {
    if (score >= 90) return "Excellent presentation skills! You appear confident and engaging.";
    if (score >= 80) return "Very good presentation with strong delivery and expressions.";
    if (score >= 70) return "Good presentation with room for improvement in body language and eye contact.";
    if (score >= 60) return "Decent presentation, but needs work on confidence and expressions.";
    return "Presentation needs significant improvement in multiple areas.";
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Overall Performance</h2>
        
        {/* Score Display */}
        <div className="flex items-center justify-center">
          <div className="relative w-36 h-36">
            {/* Circular progress indicator */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle 
                cx="50" 
                cy="50" 
                r={radius} 
                fill="none" 
                stroke="#4f46e5" 
                strokeWidth="10" 
                strokeDasharray={circumference} 
                strokeDashoffset={dashOffset} 
                transform="rotate(-90 50 50)" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-900">{evaluation.overallScore}%</span>
            </div>
          </div>
        </div>
        
        {/* Performance Summary */}
        <div className="mt-6 text-center">
          <p className="text-slate-700">
            {getPerformanceSummary(evaluation.overallScore || 0)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
