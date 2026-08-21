import { createSlice } from "@reduxjs/toolkit";
import { initialAttendanceState } from "./attendanceSliceInitialState";
import { attendanceReducers } from "./attendanceSliceReducers";

export * from "./attendanceSliceTypes";
export const attendanceSlice = createSlice({
  name: "attendance",
  initialState: initialAttendanceState,
  reducers: attendanceReducers,
});
export const {
  openCameraModal, closeCameraModal, setActiveAction,
  setHistoryFilters, setPage, setLimit, resetHistoryFilters,
} = attendanceSlice.actions;
export default attendanceSlice.reducer;
