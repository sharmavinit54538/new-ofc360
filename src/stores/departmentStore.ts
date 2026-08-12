import { create } from "zustand";

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  head: string;
  manager: string;
  location: string;
  employeeCount: number | null;
  capacity: number | null;
  openPositions: number | null;
  budget?: string;
  costCenter?: string;
  status: "Active" | "Inactive" | "Hiring" | "Growing";
  hiringStatus: "Open" | "Paused" | "Closed";
  parentDepartment?: string;
  extension?: string;
  color?: string;
  icon?: string;
  description?: string;
  notes?: string;
  createdAt: string;
}

interface DepartmentState {
  departments: DepartmentItem[];
  searchQuery: string;
  statusFilter: string;
  locationFilter: string;
  hiringFilter: string;

  // Selected for drawer
  selectedDepartment: DepartmentItem | null;
  isDrawerOpen: boolean;

  // Form state
  isFormOpen: boolean;
  editingDepartment: DepartmentItem | null;

  // Import dialog state
  isImportOpen: boolean;

  // Actions
  setSearchQuery: (q: string) => void;
  setStatusFilter: (s: string) => void;
  setLocationFilter: (l: string) => void;
  setHiringFilter: (h: string) => void;
  setSelectedDepartment: (dept: DepartmentItem | null) => void;
  openDrawer: (dept: DepartmentItem) => void;
  closeDrawer: () => void;
  openCreateForm: () => void;
  openEditForm: (dept: DepartmentItem) => void;
  closeForm: () => void;
  openImportModal: () => void;
  closeImportModal: () => void;

  addDepartment: (dept: Omit<DepartmentItem, "id" | "createdAt">) => void;
  updateDepartment: (id: string, updates: Partial<DepartmentItem>) => void;
  deleteDepartment: (id: string) => void;
}

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: [],
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

  addDepartment: (deptData) =>
    set((state) => {
      const newDept: DepartmentItem = {
        ...deptData,
        id: "dept_" + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString().split("T")[0],
      };
      return { departments: [newDept, ...state.departments], isFormOpen: false };
    }),

  updateDepartment: (id, updates) =>
    set((state) => ({
      departments: state.departments.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      isFormOpen: false,
      editingDepartment: null,
    })),

  deleteDepartment: (id) =>
    set((state) => ({
      departments: state.departments.filter((d) => d.id !== id),
      selectedDepartment: state.selectedDepartment?.id === id ? null : state.selectedDepartment,
      isDrawerOpen: state.selectedDepartment?.id === id ? false : state.isDrawerOpen,
    })),
}));
