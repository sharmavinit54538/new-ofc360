export interface APIResponse<T> { success: boolean; data?: T; message?: string; error?: string; }
export interface OnboardingStatusResponse {
  step: number; is_completed: boolean; completed_steps: number[];
  completion_percentage: number; current_step: number; completed_at?: string; last_saved_at?: string;
}
export type OnboardingWizardData = Record<string, any>;
export type SaveStepPayload = { step: number; data: Record<string, any>; };