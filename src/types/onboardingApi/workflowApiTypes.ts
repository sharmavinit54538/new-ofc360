export interface Workflow {
  id: string; company_id: string; title: string; target_department: string;
  document_checklist: any[]; task_checklist: any[]; created_at: string;
}
export interface CreateWorkflowPayload {
  title: string; target_department: string; document_checklist: any[]; task_checklist: any[];
}