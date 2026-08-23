import type { AIToolItem } from "@/types/ai";

export const aiModel_6: AIToolItem = {
  "id": "rec-copilot",
  "title": "AI Interview Copilot",
  "category": "Recruitment AI",
  "description": "Real-time AI prompter during interviews suggesting follow-up probes and evaluating technical accuracy.",
  "badge": "Copilot",
  "route": "/ai/copilot",
  "iconName": "Zap",
  "demoPrompt": "Live Interviewer Context: Candidate mentions Redis clustering",
  "defaultOutput": "Suggested Follow-Up: Ask how they handle network partitioning and split-brain scenarios in Redis Sentinel."
};
