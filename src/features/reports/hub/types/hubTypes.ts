import type { ReportCategory } from "../types";

export interface CategoryTabItem {
  id: ReportCategory;
  label: string;
  icon: React.ElementType;
}
