import { create } from "zustand";
import type { ATSAnalysisResult, ParsedResumeData } from "@/utils/atsScoringEngine";
import type { ATSAnalysisState } from "./atsAnalysis/analysisTypes";

export const useATSAnalysisStore = create<ATSAnalysisState & {
  setCurrentResume: (r: ParsedResumeData | null) => void; setCurrentReport: (rep: ATSAnalysisResult | null) => void;
  setIsAnalyzing: (a: boolean) => void; setSelectedJobTitle: (t: string) => void; setJobDescription: (d: string) => void;
  addReportToHistory: (rep: ATSAnalysisResult) => void; clearAnalysis: () => void;
}>((set) => ({
  currentResume: null, currentReport: null, history: [], isAnalyzing: false, selectedJobTitle: "Senior Full Stack Engineer", jobDescription: "",
  setCurrentResume: (currentResume) => set({ currentResume }), setCurrentReport: (currentReport) => set({ currentReport }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }), setSelectedJobTitle: (selectedJobTitle) => set({ selectedJobTitle }),
  setJobDescription: (jobDescription) => set({ jobDescription }), addReportToHistory: (r) => set((s) => ({ history: [r, ...s.history] })),
  clearAnalysis: () => set({ currentResume: null, currentReport: null }),
}));