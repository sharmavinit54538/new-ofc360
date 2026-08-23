import type { AIToolItem } from "@/types/ai";

export const aiModel_18: AIToolItem = {
  "id": "emp-profile",
  "title": "AI Employee Profile Generator",
  "category": "Employee AI",
  "description": "Auto-populates full employee profile schema from uploaded resumes, IDs, and onboarding docs.",
  "badge": "Auto Profile",
  "iconName": "UserPlus",
  "demoPrompt": "Auto-parse candidate onboarding documents to generate HRIS profile",
  "defaultOutput": "Profile generated with 11 domains populated (KYC, Bank details, Education, Past Experience, Skills)."
};
