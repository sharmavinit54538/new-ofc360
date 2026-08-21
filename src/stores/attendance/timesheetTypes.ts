export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date?: string;
  projectName?: string;
  project?: string;
  taskDescription?: string;
  task?: string;
  loggedHours?: number;
  hoursWorked?: number;
  billable?: boolean;
  status: "draft" | "submitted" | "approved" | "rejected" | string;
  [key: string]: unknown;
}
