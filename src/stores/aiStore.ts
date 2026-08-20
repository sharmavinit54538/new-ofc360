import { create } from "zustand";
import type { AICategory, AIToolItem } from "@/types/ai";
import type { AIStoreState, AIExecutionLog } from "./ai/aiStoreTypes";
import { initialAiState } from "./ai/aiStoreActions";

export type { AIExecutionLog };

export const useAIStore = create<AIStoreState & {
  setActiveCategory: (cat: AICategory) => void; setSearchQuery: (q: string) => void;
  setSelectedTool: (t: AIToolItem | null) => void; addExecutionLog: (log: AIExecutionLog) => void;
  setIsExecuting: (e: boolean) => void; setCurrentOutput: (o: string) => void;
}>((set) => ({
  ...initialAiState,
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTool: (selectedTool) => set({ selectedTool }),
  addExecutionLog: (log) => set((s) => ({ executionHistory: [log, ...s.executionHistory].slice(0, 50) })),
  setIsExecuting: (isExecuting) => set({ isExecuting }),
  setCurrentOutput: (currentOutput) => set({ currentOutput }),
}));