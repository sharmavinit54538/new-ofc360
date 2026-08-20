import { create } from "zustand";
import type { Candidate } from "@/types/ats";
import type { CandidateStoreState } from "./candidates/candidateStoreTypes";

export const useCandidateStore = create<CandidateStoreState & {
  setCandidates: (c: Candidate[]) => void; setSelectedCandidate: (c: Candidate | null) => void;
  setSearchQuery: (q: string) => void; setStageFilter: (s: string) => void;
  updateCandidateStage: (id: string, stage: any) => void;
}>((set) => ({
  candidates: [], selectedCandidate: null, searchQuery: "", stageFilter: "ALL",
  setCandidates: (candidates) => set({ candidates }),
  setSelectedCandidate: (selectedCandidate) => set({ selectedCandidate }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStageFilter: (stageFilter) => set({ stageFilter }),
  updateCandidateStage: (id, stage) => set((s) => ({
    candidates: s.candidates.map((c) => c.id === id ? { ...c, stage } : c)
  })),
}));