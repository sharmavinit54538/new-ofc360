export interface OnboardingAPIResponse<T = any> {
  success: boolean;
  message: string;
  current_step: number;
  onboarding_completed: boolean;
  data: T;
  redirect_step?: number | null;
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// ─────────────────────────────────────────────────────────────
// Company Admin Onboarding Types (base /onboarding)
// ─────────────────────────────────────────────────────────────

export interface OnboardingStatusResponse {
  onboarding_completed: boolean;
  current_step: number;
  completion_percentage: number;
  company_completed: boolean;
  admin_completed: boolean;
  hr_completed: boolean;
  departments_completed: boolean;
  designations_completed: boolean;
  employees_invited: boolean;
}

export interface CompanyProfilePayload {
  company_name: string;
  company_logo?: string;
  industry?: string;
  company_size?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  tax_id?: string;
}

export interface AdminProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  avatar_url?: string;
}

export interface HRSettingsPayload {
  work_week?: string[];
  leave_year_start?: string;
  working_hours_per_day?: number;
  probation_period_months?: number;
  require_document_verification?: boolean;
  auto_invite_employees?: boolean;
}

export interface DepartmentItem {
  id?: string;
  name: string;
  code?: string;
  description?: string;
}

export interface DesignationItem {
  id?: string;
  title: string;
  department_id?: string;
  department_name?: string;
  level?: string;
}

export interface InviteEmployeeItem {
  email: string;
  name?: string;
  role?: string;
  department?: string;
  designation?: string;
}

export interface InviteEmployeesPayload {
  invites: InviteEmployeeItem[];
}

export interface ActivateAccountPayload {
  token: string;
  password?: string;
  full_name?: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  email?: string;
  company_name?: string;
  role?: string;
}

export interface CompanyOnboardingProgressData {
  company_profile?: Partial<CompanyProfilePayload>;
  admin_profile?: Partial<AdminProfilePayload>;
  hr_settings?: Partial<HRSettingsPayload>;
  departments?: DepartmentItem[] | string[];
  designations?: DesignationItem[] | string[];
  shifts?: any[];
  leave_policies?: any[];
  step_flags?: Record<string, boolean>;
}

// ─────────────────────────────────────────────────────────────
// Employee Onboarding Types (base /employee-onboarding)
// ─────────────────────────────────────────────────────────────

export interface EmployeeOnboardingStatus {
  onboarding_completed: boolean;
  current_step: number;
  completion_percentage: number;
  steps_completed: Record<string, boolean>;
}

export interface AddressBlock {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface EmployeeStep1Personal {
  first_name: string;
  middle_name?: string;
  last_name: string;
  profile_photo_url?: string;
  gender: string;
  date_of_birth: string;
  marital_status: string;
  blood_group?: string;
  nationality: string;
  father_name: string;
  mother_name: string;
  spouse_name?: string;
  personal_email: string;
  phone: string;

  // Address blocks (Current & Permanent)
  current_address_line1: string;
  current_address_line2?: string;
  current_city: string;
  current_state: string;
  current_country: string;
  current_pincode: string;

  permanent_address_line1: string;
  permanent_address_line2?: string;
  permanent_city: string;
  permanent_state: string;
  permanent_country: string;
  permanent_pincode: string;
}

export interface EmployeeStep2Bank {
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  branch_name?: string;
  account_type?: string;
  [key: string]: any;
}

export interface EmployeeStep3Statutory {
  pan_number?: string;
  aadhaar_number?: string;
  passport_number?: string;
  pf_account_number?: string;
  esi_number?: string;
  [key: string]: any;
}

export interface EmployeeStep4EmergencyContact {
  primary_contact_name: string;
  primary_relationship: string;
  primary_phone: string;
  secondary_contact_name?: string;
  secondary_relationship?: string;
  secondary_phone?: string;
  [key: string]: any;
}

export interface EmployeeStep5Education {
  highest_qualification: string;
  institution_name: string;
  year_of_passing: number | string;
  field_of_study?: string;
  grade_or_gpa?: string;
  [key: string]: any;
}

export interface EmployeeStep6PriorEmployment {
  previous_company?: string;
  last_designation?: string;
  employment_duration?: string;
  reason_for_leaving?: string;
  reference_contact?: string;
  [key: string]: any;
}

export interface EmployeeStep7AdditionalDetails {
  shirt_size?: string;
  dietary_preference?: string;
  bio?: string;
  hobbies?: string;
  [key: string]: any;
}

export interface EmployeeStep8Document {
  id: string;
  name: string;
  document_type: string;
  file_url?: string;
  status: 'pending' | 'verified' | 'rejected' | 'uploaded';
  uploaded_at?: string;
  verification_notes?: string;
}

export interface EmployeeStep8FinalizePayload {
  documents?: EmployeeStep8Document[];
  notes?: string;
  all_documents_submitted?: boolean;
}

export interface EmployeeStep9Policies {
  nd_agreement_accepted: boolean;
  code_of_conduct_accepted: boolean;
  it_policy_accepted: boolean;
  accepted_at?: string;
  digital_signature?: string;
  [key: string]: any;
}

export interface EmployeeOnboardingProgressData {
  step_1_personal?: Partial<EmployeeStep1Personal>;
  step_2_bank?: Partial<EmployeeStep2Bank>;
  step_3_statutory?: Partial<EmployeeStep3Statutory>;
  step_4_emergency?: Partial<EmployeeStep4EmergencyContact>;
  step_5_education?: Partial<EmployeeStep5Education>;
  step_6_experience?: Partial<EmployeeStep6PriorEmployment>;
  step_7_additional?: Partial<EmployeeStep7AdditionalDetails>;
  step_8_documents?: EmployeeStep8Document[];
  step_9_policies?: Partial<EmployeeStep9Policies>;
  completed_steps?: Record<string, boolean>;
  current_step?: number;
  onboarding_completed?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Onboarding Admin Oversight Types (base /admin/employee-onboarding)
// ─────────────────────────────────────────────────────────────

export interface EmployeeProgressItem {
  employee_id: string;
  employee_name: string;
  email: string;
  department: string;
  designation: string;
  current_step: number;
  completion_percentage: number;
  onboarding_completed: boolean;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  last_updated: string;
  documents?: EmployeeStep8Document[];
}

export interface EmployeeProgressFilters {
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface VerifyDocumentPayload {
  verified: boolean;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────
// HR Onboarding Workflow Types (base /hr-admin/onboarding)
// ─────────────────────────────────────────────────────────────

export interface WorkflowStepConfig {
  id: string;
  title: string;
  description?: string;
  assigned_role?: string;
  step_order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  department?: string;
  steps?: WorkflowStepConfig[];
  is_active?: boolean;
  created_at?: string;
}

export interface CreateWorkflowPayload {
  name: string;
  description?: string;
  department?: string;
  steps?: WorkflowStepConfig[];
}

export interface NewHireTrackItem {
  id: string;
  employee_name: string;
  email: string;
  department: string;
  designation: string;
  start_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  wizard_step?: number;
  completed_percentage?: number;
}

export interface CreateNewHirePayload {
  employee_name: string;
  email: string;
  department: string;
  designation: string;
  start_date: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  description?: string;
  is_mandatory: boolean;
  allowed_formats?: string[];
  category?: string;
}

export interface CreateDocumentRequirementPayload {
  name: string;
  description?: string;
  is_mandatory: boolean;
  allowed_formats?: string[];
  category?: string;
}

export interface OnboardingTaskRequirement {
  id: string;
  title: string;
  assignee_role: string;
  due_days: number;
  is_required: boolean;
  description?: string;
  is_completed?: boolean;
}

export interface CreateTaskRequirementPayload {
  title: string;
  assignee_role: string;
  due_days: number;
  is_required: boolean;
  description?: string;
}
