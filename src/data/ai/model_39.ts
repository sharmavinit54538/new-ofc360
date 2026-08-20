import type { AIToolItem } from "@/types/ai";

export const aiModel_39: AIToolItem = {
  "id": "comp-monitor",
  "title": "Compliance Monitor AI",
  "category": "Compliance & Legal AI",
  "description": "Tracks statutory PF, ESI, TDS, PT filings and alerts HR before deadline penalties occur.",
  "badge": "Statutory",
  "route": "/intelligence/compliance",
  "iconName": "ShieldCheck",
  "demoPrompt": "Check monthly compliance filing readiness for current quarter",
  "defaultOutput": "PF ECR Generated: Ready | ESI Challan: Filed | TDS Form 24Q: Due in 12 days (Status: In Progress)."
};
