import { describe, it, expect } from "vitest";
import { AI_CATEGORIES, type AIToolItem } from "../types/ai";
import { executeAiModel } from "../utils/aiModelRouter";

describe("OFC360 Intelligence — AI Model Workspaces Suite", () => {
  it("verifies AI categories are valid", () => {
    expect(AI_CATEGORIES.length).toBeGreaterThanOrEqual(11);
  });

  it("executes model workspace routing for key AI categories cleanly", async () => {
    const sampleModels: AIToolItem[] = [
      { id: "rec-screen", title: "Resume Screening", category: "Recruitment AI", description: "", badge: "Screening", iconName: "FileSearch" },
      { id: "emp-sentiment", title: "Sentiment Pulse", category: "Employee AI", description: "", badge: "Pulse", iconName: "Heart" },
      { id: "wf-planning", title: "Workforce Planning", category: "Workforce & Shift AI", description: "", badge: "Shift", iconName: "Calendar" },
      { id: "perf-coach", title: "Performance Coach", category: "Performance & OKR AI", description: "", badge: "OKR", iconName: "Target" },
      { id: "pay-insights", title: "Payroll Insights", category: "Payroll & Comp AI", description: "", badge: "Comp", iconName: "Coins" },
      { id: "comp-monitor", title: "Compliance Monitor", category: "Compliance & Legal AI", description: "", badge: "Legal", iconName: "ShieldCheck" },
      { id: "doc-offer", title: "Offer Document AI", category: "Document Gen AI", description: "", badge: "Doc", iconName: "FileText" },
      { id: "meet-summary", title: "Meeting Summary AI", category: "Meeting Intelligence AI", description: "", badge: "Meet", iconName: "Video" },
      { id: "an-exec", title: "Executive Analytics", category: "Analytics & Predictive AI", description: "", badge: "Analytics", iconName: "BarChart3" },
      { id: "rag-policy", title: "Policy RAG AI", category: "Knowledge & RAG AI", description: "", badge: "RAG", iconName: "Search" },
      { id: "ai-face-attendance", title: "Face Attendance AI", category: "Biometrics & Vision AI", description: "", badge: "Vision", iconName: "ScanFace" },
    ];

    for (const model of sampleModels) {
      const res = await executeAiModel(model, "Test prompt execution");
      expect(res).toBeTruthy();
      expect(res.response).toBeTruthy();
      expect(res.latencyMs).toBeGreaterThanOrEqual(0);
      expect(res.tokensUsed).toBeGreaterThan(0);
    }
  });
});
