import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Evaluation } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chart from "chart.js/auto";

interface DetailedAnalysisProps {
  evaluation: Evaluation | null;
}

export default function DetailedAnalysis({ evaluation }: DetailedAnalysisProps) {
  const expressionChartRef = useRef<HTMLCanvasElement>(null);
  const timelineChartRef = useRef<HTMLCanvasElement>(null);
  const [expressionChart, setExpressionChart] = useState<Chart | null>(null);
  const [timelineChart, setTimelineChart] = useState<Chart | null>(null);
  
  // Setup charts
  useEffect(() => {
    if (!evaluation || evaluation.status !== "completed" || !evaluation.analysisDetails) return;
    
    // Clean up previous charts
    if (expressionChart) expressionChart.destroy();
    if (timelineChart) timelineChart.destroy();
    
    // Setup expression distribution chart
    if (expressionChartRef.current) {
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
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
              }
            }
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
              borderColor: '#4f46e5',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.3,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }
        });
        
        setTimelineChart(newTimelineChart);
      }
    }
    
    return () => {
      if (expressionChart) expressionChart.destroy();
      if (timelineChart) timelineChart.destroy();
    };
  }, [evaluation]);
  
  if (!evaluation) return null;
  
  if (evaluation.status !== "completed" || !evaluation.analysisDetails) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Detailed Analysis</h2>
          <div className="p-4 text-center">
            <p className="text-slate-600">
              {evaluation.status === "processing" ? 
                "Analyzing details..." :
                "Detailed analysis not available."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Detailed Analysis</h2>
        
        <Tabs defaultValue="facial">
          <TabsList className="mb-6">
            <TabsTrigger value="facial">Facial Expressions</TabsTrigger>
            <TabsTrigger value="eye">Eye Contact</TabsTrigger>
            <TabsTrigger value="body">Body Language</TabsTrigger>
            <TabsTrigger value="confidence">Confidence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="facial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expression Distribution Chart */}
              <div>
                <h3 className="text-base font-medium text-slate-900 mb-3">Expression Distribution</h3>
                <div className="h-64 bg-slate-50 rounded-lg p-4">
                  <canvas ref={expressionChartRef}></canvas>
                </div>
              </div>
              
              {/* Facial Expression Timeline */}
              <div>
                <h3 className="text-base font-medium text-slate-900 mb-3">Confidence Timeline</h3>
                <div className="h-64 bg-slate-50 rounded-lg p-4">
                  <canvas ref={timelineChartRef}></canvas>
                </div>
              </div>
            </div>
            
            {/* Expression Analysis */}
            <div className="mt-6">
              <h3 className="text-base font-medium text-slate-900 mb-3">Detailed Feedback</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <i className="ri-emotion-happy-line text-green-500 mr-2 text-xl"></i>
                    <h4 className="font-medium">Positive Expressions</h4>
                  </div>
                  <p className="text-sm text-slate-700">
                    Your natural smile during the introduction and conclusion helped engage the audience. 
                    Appropriate use of expressions when presenting key findings.
                  </p>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <i className="ri-emotion-normal-line text-amber-500 mr-2 text-xl"></i>
                    <h4 className="font-medium">Areas for Improvement</h4>
                  </div>
                  <p className="text-sm text-slate-700">
                    Your expressions appeared neutral for extended periods. Try varying your expressions
                    more to emphasize important points and maintain audience engagement.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="eye">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-slate-700">Eye contact analysis will be available in the next version.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="body">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-slate-700">Body language analysis will be available in the next version.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="confidence">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-slate-700">Confidence analysis will be available in the next version.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
