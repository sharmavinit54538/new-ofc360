import { create } from "zustand";
import type { AICategory, AIToolItem } from "@/types/ai";
import type { AIStoreState, AIExecutionLog } from "./ai/aiStoreTypes";
import { initialAiState } from "./ai/aiStoreActions";

export const useAIStore = create<any>((set, get) => ({
  ...initialAiState,
  logs: [],
  setActiveCategory: (activeCategory: any) => set({ activeCategory }),
  setSearchQuery: (searchQuery: any) => set({ searchQuery }),
  setSelectedTool: (selectedTool: any) => set({ selectedTool }),
  addExecutionLog: (log: any) => set((s: any) => ({ executionHistory: [log, ...s.executionHistory].slice(0, 50) })),
  addLog: (log: any) => set((s: any) => ({ logs: [log, ...s.logs] })),
  setIsExecuting: (isExecuting: any) => set({ isExecuting }),
  setCurrentOutput: (currentOutput: any) => set({ currentOutput }),
}));