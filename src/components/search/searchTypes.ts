import { LucideIcon } from "lucide-react";

export type SearchCategory = "all" | "employees" | "candidates" | "pages" | "actions";

export interface NavSearchItem {
  id: string;
  title: string;
  category: "pages";
  section: string;
  path: string;
  icon: LucideIcon;
  keywords?: string[];
  roleRequired?: string[];
}

export interface ActionSearchItem {
  id: string;
  title: string;
  description: string;
  category: "actions";
  icon: LucideIcon;
  action: () => void;
  keywords?: string[];
  shortcut?: string;
}
