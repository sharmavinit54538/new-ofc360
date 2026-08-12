import { RootState } from "@/app/store";

export const selectUi = (state: RootState) => state.ui;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectActiveTheme = (state: RootState) => state.ui.activeTheme;
export const selectGlobalNotification = (state: RootState) => state.ui.globalNotification;
export const selectActiveFilters = (state: RootState) => state.ui.activeFilters;
export const selectModalState = (modalId: string) => (state: RootState) =>
  Boolean(state.ui.modalState[modalId]);
