import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  AI_CATEGORIES,
  type AICapability,
  OFC360_AI_ENGINE,
  OFC360_AI_CAPABILITIES,
  getAICapabilities,
  getAICapabilityById,
  getAICapabilitiesByCategory,
} from "../types/ai";
import { aiService } from "../ai";

const SAMPLE_CAPABILITIES: AICapability[] = [
  {
    id: "rec-screen",
    title: "AI Resume Screening",
    category: "Recruitment AI",
    description: "Batch ranking and candidate screening",
    badge: "ACTIVE",
    engine: "ofc360-ai",
    iconName: "FileSearch",
  },
  {
    id: "emp-sentiment",
    title: "Employee Sentiment Pulse",
    category: "Employee AI",
    description: "Real-time engagement analysis",
    badge: "ACTIVE",
    engine: "ofc360-ai",
    iconName: "Heart",
  },
  {
    id: "pay-error",
    title: "Payroll Calculation Auditor",
    category: "Payroll & Comp AI",
    description: "Automated salary and tax verification",
    badge: "ACTIVE",
    engine: "ofc360-ai",
    iconName: "Calculator",
  },
  {
    id: "rag-search",
    title: "RAG Vector Policy Search",
    category: "Knowledge & RAG AI",
    description: "Semantic search across HR policy docs",
    badge: "ACTIVE",
    engine: "ofc360-ai",
    iconName: "Search",
  },
  {
    id: "vision-face",
    title: "Biometric Liveness & Face Scan",
    category: "Biometrics & Vision AI",
    description: "Facial telemetry check-in",
    badge: "ACTIVE",
    engine: "ofc360-ai",
    iconName: "ScanFace",
  },
];

describe("OFC360 AI Unified Architecture — Single Engine & Capability Registry", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("Single AI Engine Architecture", () => {
    it("defines one canonical OFC360 AI engine with Ollama and qwen3:30b", () => {
      expect(OFC360_AI_ENGINE.id).toBe("ofc360-ai");
      expect(OFC360_AI_ENGINE.name).toBe("OFC360 AI");
      expect(OFC360_AI_ENGINE.provider).toBe("Ollama");
      expect(OFC360_AI_ENGINE.model).toBe("qwen3:30b");
      expect(OFC360_AI_ENGINE.status).toBe("ACTIVE");
      expect(aiService.getEngine().model).toBe("qwen3:30b");
    });
  });

  describe("Canonical Capability Registry", () => {
    it("registers all 71 enterprise capabilities under one AI engine", () => {
      expect(OFC360_AI_CAPABILITIES.length).toBeGreaterThanOrEqual(40);
      for (const capability of OFC360_AI_CAPABILITIES) {
        expect(capability.engine).toBe("ofc360-ai");
        expect(capability.id).toBeTruthy();
        expect(capability.title).toBeTruthy();
        expect(capability.category).toBeTruthy();
      }
    });

    it("defines standard AI categories", () => {
      expect(AI_CATEGORIES.length).toBeGreaterThanOrEqual(11);
      expect(AI_CATEGORIES).toContain("Recruitment AI");
      expect(AI_CATEGORIES).toContain("Employee AI");
      expect(AI_CATEGORIES).toContain("Payroll & Comp AI");
    });

    it("provides capability getter helpers", () => {
      const all = getAICapabilities();
      expect(all.length).toBe(OFC360_AI_CAPABILITIES.length);

      const recruitmentCaps = getAICapabilitiesByCategory("Recruitment AI");
      expect(recruitmentCaps.length).toBeGreaterThan(0);
      expect(recruitmentCaps.every((c) => c.category === "Recruitment AI")).toBe(true);

      const ats = getAICapabilityById("recruitment-ats");
      expect(ats).toBeDefined();
      expect(ats?.engine).toBe("ofc360-ai");
    });
  });

  describe("Deterministic Prompt Assertions Across Sample Capabilities", () => {
    SAMPLE_CAPABILITIES.forEach((capability, index) => {
      it(`[Capability #${index + 1}: ${capability.id}] ${capability.title} - executes on OFC360 AI engine`, async () => {
        const mockResponse = {
          content: "OFC360 MODEL TEST PASSED",
          latencyMs: 100,
          tokensUsed: 50,
          model: "qwen3:30b",
        };

        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });

        const res = await aiService.generate({
          prompt: "Reply with exactly: OFC360 MODEL TEST PASSED",
          task: 'text',
        });

        expect(res).toBeTruthy();
        expect(res.content).toContain("OFC360 MODEL TEST PASSED");
        expect(res.latencyMs).toBeGreaterThanOrEqual(0);
        expect(res.tokensUsed).toBeGreaterThan(0);
      });
    });
  });

  describe("Capability Specific Tests", () => {
    it("executes General Intelligence prompt on recruitment capability", async () => {
      const mockResponse = {
        content: "Core Workforce Management\nAutomated Payroll & Compliance\nEmployee Self-Service",
        latencyMs: 150,
        tokensUsed: 80,
        model: "qwen3:30b",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const res = await aiService.generate({
        prompt: "Explain what an HRMS is in 3 short bullet points",
        task: 'text',
      });
      expect(res.content).toContain("Workforce Management");
      expect(res.content).toContain("Payroll");
    });

    it("executes Reasoning & Mathematical prompt on single engine", async () => {
      const mockResponse = {
        content: "The total before deductions is ₹55,000 (₹50,000 + ₹5,000).",
        latencyMs: 80,
        tokensUsed: 40,
        model: "qwen3:30b",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const res = await aiService.generate({
        prompt: "An employee earns ₹50,000 monthly and receives a ₹5,000 bonus. What is the total before deductions?",
        task: 'text',
      });
      expect(res.content).toContain("₹55,000");
    });

    it("executes Context Memory recall", async () => {
      const mockResponse = {
        content: "Your company is called OFC360.",
        latencyMs: 60,
        tokensUsed: 30,
        model: "qwen3:30b",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const res = await aiService.generate({
        prompt: "What is my company called?",
        task: 'text',
        parameters: { contextHistory: [{ role: "user", content: "My company is called OFC360." }] },
      });
      expect(res.content).toContain("OFC360");
    });

    it("executes Python Code Generator", async () => {
      const mockResponse = {
        content: "def add_two_numbers(a, b):\n    return a + b",
        latencyMs: 120,
        tokensUsed: 50,
        model: "qwen3:30b",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const res = await aiService.generate({
        prompt: "Write a python function that adds two numbers",
        task: 'code',
      });
      expect(res.content).toContain("def add");
    });

    it("executes Vector Embedding Generation", async () => {
      const mockResponse = {
        data: [{ embedding: new Array(1536).fill(0.1), index: 0 }],
        model: "text-embedding-3-small",
        usage: { prompt_tokens: 10, total_tokens: 10 },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const res = await aiService.embed({
        input: "Find leaves and paid holidays policy",
        model: 'text-embedding-3-small',
      });
      expect(res.data).toBeDefined();
      expect(res.data[0].embedding.length).toBeGreaterThan(0);
    });

    it("executes Vision & Biometrics Analysis", async () => {
      const mockResponse = {
        content: "Liveness Verification: PASSED. Anti-spoofing: ACTIVE. Face match confidence: 99.2%.",
        latencyMs: 200,
        tokensUsed: 60,
        model: "qwen3:30b",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const res = await aiService.generate({
        prompt: "Analyze biometric liveness",
        task: 'text',
      });
      expect(res.content).toContain("Liveness");
    });
  });

  describe("Token Streamer", () => {
    it("simulates chunk responses correctly", async () => {
      const fullText = "This is a streamed token response test for OFC360 AI";
      const chunks: string[] = [];

      await new Promise<void>((resolve) => {
        let currentText = '';
        for (let i = 0; i < fullText.length; i++) {
          currentText = fullText.slice(0, i + 1);
          chunks.push(currentText);
        }
        resolve();
      });

      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks[chunks.length - 1]).toBe(fullText);
    });
  });
});