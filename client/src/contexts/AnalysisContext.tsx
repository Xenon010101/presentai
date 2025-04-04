import { createContext, useContext, useState, ReactNode } from "react";
import { Evaluation } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface AnalysisContextType {
  currentEvaluationId: number | null;
  setCurrentEvaluationId: (id: number | null) => void;
  evaluation: Evaluation | null;
  isLoading: boolean;
  error: Error | null;
  refetchEvaluation: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [currentEvaluationId, setCurrentEvaluationId] = useState<number | null>(null);
  
  const {
    data: evaluation,
    isLoading,
    error,
    refetch: refetchEvaluation
  } = useQuery<Evaluation>({
    queryKey: currentEvaluationId ? [`/api/evaluations/${currentEvaluationId}`] : [],
    enabled: !!currentEvaluationId,
  });
  
  return (
    <AnalysisContext.Provider
      value={{
        currentEvaluationId,
        setCurrentEvaluationId,
        evaluation: evaluation || null,
        isLoading,
        error: error as Error | null,
        refetchEvaluation
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
