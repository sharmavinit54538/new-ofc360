import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState { sidebarOpen: boolean; themeMode: 'light' | 'dark' | 'system'; activeModal: string | null; modalData: any; }
const initialState: UIState = { sidebarOpen: true, themeMode: 'light', activeModal: null, modalData: null };

export const uiSlice = createSlice({
  name: 'ui', initialState,
  reducers: {
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen; },
    setSidebarOpen: (s, a: PayloadAction<boolean>) => { s.sidebarOpen = a.payload; },
    setThemeMode: (s, a: PayloadAction<'light' | 'dark' | 'system'>) => { s.themeMode = a.payload; },
    openModal: (s, a: PayloadAction<{ modalId: string; data?: any }>) => { s.activeModal = a.payload.modalId; s.modalData = a.payload.data || null; },
    closeModal: (s) => { s.activeModal = null; s.modalData = null; },
  },
});

export const { toggleSidebar, setSidebarOpen, setThemeMode, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;