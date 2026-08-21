import { CompanyDetails, HRAdminProfile, OnboardingPreferences } from "@/types/hrAdminOnboarding";

export interface OnboardingStatusResponse {
  onboarding_status: string; completed_steps: number[]; current_step: number; is_completed: boolean; company_id?: string; completion_percentage?: number;
}
export interface OnboardingProgressResponse {
  company?: Partial<CompanyDetails>; admin_profile?: Partial<HRAdminProfile>; hr_settings?: Partial<OnboardingPreferences>;
  departments?: string[]; designations?: string[]; invites?: Array<{ email: string; role: string; department?: string }>;
  completed_steps?: number[]; current_step?: number; is_completed?: boolean;
}
export interface InviteEmployeesRequest {
  invites: Array<{ email: string; name?: string; role?: string; department?: string; designation?: string }>;
}
export interface ActivateAccountRequest {
  token: string; password?: string; new_password?: string; confirm_password?: string; full_name?: string;
}
