export type AICategory =
  | "ALL"
  | "Recruitment AI"
  | "Employee AI"
  | "Workforce & Shift AI"
  | "Performance & OKR AI"
  | "Payroll & Comp AI"
  | "Compliance & Legal AI"
  | "Document Gen AI"
  | "Meeting Intelligence AI"
  | "Analytics & Predictive AI"
  | "Knowledge & RAG AI"
  | "Biometrics & Vision AI";

export interface AIToolItem {
  id: string;
  title: string;
  category: Exclude<AICategory, "ALL">;
  description: string;
  badge: string;
  route?: string;
  iconName: string;
  demoPrompt?: string;
  defaultOutput?: string;
}

export const AI_CATEGORIES: readonly AICategory[] = [
  "ALL",
  "Recruitment AI",
  "Employee AI",
  "Workforce & Shift AI",
  "Performance & OKR AI",
  "Payroll & Comp AI",
  "Compliance & Legal AI",
  "Document Gen AI",
  "Meeting Intelligence AI",
  "Analytics & Predictive AI",
  "Knowledge & RAG AI",
  "Biometrics & Vision AI",
] as const;
