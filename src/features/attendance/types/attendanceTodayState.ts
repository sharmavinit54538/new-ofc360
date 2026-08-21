export interface AttendanceTodayState {
  checked_in: boolean;
  checked_out: boolean;
  check_in_time?: string;
  check_out_time?: string;
  working_hours?: number;
  message: string;
}
