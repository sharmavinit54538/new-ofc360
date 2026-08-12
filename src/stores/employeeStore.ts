import { create } from "zustand";
import { type Employee } from "@/types/hr";
import { getStoredData, setStoredData } from "@/utils/storage";

const STORAGE_KEY = "ofc360_employees_v2";

interface EmployeeState {
  employees: Employee[];
  searchQuery: string;
  departmentFilter: string;
  statusFilter: string;
  setSearchQuery: (query: string) => void;
  setDepartmentFilter: (dept: string) => void;
  setStatusFilter: (status: string) => void;
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, updated: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  resetEmployees: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: getStoredData<Employee[]>(STORAGE_KEY, []),
  searchQuery: "",
  departmentFilter: "ALL",
  statusFilter: "ALL",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDepartmentFilter: (departmentFilter) => set({ departmentFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  addEmployee: (newEmpData) => {
    const nextId = `EMP-${String(get().employees.length + 1001)}`;
    const newEmployee: Employee = {
      id: nextId,
      ...newEmpData,
    };
    const updated = [newEmployee, ...get().employees];
    setStoredData(STORAGE_KEY, updated);
    set({ employees: updated });
  },

  updateEmployee: (id, updatedFields) => {
    const updated = get().employees.map((emp) =>
      emp.id === id ? { ...emp, ...updatedFields } : emp
    );
    setStoredData(STORAGE_KEY, updated);
    set({ employees: updated });
  },

  deleteEmployee: (id) => {
    const updated = get().employees.filter((emp) => emp.id !== id);
    setStoredData(STORAGE_KEY, updated);
    set({ employees: updated });
  },

  resetEmployees: () => {
    setStoredData(STORAGE_KEY, []);
    set({ employees: [] });
  },
}));
