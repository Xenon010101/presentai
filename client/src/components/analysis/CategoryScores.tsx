import { Card, CardContent } from "@/components/ui/card";
import { Evaluation } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface CategoryScoresProps {
  evaluation: Evaluation | null;
}

export default function CategoryScores({ evaluation }: CategoryScoresProps) {
  if (!evaluation) return null;
  
  const categories = [
    { name: "Confidence", score: evaluation.confidenceScore },
    { name: "Facial Expressions", score: evaluation.facialExpressionsScore },
    { name: "Eye Contact", score: evaluation.eyeContactScore },
    { name: "Body Language", score: evaluation.bodyLanguageScore }
  ];
  
  // Determine color based on score
  const getProgressColor = (score: number | null) => {
    if (!score) return "bg-slate-200";
    if (score >= 80) return "bg-primary-600";
    if (score >= 65) return "bg-amber-500";
    return "bg-red-500";
  };
  
  if (evaluation.status !== "completed") {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Performance Categories</h2>
          <div className="p-4 text-center">
            <p className="text-slate-600">
              {evaluation.status === "processing" ? 
                "Analyzing your presentation..." :
                "Analysis failed. Please try uploading again."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Performance Categories</h2>
        
        {/* Category Score Bars */}
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-700">{category.name}</span>
                <span className="text-sm font-medium text-slate-700">{category.score}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(category.score)}`} 
                  style={{ width: `${category.score || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
