import type { AIToolItem } from "@/types/ai";

export const aiModel_7: AIToolItem = {
  "id": "rec-match",
  "title": "AI Candidate Match Score",
  "category": "Recruitment AI",
  "description": "Calculates deep semantic matching percentage (0–100%) between CV and Job Description.",
  "badge": "Semantic Match",
  "route": "/ai/ats",
  "iconName": "Sparkles",
  "demoPrompt": "Compare CV vs JD for Senior Product Designer",
  "defaultOutput": "Exact Match: 89.5% | Core Design Systems: 96% | Prototyping: 90% | User Research: 78%"
};
