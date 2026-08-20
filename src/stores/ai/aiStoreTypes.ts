import type { AICategory, AIToolItem } from "@/types/ai";
import { ALL_71_AI_MODELS } from "@/data/aiToolsData";

export interface AIExecutionLog {
  id: string; toolId: string; toolTitle: string; prompt: string;
  response: string; timestamp: string; latencyMs: number;
}
export interface AIStoreState {
  models: AIToolItem[]; activeCategory: AICategory; searchQuery: string;
  selectedTool: AIToolItem | null; executionHistory: AIExecutionLog[]; isExecuting: boolean; currentOutput: string;
}