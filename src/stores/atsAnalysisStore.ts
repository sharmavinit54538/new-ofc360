import { create } from "zustand";
import type { ATSAnalysisState } from "./atsAnalysis/analysisTypes";
import { createAtsActions } from "./atsAnalysis/atsActions";

export const useATSAnalysisStore = create<any>((set, get) => ({
  currentResume: null, currentReport: null, history: [], isAnalyzing: false, selectedJobTitle: "Senior Full Stack Engineer", jobDescription: "",
  ...createAtsActions(set, get),
}));