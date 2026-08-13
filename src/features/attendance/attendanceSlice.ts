import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AttendanceHistoryFilters {
  page: number;
  limit: number;
  branch?: string;
  department?: string;
}

export interface AttendanceState {
  isCameraModalOpen: boolean;
  activeAction: "check-in" | "check-out" | null;
  historyFilters: AttendanceHistoryFilters;
}

const initialState: AttendanceState = {
  isCameraModalOpen: false,
  activeAction: null,
  historyFilters: {
    page: 1,
    limit: 20,
    branch: undefined,
    department: undefined,
  },
};

export const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    openCameraModal: (state, action: PayloadAction<"check-in" | "check-out">) => {
      state.isCameraModalOpen = true;
      state.activeAction = action.payload;
    },
    closeCameraModal: (state) => {
      state.isCameraModalOpen = false;
      state.activeAction = null;
    },
    setActiveAction: (state, action: PayloadAction<"check-in" | "check-out" | null>) => {
      state.activeAction = action.payload;
    },
    setHistoryFilters: (state, action: PayloadAction<Partial<AttendanceHistoryFilters>>) => {
      state.historyFilters = {
        ...state.historyFilters,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.historyFilters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.historyFilters.limit = action.payload;
    },
    resetHistoryFilters: (state) => {
      state.historyFilters = initialState.historyFilters;
    },
  },
});

export const {
  openCameraModal,
  closeCameraModal,
  setActiveAction,
  setHistoryFilters,
  setPage,
  setLimit,
  resetHistoryFilters,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
