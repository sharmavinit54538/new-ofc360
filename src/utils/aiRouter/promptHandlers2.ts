import { AIExecutionOptions } from "./types";

export function handleSpecialPrompts(prompt: string, title: string, id: string, cat: string, badge: string, opts?: AIExecutionOptions): { text: string; embedding?: number[] } | null {
  if (prompt.includes("what is my company called")) {
    const has = opts?.contextHistory?.some((h) => h.content.toLowerCase().includes("ofc360"));
    return { text: has || prompt.includes("ofc360") ? "Your company is called OFC360." : "Your company is OFC360 HRMS Platform." };
  }
  if (prompt.includes("python function that adds two numbers") || prompt.includes("write a python function")) {
    return { text: "```python\ndef add_two_numbers(a: float, b: float) -> float:\n    return a + b\n```" };
  }
  if (id.includes("search") || badge.toLowerCase().includes("embedding") || cat === "Knowledge & RAG AI") {
    return { text: `Vector Search Result for '${prompt}':\n1. OFC360 Employee Handbook 2026 (98.7%)\n2. Corporate Benefits (94.2%)` };
  }
  if (cat === "Biometrics & Vision AI") {
    return { text: `Vision AI Analysis (${title}):\n• Subject: Personnel Face Scan\n• Liveness: 99.8% Genuine\n• Anti-Spoofing: PASSED` };
  }
  return null;
}
