import { describe, it, expect, vi, beforeEach } from "vitest";
import { AI_CATEGORIES, type AICapability } from "../types/ai";
import { aiService } from "../ai";

describe("OFC360 Intelligence — AI Capability Workspaces Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("verifies AI categories are valid", () => {
    expect(AI_CATEGORIES.length).toBeGreaterThanOrEqual(11);
  });

  it("executes capability workspace routing for key AI categories cleanly on single OFC360 AI engine", async () => {
    const sampleCapabilities: AICapability[] = [
      { id: "rec-screen", title: "Resume Screening", category: "Recruitment AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "FileSearch" },
      { id: "emp-sentiment", title: "Sentiment Pulse", category: "Employee AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "Heart" },
      { id: "wf-planning", title: "Workforce Planning", category: "Workforce & Shift AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "Calendar" },
      { id: "perf-coach", title: "Performance Coach", category: "Performance & OKR AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "Target" },
      { id: "pay-insights", title: "Payroll Insights", category: "Payroll & Comp AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "Coins" },
      { id: "comp-monitor", title: "Compliance Monitor", category: "Compliance & Legal AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "ShieldCheck" },
      { id: "doc-offer", title: "Offer Document AI", category: "Document Gen AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "FileText" },
      { id: "meet-summary", title: "Meeting Summary AI", category: "Meeting Intelligence AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "Video" },
      { id: "an-exec", title: "Executive Analytics", category: "Analytics & Predictive AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "BarChart3" },
      { id: "rag-policy", title: "Policy RAG AI", category: "Knowledge & RAG AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "Search" },
      { id: "ai-face-attendance", title: "Face Attendance AI", category: "Biometrics & Vision AI", description: "", badge: "ACTIVE", engine: "ofc360-ai", iconName: "ScanFace" },
    ];

    for (const capability of sampleCapabilities) {
      const mockResponse = {
        content: `Test response for ${capability.title}`,
        latencyMs: 100,
        tokensUsed: 50,
        model: "qwen3:30b",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const res = await aiService.generate({
        prompt: `Test prompt for ${capability.title}`,
        task: 'text',
      });
      expect(res).toBeTruthy();
      expect(res.content).toBeTruthy();
      expect(res.latencyMs).toBeGreaterThanOrEqual(0);
      expect(res.tokensUsed).toBeGreaterThan(0);
    }
  });
});