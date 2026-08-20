import type { AIToolItem } from "@/types/ai";
import { aiModelsHalf1 } from "./modelsHalf1";
import { aiModelsHalf2 } from "./modelsHalf2";

export const ALL_71_AI_MODELS: AIToolItem[] = [
  ...aiModelsHalf1,
  ...aiModelsHalf2,
];
