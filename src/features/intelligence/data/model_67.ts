import type { AIToolItem } from "@/types/ai";

export const aiModel_67: AIToolItem = {
  "id": "rag-kb",
  "title": "AI Knowledge Base (RAG)",
  "category": "Knowledge & RAG AI",
  "description": "Enterprise semantic vector search across internal PDF documents, SOPs, and company wikis.",
  "badge": "Vector RAG",
  "route": "/ai-chat",
  "iconName": "Database",
  "demoPrompt": "Search knowledge base: What is the procedure for international business travel reimbursements?",
  "defaultOutput": "Found in Finance SOP (Doc #402): Pre-approval from VP Finance required for flights > 4 hours."
};
