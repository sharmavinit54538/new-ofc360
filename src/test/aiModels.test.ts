import { describe, it, expect, beforeEach } from "vitest";
import { AI_CATEGORIES, type AIToolItem } from "../types/ai";
import { executeAiModel, streamAiResponse } from "../utils/aiModelRouter";
import { useAIStore } from "../stores/aiStore";

const SAMPLE_MODELS: AIToolItem[] = [
  {
    id: "rec-screen",
    title: "AI Resume Screening",
    category: "Recruitment AI",
    description: "Batch ranking and candidate screening",
    badge: "Screening",
    iconName: "FileSearch",
  },
  {
    id: "emp-sentiment",
    title: "Employee Sentiment Pulse",
    category: "Employee AI",
    description: "Real-time engagement analysis",
    badge: "Pulse",
    iconName: "Heart",
  },
  {
    id: "pay-error",
    title: "Payroll Calculation Auditor",
    category: "Payroll & Comp AI",
    description: "Automated salary and tax verification",
    badge: "Audit",
    iconName: "Calculator",
  },
  {
    id: "rag-search",
    title: "RAG Vector Policy Search",
    category: "Knowledge & RAG AI",
    description: "Semantic search across HR policy docs",
    badge: "Search",
    iconName: "Search",
  },
  {
    id: "vision-face",
    title: "Biometric Liveness & Face Scan",
    category: "Biometrics & Vision AI",
    description: "Facial telemetry check-in",
    badge: "Vision",
    iconName: "ScanFace",
  },
];

describe("OFC360 Intelligence Module — Capability & Engine Audit", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Category Definitions", () => {
    it("defines standard AI categories", () => {
      expect(AI_CATEGORIES.length).toBeGreaterThanOrEqual(11);
      expect(AI_CATEGORIES).toContain("Recruitment AI");
      expect(AI_CATEGORIES).toContain("Employee AI");
      expect(AI_CATEGORIES).toContain("Payroll & Comp AI");
    });
  });

  describe("Deterministic Prompt Assertions Across Sample Models", () => {
    SAMPLE_MODELS.forEach((model, index) => {
      it(`[Model #${index + 1}: ${model.id}] ${model.title} - executes deterministic test prompt`, async () => {
        const res = await executeAiModel(model, "Reply with exactly: OFC360 MODEL TEST PASSED");

        expect(res.modelId).toBe(model.id);
        expect(res.modelTitle).toBe(model.title);
        expect(res.response).toContain("OFC360 MODEL TEST PASSED");
        expect(res.latencyMs).toBeGreaterThanOrEqual(0);
        expect(res.tokensUsed).toBeGreaterThan(0);
      });
    });
  });

  describe("Capability Specific Tests", () => {
    it("executes General Intelligence prompt on recruitment model (rec-screen)", async () => {
      const res = await executeAiModel("rec-screen", "Explain what an HRMS is in 3 short bullet points");
      expect(res.response).toContain("Core Workforce Management");
      expect(res.response).toContain("Automated Payroll & Compliance");
    });

    it("executes Reasoning & Mathematical prompt (₹50,000 + ₹5,000)", async () => {
      const res = await executeAiModel("pay-error", "An employee earns ₹50,000 monthly and receives a ₹5,000 bonus. What is the total before deductions?");
      expect(res.response).toContain("₹55,000");
    });

    it("executes Context Memory recall", async () => {
      const res = await executeAiModel("emp-sentiment", "What is my company called?", {
        contextHistory: [{ role: "user", content: "My company is called OFC360." }],
      });
      expect(res.response).toContain("Your company is called OFC360");
    });

    it("executes Python Code Generator", async () => {
      const res = await executeAiModel("code-gen", "Write a python function that adds two numbers");
      expect(res.response).toContain("def add_two_numbers");
    });

    it("executes Vector Embedding Generation", async () => {
      const res = await executeAiModel("rag-search", "Find leaves and paid holidays policy");
      expect(res.embeddingVector).toBeDefined();
      expect(res.embeddingVector?.length).toBe(16);
    });

    it("executes Vision & Biometrics Analysis", async () => {
      const res = await executeAiModel(
        { id: "vision-face", title: "Face Check", category: "Biometrics & Vision AI" },
        "Analyze biometric liveness"
      );
      expect(res.response).toContain("Liveness Verification");
    });
  });

  describe("Token Streamer & Audit Logging", () => {
    it("streams chunk responses correctly", async () => {
      const fullText = "This is a streamed token response test for OFC360";
      const chunks: string[] = [];

      await new Promise<void>((resolve) => {
        streamAiResponse(
          fullText,
          (chunk) => chunks.push(chunk),
          () => resolve(),
          5
        );
      });

      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks[chunks.length - 1]).toBe(fullText);
    });

    it("correctly records audit logs into Zustand store", () => {
      const { addLog } = useAIStore.getState();
      addLog({
        modelId: "rec-screen",
        modelTitle: "AI Resume Screening",
        category: "Recruitment AI",
        promptSnippet: "Screen candidate John Doe",
        tokensUsed: 142,
        latencyMs: 38,
        status: "Success",
      });

      const updatedLogs = useAIStore.getState().logs;
      expect(updatedLogs.length).toBe(1);
      expect(updatedLogs[0].modelId).toBe("rec-screen");
      expect(updatedLogs[0].status).toBe("Success");
    });
  });
});