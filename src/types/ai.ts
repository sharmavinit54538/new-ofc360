export type { AICategory } from "./ai/category";
export type { AIToolItem } from "./ai/toolItem";
export { AI_CATEGORIES } from "./ai/categoriesList";
export {
  OFC360_AI_ENGINE,
  OFC360_AI_TASKS,
  OFC360_AI_CAPABILITIES,
  getAITasks,
  getAITaskById,
  getAITasksByCategory,
  getAICapabilities,
  getAICapabilityById,
  getAICapabilitiesByCategory,
} from "@/ai/capabilities";
export type { AITask, AICapability } from "@/ai/capabilities";