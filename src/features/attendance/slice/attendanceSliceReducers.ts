import type { PayloadAction } from "@reduxjs/toolkit";
import type { AttendanceState, AttendanceHistoryFilters } from "./attendanceSliceTypes";
import { initialAttendanceState } from "./attendanceSliceInitialState";

export const attendanceReducers = {
  openCameraModal: (state: AttendanceState, action: PayloadAction<"check-in" | "check-out">) => {
    state.isCameraModalOpen = true; state.activeAction = action.payload;
  },
  closeCameraModal: (state: AttendanceState) => {
    state.isCameraModalOpen = false; state.activeAction = null;
  },
  setActiveAction: (state: AttendanceState, action: PayloadAction<"check-in" | "check-out" | null>) => {
    state.activeAction = action.payload;
  },
  setHistoryFilters: (state: AttendanceState, action: PayloadAction<Partial<AttendanceHistoryFilters>>) => {
    state.historyFilters = { ...state.historyFilters, ...action.payload };
  },
  setPage: (state: AttendanceState, action: PayloadAction<number>) => { state.historyFilters.page = action.payload; },
  setLimit: (state: AttendanceState, action: PayloadAction<number>) => { state.historyFilters.limit = action.payload; },
  resetHistoryFilters: (state: AttendanceState) => { state.historyFilters = initialAttendanceState.historyFilters; },
};
