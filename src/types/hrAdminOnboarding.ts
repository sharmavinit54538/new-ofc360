export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1001-5000"
  | "5000+";

export interface CompanyDetails {
  company_name: string;
  industry: string;
  country: string;
  city: string;
  company_size: CompanySize | "";
  timezone: string;
  address: string;
  cin_number?: string;
  gst_number?: string;
  pan_number?: string;
  tan_number?: string;
  msme_registration_number?: string;
  website?: string;
  official_email?: string;
  official_phone?: string;
}

export interface HRAdminProfile {
  first_name: string;
  last_name: string;
  profile_photo?: string; // base64 / URL
  mobile_number: string;
  designation: string;
  preferred_language: "English" | "Hindi";
}

export interface CompanyBranding {
  company_logo?: string; // base64 / URL
  company_stamp?: string; // base64 / URL (PNG transparent preferred)
  authorized_signatory_name: string;
  authorized_signatory_designation: string;
  letterhead?: string;
}

export interface OnboardingPreferences {
  work_days: string[];
  work_hours: string;
  attendance_telemetry: string;
  payroll_cycle_start: number;
  notification_channels: string[];
}

export interface OnboardingStatus {
  current_step: number;
  completed_steps: number[];
  remaining_steps: number[];
  completion_percentage: number;
  is_completed: boolean;
  completed_at?: string;
}

export interface CompleteOnboardingData {
  company: CompanyDetails;
  hr_admin: HRAdminProfile;
  branding: CompanyBranding;
  preferences: OnboardingPreferences;
  onboarding: OnboardingStatus;
}

export interface OnboardingWorkflow {
  id: string;
  name: string;
  department: string;
  tasks_count: number;
  is_active: boolean;
}

export interface NewHireOnboardingRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  join_date: string;
  progress: number;
  status: "pending" | "in_progress" | "completed";
}

export interface OnboardingDocumentItem {
  id: string;
  name: string;
  type: string;
  is_mandatory: boolean;
  status: "pending" | "uploaded" | "verified" | "rejected";
  url?: string;
}

export interface OnboardingTaskItem {
  id: string;
  title: string;
  category: string;
  assigned_to: string;
  due_days: number;
  is_completed: boolean;
}
