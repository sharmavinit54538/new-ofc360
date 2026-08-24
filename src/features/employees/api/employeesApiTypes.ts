// eslint-disable-file -- ESLint parser bug with complex RTK Query endpoint definitions
export interface GetEmployeesQueryParams {
  department?: string;
  status?: string;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
  employment_type?: string;
  designation?: string;
  shift?: string;
  sort?: string;
  order?: string;
}

export type GetEmployeesQueryArg = GetEmployeesQueryParams | void;

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  probationEmployees: number;
  departmentCounts?: Record<string, number>;
}

export interface EmployeeDashboardData {
  totalCount: number;
  activeCount: number;
  newHiresThisMonth: number;
  turnoverRate: number;
  departmentDistribution: Array<{ department: string; count: number }>;
  recentActivities?: Array<{ id: string; type: string; description: string; timestamp: string }>;
}

export interface ImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors?: Array<{ row: number; error: string }>;
}

export interface OnboardingStatus {
  employeeId: string;
  status: "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | string;
  completedSteps: number;
  totalSteps: number;
  steps?: Array<{ id: string; name: string; isCompleted: boolean }>;
}

export interface ActivateEmployeePayload {
  id?: string;
  employee_id?: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ActivateEmployeeResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
  token?: string;
  access_token?: string;
  refreshToken?: string;
  user?: unknown;
}

export interface EmployeeCreateInput {
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  name?: string;
  personal_email?: string;
  personalEmail?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  phoneNumber?: string;
  department?: string;
  department_name?: string;
  designation?: string;
  joining_date?: string;
  joiningDate?: string;
  joinedAt?: string;
  employment_type?: string;
  employmentType?: string;
  role?: string;
  systemRole?: string;
  system_role?: string;
  backendRole?: string;
  employee_id?: string;
  employeeCode?: string;
  id?: string;
  company_email?: string;
  companyWorkEmail?: string;
  work_email?: string;
  alternate_phone?: string;
  alternatePhone?: string;
  gender?: string;
  date_of_birth?: string;
  dob?: string;
  blood_group?: string;
  bloodGroup?: string;
  marital_status?: string;
  maritalStatus?: string;
  profile_photo_url?: string;
  photoUrl?: string;
  avatar?: string;
  team?: string;
  reporting_manager_id?: string;
  reportingManager?: string;
  branch?: string;
  branchOffice?: string;
  work_location?: string;
  workLocation?: string;
  probation_period_months?: number;
  probationPeriod?: number;
  shift?: string;
  employee_capacity?: number;
  capacity?: number;
  cost_center_id?: string;
  costCenterId?: string;
  ctc?: number;
  salary?: number;
  basic_salary?: number;
  basicSalary?: number;
  hra?: number;
  bonus?: number;
  pf?: number;
  pfDeduction?: number;
  esi?: number;
  esiDeduction?: number;
  professional_tax?: number;
  profTax?: number;
  leave_group?: string;
  leaveGroup?: string;
  role_metadata?: unknown;
  roleMetadata?: unknown;
  addresses?: Array<Record<string, unknown>>;
  documents?: Array<Record<string, unknown>>;
  kycDocuments?: Array<Record<string, unknown>>;
  kyc_documents?: Array<Record<string, unknown>>;
  education?: Array<Record<string, unknown>>;
  experience?: Array<Record<string, unknown>>;
  workExperience?: Array<Record<string, unknown>>;
  work_experience?: Array<Record<string, unknown>>;
  skills?: Array<Record<string, unknown>>;
  emergency_contacts?: Array<Record<string, unknown>>;
  emergencyContacts?: Array<Record<string, unknown>>;
  bank_accounts?: Array<Record<string, unknown>>;
  bankAccounts?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export type {
  GetEmployeesQueryParams as EmployeesApiGetEmployeesQueryParams,
  GetEmployeesQueryArg as EmployeesApiGetEmployeesQueryArg,
  EmployeeStats as EmployeesApiEmployeeStats,
  EmployeeDashboardData as EmployeesApiEmployeeDashboardData,
  ImportResult as EmployeesApiImportResult,
  OnboardingStatus as EmployeesApiOnboardingStatus,
  ActivateEmployeePayload as EmployeesApiActivateEmployeePayload,
  ActivateEmployeeResponse as EmployeesApiActivateEmployeeResponse,
  EmployeeCreateInput as EmployeesApiEmployeeCreateInput,
};