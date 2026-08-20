import type { Department } from "@/types/hr";

export interface DepartmentStoreState {
  departments: Department[]; selectedDept: Department | null; searchQuery: string;
}