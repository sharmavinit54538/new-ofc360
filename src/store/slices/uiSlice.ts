import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  themeMode: 'light' | 'dark' | 'system';
  activeModal: string | null;
  modalData: any;
}

const initialState: UIState = {
  sidebarOpen: true,
  themeMode: 'light',
  activeModal: null,
  modalData: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.themeMode = action.payload;
    },
    openModal: (state, action: PayloadAction<{ modalId: string; data?: any }>) => {
      state.activeModal = action.payload.modalId;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setThemeMode, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;