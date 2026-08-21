export * from "./intelligence/intelligenceTypes";
export * from "./intelligence/intelligenceResponseTypes";
export * from "./intelligence/intelligenceModelsApi";
export * from "./intelligence/intelligenceExecutionsApi";

import { intelligenceModelsApi } from "./intelligence/intelligenceModelsApi";
import { intelligenceExecutionsApi } from "./intelligence/intelligenceExecutionsApi";

export const intelligenceApi = {
  ...intelligenceModelsApi,
  ...intelligenceExecutionsApi,
};