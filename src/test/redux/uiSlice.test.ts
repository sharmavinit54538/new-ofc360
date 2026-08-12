import { describe, it, expect } from "vitest";
import uiReducer, {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setNotification,
  clearNotification,
  setFilter,
  clearFilters,
  setModalOpen,
  UiState,
} from "@/features/ui/uiSlice";

describe("uiSlice", () => {
  const initialState: UiState = {
    sidebarOpen: true,
    activeTheme: "dark",
    globalNotification: null,
    activeFilters: {},
    modalState: {},
  };

  it("should toggle sidebar", () => {
    const state = uiReducer(initialState, toggleSidebar());
    expect(state.sidebarOpen).toBe(false);
  });

  it("should set sidebar open explicitly", () => {
    const state = uiReducer(initialState, setSidebarOpen(false));
    expect(state.sidebarOpen).toBe(false);
  });

  it("should set active theme", () => {
    const state = uiReducer(initialState, setTheme("light"));
    expect(state.activeTheme).toBe("light");
  });

  it("should set and clear global notification", () => {
    const notification = { id: "1", type: "success" as const, message: "Operation completed" };
    let state = uiReducer(initialState, setNotification(notification));
    expect(state.globalNotification).toEqual(notification);

    state = uiReducer(state, clearNotification());
    expect(state.globalNotification).toBeNull();
  });

  it("should set and clear filters", () => {
    let state = uiReducer(initialState, setFilter({ key: "department", value: "Engineering" }));
    expect(state.activeFilters).toEqual({ department: "Engineering" });

    state = uiReducer(state, clearFilters());
    expect(state.activeFilters).toEqual({});
  });

  it("should manage modal state", () => {
    const state = uiReducer(initialState, setModalOpen({ modalId: "add_employee", isOpen: true }));
    expect(state.modalState["add_employee"]).toBe(true);
  });
});
