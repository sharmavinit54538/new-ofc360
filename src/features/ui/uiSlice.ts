import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalNotification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

export interface UiState {
  sidebarOpen: boolean;
  activeTheme: "light" | "dark" | "system";
  globalNotification: GlobalNotification | null;
  activeFilters: Record<string, string>;
  modalState: Record<string, boolean>;
}

const initialState: UiState = {
  sidebarOpen: true,
  activeTheme: "dark",
  globalNotification: null,
  activeFilters: {},
  modalState: {},
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.activeTheme = action.payload;
    },
    setNotification: (state, action: PayloadAction<GlobalNotification | null>) => {
      state.globalNotification = action.payload;
    },
    clearNotification: (state) => {
      state.globalNotification = null;
    },
    setFilter: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.activeFilters[action.payload.key] = action.payload.value;
    },
    clearFilters: (state) => {
      state.activeFilters = {};
    },
    setModalOpen: (state, action: PayloadAction<{ modalId: string; isOpen: boolean }>) => {
      state.modalState[action.payload.modalId] = action.payload.isOpen;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setNotification,
  clearNotification,
  setFilter,
  clearFilters,
  setModalOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
