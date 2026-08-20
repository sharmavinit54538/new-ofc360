import { create } from "zustand";
import { Department } from "@/types/hr";

export type DepartmentItem = Department;

interface DepartmentState {
  searchQuery: string;
  statusFilter: string;
  locationFilter: string;
  hiringFilter: string;

  // Selected for drawer
  selectedDepartment: Department | null;
  isDrawerOpen: boolean;

  // Form state
  isFormOpen: boolean;
  editingDepartment: Department | null;

  // Import dialog state
  isImportOpen: boolean;

  // Actions
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: string) => void;
  setLocationFilter: (l: string) => void;
  setHiringFilter: (h: string) => void;
  setSelectedDepartment: (dept: Department | null) => void;
  openDrawer: (dept: Department) => void;
  closeDrawer: () => void;
  openCreateForm: () => void;
  openEditForm: (dept: Department) => void;
  closeForm: () => void;
  openImportModal: () => void;
  closeImportModal: () => void;
}

export const useDepartmentStore = create<DepartmentState>((set) => ({
  searchQuery: "",
  statusFilter: "all",
  locationFilter: "all",
  hiringFilter: "all",

  selectedDepartment: null,
  isDrawerOpen: false,

  isFormOpen: false,
  editingDepartment: null,

  isImportOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setLocationFilter: (locationFilter) => set({ locationFilter }),
  setHiringFilter: (hiringFilter) => set({ hiringFilter }),

  setSelectedDepartment: (selectedDepartment) => set({ selectedDepartment }),
  openDrawer: (selectedDepartment) => set({ selectedDepartment, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, selectedDepartment: null }),

  openCreateForm: () => set({ isFormOpen: true, editingDepartment: null }),
  openEditForm: (editingDepartment) => set({ isFormOpen: true, editingDepartment }),
  closeForm: () => set({ isFormOpen: false, editingDepartment: null }),

  openImportModal: () => set({ isImportOpen: true }),
  closeImportModal: () => set({ isImportOpen: false }),
}));