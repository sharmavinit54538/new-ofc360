import type { AICategory, AIToolItem } from "@/types/ai";
import { ALL_71_AI_MODELS } from "@/data/aiToolsData";
import type { AIStoreState, AIExecutionLog } from "./aiStoreTypes";

export const initialAiState: AIStoreState = {
  models: ALL_71_AI_MODELS, activeCategory: "ALL", searchQuery: "",
  selectedTool: null, executionHistory: [], isExecuting: false, currentOutput: "",
};