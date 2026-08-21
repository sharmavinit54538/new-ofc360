export interface RosterItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  shiftName: string;
  timing: string;
  dayOfWeek: string;
  date: string;
  [key: string]: unknown;
}
