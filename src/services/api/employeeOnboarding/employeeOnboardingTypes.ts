export interface EmployeeOnboardingStatusResponse {
  current_step: number; completed_steps: number[]; is_completed: boolean; completion_percentage: number; completed_at?: string;
}
export interface EmployeeOnboardingProgressResponse {
  step_1_personal?: Record<string, any>; step_2_identity?: Record<string, any>; step_3_emergency_contacts?: Record<string, any>;
  step_4_education?: Record<string, any>; step_5_experience?: Record<string, any>; step_6_bank?: Record<string, any>;
  step_7_tax?: Record<string, any>; step_8_documents?: Array<{ id: string; name: string; type: string; status: string; url?: string }>;
  step_9_policies?: Record<string, any>; completed_steps?: number[]; is_completed?: boolean;
}
export interface EmployeeDocumentUploadResponse {
  id: string; name: string; type: string; status: string; url?: string; uploaded_at: string;
}
