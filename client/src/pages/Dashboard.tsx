import { Link } from "wouter";
import Header from "@/components/layout/Header";
import { useQuery } from "@tanstack/react-query";
import { Evaluation } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  // Fetch recent evaluations for a fixed user ID (1) for demo
  const { data: evaluations, isLoading } = useQuery<Evaluation[]>({
    queryKey: ['/api/evaluations/user/1'],
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="animate-fadeIn">
        <Header 
          title="Presentation Analysis Dashboard" 
          description="Enhance your speaking skills with AI-powered feedback"
          showNewButton={true}
        />
        
        {/* Hero Section with Gradient Background */}
        <div className="relative rounded-2xl overflow-hidden mb-10 animate-fadeIn">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-600 opacity-90"></div>
          <div className="relative z-10 px-6 py-12 md:py-16 md:px-12 text-white">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Elevate Your Presentation Skills</h1>
              <p className="text-xl md:text-2xl mb-6 text-white/90">
                Get detailed analysis and actionable feedback on your presentation performance
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/upload" className="btn-primary px-6 py-3 text-white font-medium rounded-lg">
                  <i className="ri-upload-cloud-line mr-2"></i>
                  Analyze New Video
                </Link>
                <button className="px-6 py-3 text-white font-medium rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
                  <i className="ri-information-line mr-2"></i>
                  How It Works
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-[20%] right-[10%] w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-[60%] right-[20%] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute bottom-[20%] left-[15%] w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
        </div>
        
        {/* Feature Cards with Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <Card className="card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg mb-2">
                  <i className="ri-emotion-happy-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold">Facial Expression Analysis</h3>
                <p className="text-slate-600">
                  Our AI analyzes your facial expressions to measure audience engagement and emotional impact.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="badge-modern">Happiness Detection</Badge>
                  <Badge className="badge-modern">Engagement Metrics</Badge>
                  <Badge className="badge-modern">Expression Timing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg mb-2">
                  <i className="ri-eye-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold">Eye Contact & Body Language</h3>
                <p className="text-slate-600">
                  Track your eye contact patterns and body language to build stronger connection with your audience.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="badge-modern">Gaze Tracking</Badge>
                  <Badge className="badge-modern">Posture Analysis</Badge>
                  <Badge className="badge-modern">Gesture Recognition</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg mb-2">
                  <i className="ri-chat-smile-3-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold">Confidence Scoring</h3>
                <p className="text-slate-600">
                  Get detailed feedback on your confidence levels and practical tips to improve your delivery.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="badge-modern">Confidence Metrics</Badge>
                  <Badge className="badge-modern">Improvement Tips</Badge>
                  <Badge className="badge-modern">Detailed Timeline</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent Evaluations Section */}
      <div className="mt-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Evaluations</h2>
          <Link href="/evaluations" className="text-primary-600 font-medium hover:underline flex items-center">
            <span>View All</span>
            <i className="ri-arrow-right-line ml-1"></i>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="ml-4 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="ml-auto">
                      <Skeleton className="h-10 w-28 rounded-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : evaluations && evaluations.length > 0 ? (
          <div className="space-y-4">
            {evaluations.slice(0, 5).map((evaluation, index) => (
              <Card key={evaluation.id} className="overflow-hidden animate-slideIn card" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                      <i className="ri-vidicon-line text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{evaluation.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <i className="ri-calendar-line mr-1.5"></i>
                        <span>{new Date(evaluation.createdAt).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                        <span className="mx-2">•</span>
                        <Badge variant={evaluation.status === "completed" ? "default" : "outline"} className="capitalize">
                          {evaluation.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="sm:ml-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-3 sm:mt-0">
                      {evaluation.status === "completed" && (
                        <div className="flex items-center">
                          <div className="w-16 h-16 score-circle flex items-center justify-center" 
                               style={{ '--percentage': `${evaluation.overallScore}%` } as React.CSSProperties}>
                            <span className="score-value">{evaluation.overallScore}</span>
                          </div>
                        </div>
                      )}
                      <Link href={`/analysis/${evaluation.id}`} className="btn-primary px-4 py-2 rounded-lg">
                        {evaluation.status === "processing" ? (
                          <><i className="ri-loader-4-line animate-spin mr-1.5"></i> View Progress</>
                        ) : (
                          <><i className="ri-bar-chart-2-line mr-1.5"></i> View Analysis</>
                        )}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass animate-fadeIn">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
                <i className="ri-upload-cloud-line text-4xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">No Evaluations Yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Upload your first presentation video to receive detailed AI analysis and actionable feedback.
              </p>
              <Link href="/upload" className="btn-primary px-6 py-3 rounded-lg">
                <i className="ri-add-line mr-2"></i>
                Upload Your First Video
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Stats Section */}
      <div className="mt-16 mb-10 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Why Use AI Presentation Coach?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">93%</div>
              <p className="text-gray-600">Users report improved confidence after just 3 analyses</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">85%</div>
              <p className="text-gray-600">Increased audience engagement reported by presenters</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">4.8/5</div>
              <p className="text-gray-600">Average user rating for feedback accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
