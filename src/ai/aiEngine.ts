export interface AIEngineConfig {
  id: "ofc360-ai";
  name: string;
  provider: "Ollama";
  model: "qwen3:30b";
  status: "ACTIVE";
  description: string;
  architecture: string;
  contextWindow: number;
}

export const OFC360_AI_ENGINE: AIEngineConfig = {
  id: "ofc360-ai",
  name: "OFC360 AI",
  provider: "Ollama",
  model: "qwen3:30b",
  status: "ACTIVE",
  description: "One intelligent AI engine powering every workflow across OFC360.",
  architecture: "OFC360 AI → Ollama → qwen3:30b",
  contextWindow: 32768,
};

export default OFC360_AI_ENGINE;
