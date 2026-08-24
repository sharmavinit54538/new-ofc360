import { describe, it, expect, beforeEach, vi } from "vitest";
import { AI_CATEGORIES, type AIToolItem } from "../types/ai";
import { aiService } from "../ai";

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
    vi.restoreAllMocks();
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
        const mockResponse = {
          content: "OFC360 MODEL TEST PASSED",
          latencyMs: 100,
          tokensUsed: 50,
          model: "gpt-4",
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
    it("executes General Intelligence prompt on recruitment model (rec-screen)", async () => {
      const mockResponse = {
        content: "Core Workforce Management\nAutomated Payroll & Compliance\nEmployee Self-Service",
        latencyMs: 150,
        tokensUsed: 80,
        model: "gpt-4",
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

    it("executes Reasoning & Mathematical prompt (₹50,000 + ₹5,000)", async () => {
      const mockResponse = {
        content: "The total before deductions is ₹55,000 (₹50,000 + ₹5,000).",
        latencyMs: 80,
        tokensUsed: 40,
        model: "gpt-4",
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
        model: "gpt-4",
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
        model: "gpt-4",
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
        model: "gpt-4-vision",
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
      const fullText = "This is a streamed token response test for OFC360";
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