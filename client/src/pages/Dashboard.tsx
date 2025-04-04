import { Link } from "wouter";
import Header from "@/components/layout/Header";
import { useQuery } from "@tanstack/react-query";
import { Evaluation } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  // Fetch recent evaluations for a fixed user ID (1) for demo
  const { data: evaluations, isLoading } = useQuery<Evaluation[]>({
    queryKey: ['/api/evaluations/user/1'],
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Header 
        title="Presentation Analysis Dashboard" 
        description="Improve your presentation skills with AI-powered feedback"
        showNewButton={true}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-primary-50 text-primary-600 p-3 rounded-full">
                <i className="ri-upload-cloud-line text-3xl"></i>
              </div>
              <h3 className="text-lg font-medium">Upload a Presentation</h3>
              <p className="text-sm text-slate-500">
                Upload a video recording of your presentation for AI analysis and feedback.
              </p>
              <Link href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-2">
                Upload Video
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-primary-50 text-primary-600 p-3 rounded-full">
                <i className="ri-history-line text-3xl"></i>
              </div>
              <h3 className="text-lg font-medium">Past Evaluations</h3>
              <p className="text-sm text-slate-500">
                View your previous presentation evaluations and track your progress.
              </p>
              <Link href="/evaluations" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-2">
                View History
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-primary-50 text-primary-600 p-3 rounded-full">
                <i className="ri-information-line text-3xl"></i>
              </div>
              <h3 className="text-lg font-medium">How It Works</h3>
              <p className="text-sm text-slate-500">
                Our AI analyzes your facial expressions, body language, eye contact, and confidence.
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-2">
                Learn More
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Evaluations</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="ml-auto">
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : evaluations && evaluations.length > 0 ? (
        <div className="space-y-4">
          {evaluations.slice(0, 5).map((evaluation) => (
            <Card key={evaluation.id}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    <i className="ri-video-line text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-900">{evaluation.title}</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center">
                    {evaluation.status === "completed" && (
                      <div className="flex items-center mr-4">
                        <div className="text-2xl font-bold text-primary-600">
                          {evaluation.overallScore}%
                        </div>
                      </div>
                    )}
                    <Link href={`/analysis/${evaluation.id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                      {evaluation.status === "processing" ? "View Progress" : "View Analysis"}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-slate-500">No evaluations found. Upload a video to get started.</p>
            <Link href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-4">
              Upload Video
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
