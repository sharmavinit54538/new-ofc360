import { create } from "zustand";
import type { Employee } from "@/types/hr";

export const useEmployeeStore = create<{
  employees: Employee[]; selectedEmployee: Employee | null; searchQuery: string;
  departmentFilter: string; setEmployees: (e: Employee[]) => void;
  setSelectedEmployee: (e: Employee | null) => void; setSearchQuery: (q: string) => void;
  setDepartmentFilter: (d: string) => void; addEmployee: (e: Employee) => void;
  updateEmployee: (id: string, e: Partial<Employee>) => void;
}>((set) => ({
  employees: [], selectedEmployee: null, searchQuery: "", departmentFilter: "ALL",
  setEmployees: (employees) => set({ employees }),
  setSelectedEmployee: (selectedEmployee) => set({ selectedEmployee }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDepartmentFilter: (departmentFilter) => set({ departmentFilter }),
  addEmployee: (emp) => set((s) => ({ employees: [emp, ...s.employees] })),
  updateEmployee: (id, e) => set((s) => ({ employees: s.employees.map((x) => x.id === id ? { ...x, ...e } : x) })),
}));