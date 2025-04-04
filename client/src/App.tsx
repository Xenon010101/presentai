import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import UploadVideo from "@/pages/UploadVideo";
import VideoAnalysis from "@/pages/VideoAnalysis";
import PastEvaluations from "@/pages/PastEvaluations";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import { AnalysisProvider } from "@/contexts/AnalysisContext";

function Router() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
      
      <main className="flex-1 overflow-y-auto md:ml-64 h-full">
        {/* Mobile menu toggle header */}
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="h-16 flex items-center justify-between px-4">
            <div className="flex items-center">
              <div className="bg-primary-600 text-white p-1.5 rounded">
                <i className="ri-presentation-line text-xl"></i>
              </div>
              <h1 className="ml-2 text-xl font-semibold text-slate-900">PresentAI</h1>
            </div>
            <button
              type="button"
              className="p-2 rounded-md text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="ri-menu-line text-xl"></i>
            </button>
          </div>
        </div>
        
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/upload" component={UploadVideo} />
          <Route path="/analysis/:id" component={VideoAnalysis} />
          <Route path="/evaluations" component={PastEvaluations} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalysisProvider>
        <Router />
        <Toaster />
      </AnalysisProvider>
    </QueryClientProvider>
  );
}

export default App;
