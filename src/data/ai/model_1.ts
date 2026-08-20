import type { AIToolItem } from "@/types/ai";

export const aiModel_1: AIToolItem = {
  "id": "rec-screen",
  "title": "AI Resume Screening",
  "category": "Recruitment AI",
  "description": "Batch ranking, keyword matching, and automated compliance scoring for candidate CVs.",
  "badge": "Screening",
  "route": "/ai/ats",
  "iconName": "FileSearch",
  "demoPrompt": "Upload or paste CV text for Senior Fullstack Engineer",
  "defaultOutput": "Match Score: 94% | Strong React, Node.js & AWS background. Flagged: Notice period is 60 days."
};
