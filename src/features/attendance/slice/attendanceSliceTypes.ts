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
