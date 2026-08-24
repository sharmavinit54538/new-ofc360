import type { AICategory } from "./category";

export interface AIToolItem {
  id: string;
  title: string;
  name?: string;
  category: Exclude<AICategory, "ALL">;
  description: string;
  badge: string;
  taskType?: string;
  engine?: "ofc360-ai" | string;
  route?: string;
  iconName: string;
  demoPrompt?: string;
  defaultOutput?: string;
}
