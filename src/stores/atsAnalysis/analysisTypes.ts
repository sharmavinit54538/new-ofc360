import type { ATSAnalysisResult, ParsedResumeData } from "@/utils/atsScoringEngine";

export interface ATSAnalysisState {
  currentResume: ParsedResumeData | null; currentReport: ATSAnalysisResult | null;
  history: ATSAnalysisResult[]; isAnalyzing: boolean; selectedJobTitle: string; jobDescription: string;
}