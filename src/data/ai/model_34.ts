import type { AIToolItem } from "@/types/ai";

export const aiModel_34: AIToolItem = {
  "id": "pay-insights",
  "title": "Payroll Insights AI",
  "category": "Payroll & Comp AI",
  "description": "Detects month-over-month salary variances, unapproved bonus spikes, and tax anomalies.",
  "badge": "Insights",
  "route": "/payroll",
  "iconName": "Calculator",
  "demoPrompt": "Analyze September Payroll vs August Payroll Variance",
  "defaultOutput": "Total Payroll: ₹48.2L (+3.1% vs last month). Variance caused by 2 new joiners and festival bonus allowances."
};
