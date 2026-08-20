import { create } from "zustand";
import type { Department } from "@/types/hr";
import type { DepartmentStoreState } from "./departments/deptTypes";

export const useDepartmentStore = create<DepartmentStoreState & {
  setDepartments: (d: Department[]) => void; setSelectedDept: (d: Department | null) => void;
  setSearchQuery: (q: string) => void; addDepartment: (d: Department) => void;
  updateDepartment: (id: string, d: Partial<Department>) => void;
}>((set) => ({
  departments: [], selectedDept: null, searchQuery: "",
  setDepartments: (departments) => set({ departments }),
  setSelectedDept: (selectedDept) => set({ selectedDept }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addDepartment: (dept) => set((s) => ({ departments: [...s.departments, dept] })),
  updateDepartment: (id, d) => set((s) => ({ departments: s.departments.map((x) => x.id === id ? { ...x, ...d } : x) })),
}));