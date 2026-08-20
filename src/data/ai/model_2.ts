import type { AIToolItem } from "@/types/ai";

export const aiModel_2: AIToolItem = {
  "id": "rec-rank",
  "title": "AI Candidate Ranking",
  "category": "Recruitment AI",
  "description": "Stack ranks all applied candidates based on role requirements and weighted skill gap scores.",
  "badge": "Stack Rank",
  "iconName": "TrendingDown",
  "demoPrompt": "Enter Job ID or Role title to stack rank candidate pool",
  "defaultOutput": "Rank #1: Alex Turner (98.2%) | Rank #2: Priyanshu Sharma (95.4%) | Rank #3: Lisa Wang (91.0%)"
};
