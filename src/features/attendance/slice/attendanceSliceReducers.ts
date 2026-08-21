import type { PayloadAction } from "@reduxjs/toolkit";
import type { AttendanceState, AttendanceHistoryFilters } from "./attendanceSliceTypes";
import { initialAttendanceState } from "./attendanceSliceInitialState";

export const attendanceReducers = {
  openCameraModal: (s: AttendanceState, a: PayloadAction<"check-in" | "check-out">) => { s.isCameraModalOpen = true; s.activeAction = a.payload; },
  closeCameraModal: (s: AttendanceState) => { s.isCameraModalOpen = false; s.activeAction = null; },
  setActiveAction: (s: AttendanceState, a: PayloadAction<"check-in" | "check-out" | null>) => { s.activeAction = a.payload; },
  setHistoryFilters: (s: AttendanceState, a: PayloadAction<Partial<AttendanceHistoryFilters>>) => { s.historyFilters = { ...s.historyFilters, ...a.payload }; },
  setPage: (s: AttendanceState, a: PayloadAction<number>) => { s.historyFilters.page = a.payload; },
  setLimit: (s: AttendanceState, a: PayloadAction<number>) => { s.historyFilters.limit = a.payload; },
  resetHistoryFilters: (s: AttendanceState) => { s.historyFilters = initialAttendanceState.historyFilters; },
};
