export * from "@/features/intelligence/api/intelligenceTypes";
export * from "@/features/intelligence/api/intelligenceResponseTypes";
export * from "@/features/intelligence/api/intelligenceModelsApi";
export * from "@/features/intelligence/api/intelligenceExecutionsApi";

import { intelligenceModelsApi } from "@/features/intelligence/api/intelligenceModelsApi";
import { intelligenceExecutionsApi } from "@/features/intelligence/api/intelligenceExecutionsApi";

export const intelligenceApi = {
  ...intelligenceModelsApi,
  ...intelligenceExecutionsApi,
};