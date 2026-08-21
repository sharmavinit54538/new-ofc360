export interface TimesheetFormData {
  projectName: string;
  taskDescription: string;
  loggedHours: number;
  billable: boolean;
}

export function validateTimesheetForm(data: Partial<TimesheetFormData>): string | null {
  if (!data.projectName?.trim() || !data.taskDescription?.trim()) {
    return "Project and Task details are required.";
  }
  return null;
}
