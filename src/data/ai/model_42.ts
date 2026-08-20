import type { AIToolItem } from "@/types/ai";

export const aiModel_42: AIToolItem = {
  "id": "comp-doc",
  "title": "Document Compliance Checker",
  "category": "Compliance & Legal AI",
  "description": "Verifies authenticity of Aadhaar, PAN, Passports, and educational degree certificates.",
  "badge": "Doc Checker",
  "route": "/ai/documents",
  "iconName": "FileCheck",
  "demoPrompt": "Verify PAN and Aadhaar checksum for new employee KYC",
  "defaultOutput": "PAN & Aadhaar match NSDL registry checksum. Identity verified: Active & Valid."
};
