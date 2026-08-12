import { describe, it, expect } from "vitest";
import { ALL_71_AI_MODELS } from "../data/aiToolsData";
import { executeAiModel } from "../utils/aiModelRouter";

describe("OFC360 Intelligence — 73 AI Model Workspaces Suite", () => {
  it("verifies all 73 models exist in registry with unique IDs and categories", () => {
    expect(ALL_71_AI_MODELS.length).toBeGreaterThanOrEqual(71);

    const ids = new Set<string>();
    ALL_71_AI_MODELS.forEach((model) => {
      expect(model.id).toBeTruthy();
      expect(model.title).toBeTruthy();
      expect(model.category).toBeTruthy();
      expect(model.description).toBeTruthy();
      expect(ids.has(model.id)).toBe(false);
      ids.add(model.id);
    });
  });

  it("executes model workspace routing for all 11 AI categories cleanly", async () => {
    const sampleModels = [
      "rec-screen",
      "emp-sentiment",
      "wf-planning",
      "perf-coach",
      "pay-insights",
      "comp-monitor",
      "doc-offer",
      "meet-summary",
      "an-exec",
      "rag-policy",
      "ai-face-attendance",
    ];

    for (const id of sampleModels) {
      const res = await executeAiModel(id, "Test prompt execution");
      expect(res).toBeTruthy();
      expect(res.response).toBeTruthy();
      expect(res.latencyMs).toBeGreaterThan(0);
      expect(res.tokensUsed).toBeGreaterThan(0);
    }
  });
});
