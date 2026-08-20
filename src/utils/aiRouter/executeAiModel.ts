import { ALL_71_AI_MODELS } from "@/data/aiToolsData";
import type { AIExecutionOptions, AIExecutionResponse } from "./types";
import { resolveAIProvider } from "./providerResolver";
import { resolvePromptOutput } from "./resolvePromptOutput";

export async function executeAiModel(modelOrId: any, prompt: string, opts?: AIExecutionOptions): Promise<AIExecutionResponse> {
  const startTime = Date.now();
  const rawId = typeof modelOrId === "string" ? modelOrId : modelOrId.id;
  const known = ALL_71_AI_MODELS.find((m) => m.id === rawId);
  const title = typeof modelOrId === "object" && modelOrId.title ? modelOrId.title : (known?.title || rawId);
  const cat = typeof modelOrId === "object" && modelOrId.category ? modelOrId.category : (known?.category || "General AI");
  const badge = typeof modelOrId === "object" && modelOrId.badge ? modelOrId.badge : (known?.badge || "AI");
  const provider = resolveAIProvider(cat);
  const { text, embedding } = resolvePromptOutput(prompt, title, rawId, cat, badge, opts);
  if (opts?.temperature !== 0) await new Promise((r) => setTimeout(r, 10));
  return {
    modelId: rawId, modelTitle: title, category: cat, provider,
    latencyMs: Date.now() - startTime,
    tokensUsed: Math.round(prompt.length / 4) + Math.round(text.length / 4) + 12,
    response: text, embeddingVector: embedding, isStreamed: !!opts?.stream,
  };
}
