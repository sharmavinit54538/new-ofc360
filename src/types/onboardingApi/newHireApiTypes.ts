export enum NewHireStatus { PENDING = "Pending", IN_PROGRESS = "In Progress", COMPLETED = "Completed" }
export interface NewHire {
  id: string; company_id: string; employee_id: string; employee_name: string;
  department: string; joining_date: string; workflow_id: string; status: NewHireStatus; progress_percentage: number;
}
export interface CreateNewHirePayload {
  employee_id: string; employee_name: string; department: string; joining_date: string; workflow_id: string;
}
export type UpdateNewHirePayload = Partial<CreateNewHirePayload> & { status?: NewHireStatus; progress_percentage?: number };