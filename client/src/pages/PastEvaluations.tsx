import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Evaluation } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function PastEvaluations() {
  // Fetch evaluations for user ID 1 (for demo purposes)
  const { data: evaluations, isLoading } = useQuery<Evaluation[]>({
    queryKey: ['/api/evaluations/user/1'],
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Header 
        title="Past Evaluations" 
        description="Review your previous presentation analyses"
        showNewButton={true}
      />
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
          {evaluations.map((evaluation) => (
            <Card key={evaluation.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    <i className="ri-video-line text-xl"></i>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-4">
                    <h3 className="text-lg font-medium text-slate-900">{evaluation.title}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-sm text-slate-500">
                        {new Date(evaluation.createdAt).toLocaleDateString()}
                      </p>
                      {getStatusBadge(evaluation.status)}
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-auto flex items-center space-x-4">
                    {evaluation.status === "completed" && (
                      <div className="text-2xl font-bold text-primary-600">
                        {evaluation.overallScore}%
                      </div>
                    )}
                    <Link href={`/analysis/${evaluation.id}`}>
                      <a className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                        {evaluation.status === "processing" ? "View Progress" : "View Analysis"}
                      </a>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <i className="ri-inbox-line text-3xl"></i>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No evaluations found</h3>
              <p className="text-slate-500 mb-4">You haven't uploaded any presentation videos yet</p>
              <Link href="/upload">
                <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <i className="ri-add-line mr-2"></i>
                  Upload Your First Video
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
