import type { AIToolItem } from "@/types/ai";

export const aiModel_36: AIToolItem = {
  "id": "pay-error",
  "title": "Payroll Error Detection",
  "category": "Payroll & Comp AI",
  "description": "Pre-payroll audit scanner flagging duplicate bank accounts, negative payouts, and PF mismatch.",
  "badge": "Audit Scan",
  "iconName": "ShieldAlert",
  "demoPrompt": "Run pre-disbursement error audit on 150 payslips",
  "defaultOutput": "Zero critical errors found. 1 Warning: Employee EMP-1088 has updated IFSC code pending verification."
};
