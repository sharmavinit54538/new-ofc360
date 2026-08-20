import type { RequisitionStatus } from "./atsStatusTypes";

export interface Requisition {
  id: string; title: string; department: string; hiringManager: string;
  positionsCount: number; budgetMin: number; budgetMax: number; currency: string;
  targetStartDate: string; priority: "Low" | "Medium" | "High" | "Urgent";
  status: RequisitionStatus; approvedBy?: string; approvedAt?: string; jobDescription: string;
}

export interface ScreeningQuestion {
  id: string; question: string; type: "text" | "multiple_choice" | "yes_no" | "numeric";
  required: boolean; idealAnswer?: string; weight: number;
}