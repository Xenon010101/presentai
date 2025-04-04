import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Evaluation } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Chart from "chart.js/auto";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

interface DetailedAnalysisProps {
  evaluation: Evaluation | null;
}

export default function DetailedAnalysis({ evaluation }: DetailedAnalysisProps) {
  const expressionChartRef = useRef<HTMLCanvasElement>(null);
  const timelineChartRef = useRef<HTMLCanvasElement>(null);
  const gazeChartRef = useRef<HTMLCanvasElement>(null);
  const [expressionChart, setExpressionChart] = useState<Chart | null>(null);
  const [timelineChart, setTimelineChart] = useState<Chart | null>(null);
  const [gazeChart, setGazeChart] = useState<Chart | null>(null);
  const [activeTab, setActiveTab] = useState("facial");
  
  // Setup charts
  useEffect(() => {
    if (!evaluation || evaluation.status !== "completed" || !evaluation.analysisDetails) return;
    
    // Clean up previous charts
    if (expressionChart) expressionChart.destroy();
    if (timelineChart) timelineChart.destroy();
    if (gazeChart) gazeChart.destroy();
    
    // Setup expression distribution chart
    if (expressionChartRef.current && activeTab === "facial") {
      const expressionDistribution = evaluation.analysisDetails.expressionDistribution;
      const ctx = expressionChartRef.current.getContext('2d');
      
      if (ctx) {
        const newExpressionChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Neutral', 'Happy', 'Sad', 'Angry', 'Fearful', 'Disgusted', 'Surprised'],
            datasets: [{
              data: [
                expressionDistribution.neutral,
                expressionDistribution.happy,
                expressionDistribution.sad,
                expressionDistribution.angry,
                expressionDistribution.fearful,
                expressionDistribution.disgusted,
                expressionDistribution.surprised
              ],
              backgroundColor: [
                '#64748b', // neutral
                '#10b981', // happy
                '#6366f1', // sad
                '#ef4444', // angry
                '#f59e0b', // fearful
                '#8b5cf6', // disgusted
                '#06b6d4'  // surprised
              ],
              borderWidth: 1,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  font: {
                    family: 'Poppins',
                    size: 12
                  },
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: 12,
                titleFont: {
                  family: 'Poppins',
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  family: 'Poppins',
                  size: 13
                }
              }
            },
            cutout: '65%',
            radius: '90%'
          }
        });
        
        setExpressionChart(newExpressionChart);
      }
    }
    
    // Setup timeline chart
    if (timelineChartRef.current) {
      const timeline = evaluation.analysisDetails.timeline;
      const ctx = timelineChartRef.current.getContext('2d');
      
      if (ctx) {
        const newTimelineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: timeline.map(point => point.time),
            datasets: [{
              label: 'Confidence',
              data: timeline.map(point => point.confidence),
              borderColor: 'rgb(124, 58, 237)',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: 'rgb(124, 58, 237)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointHoverRadius: 6,
              pointHoverBorderWidth: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: 12,
                titleFont: {
                  family: 'Poppins',
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  family: 'Poppins',
                  size: 13
                },
                callbacks: {
                  label: function(context) {
                    return `Confidence: ${context.parsed.y}%`;
                  }
                }
              }
            }
          }
        });
        
        setTimelineChart(newTimelineChart);
      }
    }
    
    // Setup gaze chart if tab is eye contact
    if (gazeChartRef.current && activeTab === "eye") {
      const ctx = gazeChartRef.current.getContext('2d');
      
      if (ctx) {
        // Simulated gaze data 
        const gazeData = {
          centered: 65,
          left: 15,
          right: 12,
          up: 5,
          down: 3
        };
        
        const newGazeChart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['Center', 'Left', 'Right', 'Up', 'Down'],
            datasets: [{
              label: 'Gaze Direction',
              data: [gazeData.centered, gazeData.left, gazeData.right, gazeData.up, gazeData.down],
              backgroundColor: 'rgba(124, 58, 237, 0.2)',
              borderColor: 'rgb(124, 58, 237)',
              pointBackgroundColor: 'rgb(124, 58, 237)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(124, 58, 237)',
              borderWidth: 2,
              pointRadius: 5,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  display: false,
                  stepSize: 20
                },
                pointLabels: {
                  font: {
                    family: 'Poppins',
                    size: 12,
                    weight: 'bold'
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: 12,
                titleFont: {
                  family: 'Poppins',
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  family: 'Poppins',
                  size: 13
                }
              }
            }
          }
        });
        
        setGazeChart(newGazeChart);
      }
    }
    
    return () => {
      if (expressionChart) expressionChart.destroy();
      if (timelineChart) timelineChart.destroy();
      if (gazeChart) gazeChart.destroy();
    };
  }, [evaluation, activeTab]);
  
  if (!evaluation) return null;
  
  if (evaluation.status !== "completed" || !evaluation.analysisDetails) {
    return (
      <Card className="card overflow-hidden animate-fadeIn">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Detailed Analysis</h2>
          <div className="p-6 text-center">
            {evaluation.status === "processing" ? (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
                  <i className="ri-loader-4-line text-4xl text-indigo-600 animate-spin"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Analyzing Your Presentation</h3>
                <p className="text-slate-600 mb-6">
                  Our AI is analyzing your presentation data to provide comprehensive feedback...
                </p>
                <Progress value={65} className="h-2 w-full max-w-md mx-auto progress-modern" />
                <p className="text-xs text-slate-500 mt-2">This may take a few minutes</p>
              </div>
            ) : (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
                  <i className="ri-error-warning-line text-4xl text-indigo-600"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Analysis Not Available</h3>
                <p className="text-slate-600">
                  Detailed analysis couldn't be completed for this presentation.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="card overflow-hidden animate-fadeIn">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Detailed Analysis</h2>
            <p className="text-slate-600">Comprehensive breakdown of your presentation performance</p>
          </div>
          
          {/* Overall Score Badge */}
          <div className="mt-4 md:mt-0 flex items-center glass px-4 py-2 rounded-full">
            <div className="text-sm font-medium text-slate-700 mr-2">Overall Score:</div>
            <div className="w-10 h-10 score-circle flex items-center justify-center" 
                 style={{ '--percentage': `${evaluation.overallScore}%` } as React.CSSProperties}>
              <span className="score-value text-sm">{evaluation.overallScore}</span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="facial" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-4 lg:w-3/4 mx-auto">
            <TabsTrigger value="facial" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10">
              <i className="ri-emotion-happy-line mr-2 text-lg"></i>
              Facial Expressions
            </TabsTrigger>
            <TabsTrigger value="eye" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10">
              <i className="ri-eye-line mr-2 text-lg"></i>
              Eye Contact
            </TabsTrigger>
            <TabsTrigger value="body" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10">
              <i className="ri-user-line mr-2 text-lg"></i>
              Body Language
            </TabsTrigger>
            <TabsTrigger value="confidence" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-indigo-500/10">
              <i className="ri-award-line mr-2 text-lg"></i>
              Confidence
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="facial" className="animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Expression Distribution Chart */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Expression Distribution</h3>
                <div className="text-sm text-slate-600 mb-4">
                  Breakdown of facial expressions used during your presentation
                </div>
                <div className="h-72 p-4">
                  <canvas ref={expressionChartRef}></canvas>
                </div>
                <div className="mt-4">
                  <Badge className="badge-modern">Score: {evaluation.facialExpressionsScore}%</Badge>
                </div>
              </div>
              
              {/* Facial Expression Timeline */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Confidence Timeline</h3>
                <div className="text-sm text-slate-600 mb-4">
                  How your confidence level varied throughout the presentation
                </div>
                <div className="h-72 p-4">
                  <canvas ref={timelineChartRef}></canvas>
                </div>
                <div className="mt-4">
                  <Badge className="badge-modern">Average: {evaluation.confidenceScore}%</Badge>
                </div>
              </div>
            </div>
            
            {/* Expression Analysis */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Detailed Feedback</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                      <i className="ri-emotion-happy-line text-xl"></i>
                    </div>
                    <h4 className="text-base font-medium">Strengths</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Your natural smile during the introduction created a positive first impression</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Good expressiveness when explaining key findings at 2:15</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Appropriate facial reactions when addressing audience questions</span>
                    </li>
                  </ul>
                </div>
                
                <div className="card p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                      <i className="ri-emotion-normal-line text-xl"></i>
                    </div>
                    <h4 className="text-base font-medium">Areas for Improvement</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-arrow-right-line text-amber-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Your expressions appeared neutral for extended periods (1:30-3:45)</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-arrow-right-line text-amber-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Try varying your expressions more during technical explanations</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-arrow-right-line text-amber-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Practice using expressions to emphasize important points</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 glass p-6 rounded-xl animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <h4 className="text-base font-medium mb-3">Practical Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <p className="text-sm text-slate-700">Practice in front of a mirror to become more aware of your facial expressions</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <p className="text-sm text-slate-700">Add expression cues to your presentation notes</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <p className="text-sm text-slate-700">Watch videos of engaging speakers and note their expression patterns</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <p className="text-sm text-slate-700">Record practice sessions to identify your default expression</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="eye" className="animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Eye Contact Percentage */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Eye Contact Analysis</h3>
                <div className="text-sm text-slate-600 mb-6">
                  Percentage of time maintaining effective eye contact
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-600/10 flex items-center justify-center">
                      <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                            {evaluation.eyeContactScore || 65}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Badge className="badge-modern">
                      {(evaluation.eyeContactScore || 0) > 80 ? "Excellent" : 
                       (evaluation.eyeContactScore || 0) > 70 ? "Good" :
                       (evaluation.eyeContactScore || 0) > 55 ? "Average" : "Needs Improvement"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Gaze Direction Chart */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Gaze Direction</h3>
                <div className="text-sm text-slate-600 mb-4">
                  Distribution of where you were looking during the presentation
                </div>
                <div className="h-72 p-4">
                  <canvas ref={gazeChartRef}></canvas>
                </div>
                <div className="mt-4 text-center">
                  <Badge className="badge-modern">Target: Center 70%+</Badge>
                </div>
              </div>
            </div>
            
            {/* Eye Contact Feedback */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Eye Contact Feedback</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                      <i className="ri-eye-line text-xl"></i>
                    </div>
                    <h4 className="text-base font-medium">Strengths</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Good eye contact during your opening statement</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Maintained connection when addressing key points</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Effective scanning of different areas of the audience</span>
                    </li>
                  </ul>
                </div>
                
                <div className="card p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                      <i className="ri-eye-off-line text-xl"></i>
                    </div>
                    <h4 className="text-base font-medium">Areas for Improvement</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-arrow-right-line text-amber-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Tendency to look down at notes too frequently</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-arrow-right-line text-amber-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Lacked eye contact during technical explanations</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-arrow-right-line text-amber-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Avoided audience eye contact when handling questions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-lg animate-fadeIn">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center mr-3">
                    <i className="ri-user-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Posture Analysis</h3>
                    <p className="text-sm text-slate-600">Score: {evaluation.bodyLanguageScore}%</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Upright Posture</span>
                      <span className="text-sm text-slate-500">78%</span>
                    </div>
                    <Progress value={78} className="h-2 progress-modern" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Shoulder Position</span>
                      <span className="text-sm text-slate-500">65%</span>
                    </div>
                    <Progress value={65} className="h-2 progress-modern" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Stance Stability</span>
                      <span className="text-sm text-slate-500">82%</span>
                    </div>
                    <Progress value={82} className="h-2 progress-modern" />
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge className="badge-modern">Good Posture</Badge>
                  <Badge className="badge-modern">Occasional Leaning</Badge>
                  <Badge className="badge-modern">Stable Stance</Badge>
                </div>
              </div>
              
              <div className="glass p-6 rounded-lg animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center mr-3">
                    <i className="ri-hand-coin-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Gesture Analysis</h3>
                    <p className="text-sm text-slate-600">Effectiveness of hand movements</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Natural Gestures</span>
                      <span className="text-sm text-slate-500">72%</span>
                    </div>
                    <Progress value={72} className="h-2 progress-modern" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Purposeful Movement</span>
                      <span className="text-sm text-slate-500">60%</span>
                    </div>
                    <Progress value={60} className="h-2 progress-modern" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Minimal Fidgeting</span>
                      <span className="text-sm text-slate-500">55%</span>
                    </div>
                    <Progress value={55} className="h-2 progress-modern" />
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge className="badge-modern">Emphatic Gestures</Badge>
                  <Badge className="badge-modern">Some Fidgeting</Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-8 card p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Body Language Feedback</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base font-medium mb-3">Key Observations</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Good upright posture maintained throughout most of your presentation</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-close-line text-red-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Hand fidgeting noticed when addressing complex questions</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Effective use of gestures to emphasize key points</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-close-line text-red-500 mr-2 mt-1"></i>
                      <span className="text-sm text-slate-700">Limited movement around the presentation space</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-base font-medium mb-3">Improvement Strategies</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <span className="text-sm text-slate-700">Practice purposeful gestures that reinforce your message</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <span className="text-sm text-slate-700">Reduce unconscious fidgeting by keeping hands in ready position</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-xs font-bold">3</span>
                      </div>
                      <span className="text-sm text-slate-700">Plan strategic movement across the stage to engage different parts of the audience</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-xs font-bold">4</span>
                      </div>
                      <span className="text-sm text-slate-700">Record and review your presentation focusing only on body language</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="confidence">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Confidence Score</h3>
                <div className="text-sm text-slate-600 mb-6">
                  Overall confidence level throughout your presentation
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative w-52 h-52">
                    <div className="w-full h-full score-circle flex items-center justify-center" 
                         style={{ '--percentage': `${evaluation.confidenceScore || 75}%` } as React.CSSProperties}>
                      <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
                        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                          {evaluation.confidenceScore || 75}
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                      <svg viewBox="0 0 120 120" width="120" height="120">
                        <path d="M60,10 A50,50 0 0,1 110,60" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
                        <path d="M110,60 A50,50 0 0,1 60,110" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
                        <path d="M60,110 A50,50 0 0,1 10,60" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
                        <path d="M10,60 A50,50 0 0,1 60,10" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Badge className="badge-modern">
                      {(evaluation.confidenceScore || 0) > 80 ? "Highly Confident" : 
                       (evaluation.confidenceScore || 0) > 70 ? "Confident" :
                       (evaluation.confidenceScore || 0) > 55 ? "Somewhat Confident" : "Needs Improvement"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="card p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Confidence Factors</h3>
                <div className="text-sm text-slate-600 mb-6">
                  Breakdown of elements affecting your perceived confidence
                </div>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Voice Steadiness</span>
                      <span className="text-sm text-slate-500">75%</span>
                    </div>
                    <Progress value={75} className="h-3 progress-modern" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Posture</span>
                      <span className="text-sm text-slate-500">82%</span>
                    </div>
                    <Progress value={82} className="h-3 progress-modern" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Eye Contact</span>
                      <span className="text-sm text-slate-500">{evaluation.eyeContactScore || 65}%</span>
                    </div>
                    <Progress value={evaluation.eyeContactScore || 65} className="h-3 progress-modern" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Delivery Pace</span>
                      <span className="text-sm text-slate-500">68%</span>
                    </div>
                    <Progress value={68} className="h-3 progress-modern" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Handling Questions</span>
                      <span className="text-sm text-slate-500">72%</span>
                    </div>
                    <Progress value={72} className="h-3 progress-modern" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="glass p-6 rounded-xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold mb-4">Confidence Building Strategies</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card p-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                        <i className="ri-user-voice-line text-lg"></i>
                      </div>
                      <h5 className="font-medium">Vocal Technique</h5>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Practice diaphragmatic breathing</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Record yourself to monitor vocal patterns</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Use strategic pauses for emphasis</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="card p-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                        <i className="ri-mental-health-line text-lg"></i>
                      </div>
                      <h5 className="font-medium">Mental Preparation</h5>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Visualize successful presentation</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Practice positive self-talk</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Use pre-presentation relaxation techniques</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="card p-4 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                        <i className="ri-presentation-line text-lg"></i>
                      </div>
                      <h5 className="font-medium">Practice Habits</h5>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Rehearse in front of others regularly</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Record and review your presentations</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-arrow-right-line text-purple-500 mr-1.5 mt-0.5"></i>
                        <span>Practice answers to likely questions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <div className="flex gap-3">
            <Link href="/evaluations" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              View All Evaluations
            </Link>
            <Link href="/upload" className="btn-primary text-sm px-4 py-2 rounded-lg">
              <i className="ri-add-line mr-1"></i>
              Analyze Another Video
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
