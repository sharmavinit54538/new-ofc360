import { create } from "zustand";
import { type Candidate } from "@/types/hr";
import { getStoredData, setStoredData } from "@/utils/storage";

const STORAGE_KEY = "ofc360_candidates_v2";

interface CandidateState {
  candidates: Candidate[];
  searchQuery: string;
  stageFilter: string;
  setSearchQuery: (query: string) => void;
  setStageFilter: (stage: string) => void;
  addCandidate: (candidate: Omit<Candidate, "id" | "appliedAt">) => void;
  updateCandidateStage: (id: string, stage: Candidate["stage"]) => void;
  deleteCandidate: (id: string) => void;
}

export const useCandidateStore = create<CandidateState>((set, get) => ({
  candidates: getStoredData<Candidate[]>(STORAGE_KEY, []),
  searchQuery: "",
  stageFilter: "ALL",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStageFilter: (stageFilter) => set({ stageFilter }),

  addCandidate: (candData) => {
    const nextId = `C${String(get().candidates.length + 1).padStart(3, "0")}`;
    const newCandidate: Candidate = {
      id: nextId,
      appliedAt: new Date().toISOString().split("T")[0],
      ...candData,
    };
    const updated = [newCandidate, ...get().candidates];
    setStoredData(STORAGE_KEY, updated);
    set({ candidates: updated });
  },

  updateCandidateStage: (id, stage) => {
    const updated = get().candidates.map((cand) =>
      cand.id === id ? { ...cand, stage } : cand
    );
    setStoredData(STORAGE_KEY, updated);
    set({ candidates: updated });
  },

  deleteCandidate: (id) => {
    const updated = get().candidates.filter((cand) => cand.id !== id);
    setStoredData(STORAGE_KEY, updated);
    set({ candidates: updated });
  },
}));
