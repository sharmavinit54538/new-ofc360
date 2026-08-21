import type { AttendanceState } from "./attendanceSliceTypes";

export const initialAttendanceState: AttendanceState = {
  isCameraModalOpen: false,
  activeAction: null,
  historyFilters: {
    page: 1,
    limit: 20,
    branch: undefined,
    department: undefined,
  },
};
