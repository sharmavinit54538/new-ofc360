import type { AICategory } from "./category";

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
