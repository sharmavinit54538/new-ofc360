export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+" | string;

export interface CompanyDetails {
  company_name: string;
  industry: string;
  country: string;
  city: string;
  company_size: CompanySize | string;
  timezone: string;
  address?: string;
  tax_id?: string;
  pan_number?: string;
  gst_number?: string;
  website?: string;
  [key: string]: any;
}

export interface HRAdminProfile {
  first_name: string;
  last_name: string;
  mobile_number: string;
  designation: string;
  preferred_language?: string;
  department?: string;
  email?: string;
  [key: string]: any;
}

export interface CompanyBranding {
  logo_url?: string;
  primary_color?: string;
  accent_color?: string;
  company_domain?: string;
  authorized_signatory_name?: string;
  authorized_signatory_designation?: string;
  signature_url?: string;
  [key: string]: any;
}

export interface OnboardingPreferences {
  enable_two_factor_auth?: boolean;
  attendance_mode?: string;
  payroll_cycle?: string;
  leave_policy_enabled?: boolean;
  working_days?: string[];
  fiscal_year_start?: string;
  [key: string]: any;
}

export interface OnboardingStatus {
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
  completion_percentage: number;
  completed_at?: string | null;
  [key: string]: any;
}

export interface CompleteOnboardingData {
  company: CompanyDetails;
  hr_admin: HRAdminProfile;
  branding: CompanyBranding;
  preferences: OnboardingPreferences;
  onboarding: OnboardingStatus;
  [key: string]: any;
}

export interface OnboardingWorkflow {
  id: string;
  name: string;
  description?: string;
  stepsCount?: number;
  [key: string]: any;
}

export interface NewHireOnboardingRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  email: string;
  designation: string;
  department: string;
  joining_date: string;
  status: string;
  completion_percentage: number;
  [key: string]: any;
}

export interface OnboardingDocumentItem {
  id: string;
  title: string;
  type: string;
  file_url?: string;
  status: string;
  [key: string]: any;
}

export interface OnboardingTaskItem {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  assigned_to?: string;
  status: string;
  [key: string]: any;
}