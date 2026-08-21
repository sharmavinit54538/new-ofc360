export interface DisplayedTimesheet {
  id: string;
  employeeName: string;
  projectName: string;
  taskDescription: string;
  loggedHours: number;
  billable: boolean;
  status: string;
}
