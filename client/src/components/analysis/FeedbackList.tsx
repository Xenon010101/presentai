import { Card, CardContent } from "@/components/ui/card";
import { Evaluation, FeedbackItem } from "@shared/schema";

interface FeedbackListProps {
  evaluation: Evaluation | null;
}

export default function FeedbackList({ evaluation }: FeedbackListProps) {
  if (!evaluation) return null;
  
  if (evaluation.status !== "completed" || !evaluation.feedback) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Key Feedback</h2>
          <div className="p-4 text-center">
            <p className="text-slate-600">
              {evaluation.status === "processing" ? 
                "Generating feedback..." :
                "No feedback available."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get icon based on feedback type
  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <i className="ri-checkbox-circle-line text-green-500 text-xl"></i>;
      case "negative":
        return <i className="ri-error-warning-line text-amber-500 text-xl"></i>;
      default:
        return <i className="ri-information-line text-blue-500 text-xl"></i>;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Key Feedback</h2>
        
        <div className="space-y-4">
          {evaluation.feedback.map((item: FeedbackItem, index: number) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0">
                {getFeedbackIcon(item.type)}
              </div>
              <div className="ml-3">
                <p className="text-sm text-slate-700">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
