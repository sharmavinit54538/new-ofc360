export function resolveAIProvider(category: string): string {
  if (category === "Biometrics & Vision AI") return "OFC360 Vision Core API";
  if (category === "Knowledge & RAG AI") return "OFC360 Vector RAG Engine";
  if (category === "Payroll & Comp AI") return "OFC360 Financial AI Guard";
  if (category === "Compliance & Legal AI") return "OFC360 Legal Compliance Llama-3";
  return "OFC360 Neural Engine v4.2";
}

export function generateMockEmbedding(userPrompt: string): number[] {
  return Array.from({ length: 16 }, (_, i) =>
    parseFloat((Math.sin(i + userPrompt.length) * 0.5).toFixed(4))
  );
}
