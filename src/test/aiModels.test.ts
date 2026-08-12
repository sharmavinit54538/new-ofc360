import { describe, it, expect, beforeEach } from "vitest";
import { ALL_71_AI_MODELS } from "../data/aiToolsData";
import { executeAiModel, streamAiResponse } from "../utils/aiModelRouter";
import { useAIStore } from "../stores/aiStore";

describe("OFC360 Intelligence Module — 71 AI Models Comprehensive Audit", () => {
  describe("Inventory & Metadata Integrity", () => {
    it("discovers at least 71 AI models in the registry", () => {
      expect(ALL_71_AI_MODELS.length).toBeGreaterThanOrEqual(71);
    });

    it("verifies every model has unique ID, title, description, category, and badge", () => {
      const ids = new Set<string>();
      ALL_71_AI_MODELS.forEach((m) => {
        expect(m.id).toBeTruthy();
        expect(ids.has(m.id)).toBe(false);
        ids.add(m.id);

        expect(m.title).toBeTruthy();
        expect(m.description).toBeTruthy();
        expect(m.category).toBeTruthy();
        expect(m.badge).toBeTruthy();
      });
    });
  });

  describe("Deterministic Prompt Assertions Across All 71 Models", () => {
    // Dynamically test all models individually
    ALL_71_AI_MODELS.forEach((model, index) => {
      it(`[Model #${index + 1}: ${model.id}] ${model.title} - executes deterministic test prompt`, async () => {
        const res = await executeAiModel(model.id, "Reply with exactly: OFC360 MODEL TEST PASSED");

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

    it("executes Python Code Generator model", async () => {
      const res = await executeAiModel("rec-parser", "Write a Python function that adds two numbers");
      expect(res.response).toContain("def add_two_numbers");
      expect(res.response).toContain("```python");
    });

    it("executes RAG Vector Search model and generates vector embeddings", async () => {
      const res = await executeAiModel("rag-search", "Search enterprise policies for leave encashment");
      expect(res.embeddingVector).toBeDefined();
      expect(res.embeddingVector?.length).toBeGreaterThan(0);
    });

    it("executes Biometrics & Vision AI model", async () => {
      const res = await executeAiModel("ai-face-attendance", "Simulate facial scan verification");
      expect(res.response).toContain("Biometric Liveness Verification");
      expect(res.response).toContain("99.8% Genuine");
    });
  });

  describe("Streaming & Audit Logging Engine", () => {
    it("streams response tokens chunk by chunk", async () => {
      const chunks: string[] = [];
      await new Promise<void>((resolve) => {
        streamAiResponse(
          "OFC360 Progressive Streaming Token Test",
          (chunk) => chunks.push(chunk),
          () => resolve(),
          5
        );
      });

      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[chunks.length - 1]).toBe("OFC360 Progressive Streaming Token Test");
    });

    it("records AI model execution audit logs in AI store", () => {
      const store = useAIStore.getState();
      const initialLogs = store.logs.length;

      store.addLog({
        modelId: "rec-screen",
        modelTitle: "AI Resume Screening",
        category: "Recruitment AI",
        promptSnippet: "Test prompt snippet",
        tokensUsed: 42,
        latencyMs: 180,
        status: "Success",
      });

      expect(useAIStore.getState().logs.length).toBe(initialLogs + 1);
      const lastLog = useAIStore.getState().logs[0];
      expect(lastLog.modelId).toBe("rec-screen");
      expect(lastLog.tokensUsed).toBe(42);
    });
  });
});
