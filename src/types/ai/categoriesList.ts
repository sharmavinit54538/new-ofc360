import type { AICategory } from "./category";

export const AI_CATEGORIES: readonly AICategory[] = [
  "ALL", "Recruitment AI", "Employee AI", "Workforce & Shift AI",
  "Performance & OKR AI", "Payroll & Comp AI", "Compliance & Legal AI",
  "Document Gen AI", "Meeting Intelligence AI", "Analytics & Predictive AI",
  "Knowledge & RAG AI", "Biometrics & Vision AI",
] as const;
