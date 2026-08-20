import { AIExecutionOptions } from "./types";
import { handleStandardPrompts } from "./promptHandlers1";
import { handleSpecialPrompts } from "./promptHandlers2";
import { generateMockEmbedding } from "./providerResolver";

export function resolvePromptOutput(prompt: string, title: string, id: string, cat: string, badge: string, opts?: AIExecutionOptions): { text: string; embedding?: number[] } {
  const pLower = prompt.trim().toLowerCase();
  const std = handleStandardPrompts(pLower, title, id);
  if (std) return { text: std };
  const spec = handleSpecialPrompts(pLower, title, id, cat, badge, opts);
  if (spec) {
    if (spec.text.startsWith("Vector Search")) spec.embedding = generateMockEmbedding(prompt);
    return spec;
  }
  return { text: `[${title} Analysis Output]\nInput: "${prompt}"\nInsight: Processed using ${cat} matrix.\nStatus: Completed cleanly.` };
}
