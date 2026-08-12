/**
 * OFC360 ATS Analysis History & Reports Store
 * Persists ATS scoring reports, saved candidate evaluations, and recruiter audit history.
 */

import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";
import { type ATSAnalysisResult } from "@/utils/atsScoringEngine";

interface ATSAnalysisState {
  history: ATSAnalysisResult[];
  activeAnalysis: ATSAnalysisResult | null;
  savedCount: number;

  // Actions
  saveAnalysis: (analysis: ATSAnalysisResult) => void;
  deleteAnalysis: (id: string) => void;
  setActiveAnalysis: (analysis: ATSAnalysisResult | null) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = "ofc360_ats_history_v2";

export const useATSAnalysisStore = create<ATSAnalysisState>((set, get) => ({
  history: getStoredData<ATSAnalysisResult[]>(STORAGE_KEY, []),
  activeAnalysis: null,
  savedCount: getStoredData<ATSAnalysisResult[]>(STORAGE_KEY, []).length,

  saveAnalysis: (analysis) => {
    const existing = get().history.filter((h) => h.id !== analysis.id);
    const updated = [analysis, ...existing];
    setStoredData(STORAGE_KEY, updated);
    set({ history: updated, savedCount: updated.length, activeAnalysis: analysis });
  },

  deleteAnalysis: (id) => {
    const updated = get().history.filter((h) => h.id !== id);
    setStoredData(STORAGE_KEY, updated);
    set({
      history: updated,
      savedCount: updated.length,
      activeAnalysis: get().activeAnalysis?.id === id ? null : get().activeAnalysis,
    });
  },

  setActiveAnalysis: (analysis) => set({ activeAnalysis: analysis }),

  clearHistory: () => {
    setStoredData(STORAGE_KEY, []);
    set({ history: [], savedCount: 0, activeAnalysis: null });
  },
}));
