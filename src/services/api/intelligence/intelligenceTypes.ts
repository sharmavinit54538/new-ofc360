export interface AIModelMetadata {
  id: string;
  name: string;
  code: string;
  category: "workforce" | "talent" | "recruitment" | "compliance" | "performance" | "resource";
  description: string;
  status: "active" | "training" | "maintenance" | "inactive";
  accuracy: number;
  lastRun?: string;
  version: string;
}

export interface AIExecutionRequest {
  modelId: string;
  inputData: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}
