import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function writeStrictFile(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);
  if (lines.length > 20) {
    console.warn(`WARNING: ${filePath} has ${lines.length} lines!`);
  }
  fs.writeFileSync(filePath, trimmed, 'utf8');
}

// -------------------------------------------------------------
// 1. ATTENDANCE API TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/api/attendance/attendanceRecord.ts'), `
export interface AttendanceRecord {
  id: string; employeeId: string; employeeName: string; date: string;
  checkIn?: string; checkOut?: string;
  status: 'present' | 'absent' | 'half-day' | 'late' | 'on-leave';
  workHours?: number; faceVerificationStatus?: 'verified' | 'failed' | 'pending'; location?: string;
}
`);

writeStrictFile(path.join(root, 'src/types/api/attendance/leaveTypes.ts'), `
export interface LeaveRequest {
  id: string; employeeId: string; employeeName: string;
  leaveType: 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string; endDate: string; totalDays: number; reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedOn: string; reviewedBy?: string; reviewedAt?: string;
}

export interface LeaveBalance {
  employeeId: string;
  sickLeave: { total: number; used: number; remaining: number };
  casualLeave: { total: number; used: number; remaining: number };
  earnedLeave: { total: number; used: number; remaining: number };
}
`);

writeStrictFile(path.join(root, 'src/types/api/attendance.ts'), `
export type { AttendanceRecord } from "./attendance/attendanceRecord";
export type { LeaveRequest, LeaveBalance } from "./attendance/leaveTypes";
`);

// -------------------------------------------------------------
// 2. AUTH API TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/api/auth/loginTypes.ts'), `
export interface LoginRequest { email: string; password?: string; otp?: string; }
export interface RegisterRequest { name: string; email: string; password?: string; companyName?: string; role?: string; }
export interface AuthResponse { token: string; refreshToken?: string; user: any; expiresIn?: number; }
export interface SendOtpRequest { email: string; type?: 'login' | 'register' | 'reset-password'; }
export interface VerifyOtpRequest { email: string; otp: string; }
`);

writeStrictFile(path.join(root, 'src/types/api/auth/sessionTypes.ts'), `
export interface ResetPasswordRequest { token: string; newPassword?: string; password?: string; }
export interface RefreshTokenRequest { refreshToken: string; }
export interface UserSession { id: string; userId: string; token: string; device?: string; ipAddress?: string; createdAt: string; expiresAt: string; }
`);

writeStrictFile(path.join(root, 'src/types/api/auth.ts'), `
export type { LoginRequest, RegisterRequest, AuthResponse, SendOtpRequest, VerifyOtpRequest } from "./auth/loginTypes";
export type { ResetPasswordRequest, RefreshTokenRequest, UserSession } from "./auth/sessionTypes";
`);

// -------------------------------------------------------------
// 3. EMPLOYEES API TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/api/employees/employeeTypes.ts'), `
export interface Employee {
  id: string; employeeId?: string; full_name?: string; name?: string; email: string;
  phone?: string; department: string; designation?: string; role?: string;
  joiningDate?: string; status: 'active' | 'inactive' | 'on-leave' | 'probation';
  salary?: { basic: number; hra: number; allowances: number; deductions: number; net: number; };
}
export interface CreateEmployeeRequest {
  name: string; email: string; phone?: string; department: string; designation?: string;
  role?: string; joiningDate?: string; salary?: { basic: number; hra: number; allowances: number; };
}
export type UpdateEmployeeRequest = Partial<CreateEmployeeRequest> & { status?: string; };
`);

writeStrictFile(path.join(root, 'src/types/api/employees/filterTypes.ts'), `
export interface EmployeeFilters {
  department?: string; status?: string; role?: string; search?: string;
  page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc';
}
export interface Department { id: string; name: string; description?: string; headId?: string; headName?: string; employeeCount?: number; }
`);

writeStrictFile(path.join(root, 'src/types/api/employees.ts'), `
export type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from "./employees/employeeTypes";
export type { EmployeeFilters, Department } from "./employees/filterTypes";
`);

// -------------------------------------------------------------
// 4. PAYROLL API TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/api/payroll/salaryTypes.ts'), `
export interface SalaryStructure {
  id: string; name: string; description?: string;
  components: { name: string; type: 'earning' | 'deduction'; calculationType: 'flat' | 'percentage'; value: number; }[];
}
export interface Payslip {
  id: string; employeeId: string; employeeName: string; month: string; year: number;
  earnings: { name: string; amount: number }[]; deductions: { name: string; amount: number }[];
  grossPay: number; totalDeductions: number; netPay: number; status: 'draft' | 'generated' | 'paid';
}
`);

writeStrictFile(path.join(root, 'src/types/api/payroll/payrollProcessTypes.ts'), `
export interface ProcessPayrollRequest { month: string; year: number; employeeIds?: string[]; }
export interface PayrollSummary { month: string; year: number; totalGross: number; totalDeductions: number; totalNet: number; employeeCount: number; status: 'pending' | 'processing' | 'completed'; }
`);

writeStrictFile(path.join(root, 'src/types/api/payroll.ts'), `
export type { SalaryStructure, Payslip } from "./payroll/salaryTypes";
export type { ProcessPayrollRequest, PayrollSummary } from "./payroll/payrollProcessTypes";
`);

// -------------------------------------------------------------
// 5. PERFORMANCE API TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/api/performance/performanceTypes.ts'), `
export interface PerformanceReview {
  id: string; employeeId: string; employeeName: string; reviewerId: string; reviewerName: string;
  period: string; ratings: { category: string; score: number; comments: string; }[];
  overallScore: number; feedback: string; status: 'draft' | 'submitted' | 'completed';
}
export interface Goal {
  id: string; employeeId: string; title: string; description: string;
  category: string; targetDate: string; progress: number; status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
}
`);

writeStrictFile(path.join(root, 'src/types/api/performance.ts'), `
export type { PerformanceReview, Goal } from "./performance/performanceTypes";
`);

// -------------------------------------------------------------
// 6. RECRUITMENT API TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/api/recruitment/jobTypes.ts'), `
export interface JobPosting {
  id: string; title: string; department: string; location: string; type: 'full-time' | 'part-time' | 'contract';
  experience: string; salary?: { min: number; max: number; currency: string; }; description: string;
  requirements: string[]; status: 'draft' | 'published' | 'closed'; applicantCount?: number; postedDate: string;
}
`);

writeStrictFile(path.join(root, 'src/types/api/recruitment/candidateTypes.ts'), `
export interface Candidate {
  id: string; jobId: string; jobTitle?: string; name: string; email: string; phone: string;
  resumeUrl?: string; matchScore?: number; stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string; notes?: string[];
}
export interface ScheduleInterviewRequest { candidateId: string; jobId: string; interviewers: string[]; scheduledAt: string; type: 'technical' | 'hr' | 'managerial'; link?: string; }
`);

writeStrictFile(path.join(root, 'src/types/api/recruitment.ts'), `
export type { JobPosting } from "./recruitment/jobTypes";
export type { Candidate, ScheduleInterviewRequest } from "./recruitment/candidateTypes";
`);

// -------------------------------------------------------------
// 7. SETTINGS API TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/api/settings/securityHrTypes.ts'), `
export interface SecuritySetting { twoFactorEnabled: boolean; passwordExpiryDays: number; sessionTimeoutMinutes: number; ipWhitelist: string[]; }
export interface HRSettings { headName: string; head_name?: string; officialEmail: string; official_email?: string; phone: string; escalationLead: string; escalation_lead?: string; grievanceEmail: string; grievance_email?: string; autoOnboardingAlerts: boolean; auto_onboarding_alerts?: boolean; policyDigestWeekly: boolean; policy_digest_weekly?: boolean; companyId?: string; company_id?: string; updatedAt?: string; updated_at?: string; }
export interface UpdateHRSettingsRequest { headName?: string; head_name?: string; officialEmail?: string; official_email?: string; phone?: string; escalationLead?: string; escalation_lead?: string; grievanceEmail?: string; grievance_email?: string; autoOnboardingAlerts?: boolean; auto_onboarding_alerts?: boolean; policyDigestWeekly?: boolean; policy_digest_weekly?: boolean; }
`);

writeStrictFile(path.join(root, 'src/types/api/settings/mfaTypes.ts'), `
export interface MFASettings { enabled: boolean; mfaEnabled?: boolean; mfa_enabled?: boolean; twoFactorEnabled?: boolean; two_factor_enabled?: boolean; type?: string; method?: "authenticator" | "sms" | "email"; }
export interface EnableMFAResponse { enabled: boolean; requiresVerification?: boolean; requires_verification?: boolean; secret?: string; qrCodeUri?: string; qr_code_uri?: string; qrCode?: string; qr_code?: string; provisioningUri?: string; provisioning_uri?: string; recoveryCodes?: string[]; recovery_codes?: string[]; message?: string; }
export interface VerifyMFARequest { code: string; otp?: string; secret?: string; }
export interface DisableMFARequest { password?: string; code?: string; }
`);

writeStrictFile(path.join(root, 'src/types/api/settings/billingTypes.ts'), `
export interface BillingSubscription { id?: string; plan: string; planName?: string; plan_name?: string; tier?: string; billingCycle: "Monthly" | "Annual" | "Quarterly" | string; billing_cycle?: string; price: number; amount?: number; currency: string; status: "active" | "trial" | "past_due" | "canceled" | "incomplete" | "inactive" | string; seats: number; totalSeats?: number; total_seats?: number; usedSeats: number; used_seats?: number; autoRenew?: boolean; auto_renew?: boolean; trialEndsAt?: string; trial_ends_at?: string; renewalDate?: string; renewal_date?: string; currentPeriodEnd?: string; current_period_end?: string; invoices?: any[]; }
export interface InvoiceItem { id: string; invoiceNumber?: string; invoice_number?: string; date: string; amount: number; currency: string; status: "paid" | "pending" | "overdue" | "failed" | string; pdfUrl?: string; pdf_url?: string; download_url?: string; }
export interface UpgradePlanRequest { plan: string; billingCycle?: "Monthly" | "Annual" | "Quarterly" | string; billing_cycle?: string; seats?: number; paymentMethodId?: string; payment_method_id?: string; }
export interface UpdateSeatsRequest { seats: number; }
`);

writeStrictFile(path.join(root, 'src/types/api/settings/rolePermissionTypes.ts'), `
export interface RolePermissionItem { id?: string; role: string; role_name?: string; permissions: string[]; modulePermissions?: Record<string, string[]>; module_permissions?: Record<string, string[]>; }
export interface RolePermissionMatrix { roles: string[]; modules: string[]; matrix: Record<string, Record<string, boolean>>; }
export interface UpdateRolePermissionsRequest { role: string; permissions?: string[]; modulePermissions?: Record<string, string[]>; module_permissions?: Record<string, string[]>; }
export interface CompanyProfileSettings { companyName: string; legalEntityName?: string; businessRegistrationNumber?: string; taxIdGstPan?: string; industry?: string; companySize?: string; websiteUrl?: string; officialEmail: string; officialPhone: string; headquartersAddress?: any; logoUrl?: string; brandColorPrimary?: string; brandColorSecondary?: string; timezone?: string; currency?: string; fiscalYearStartMonth?: number; }
export interface AuditLogQueryFilters { actor?: string; module?: string; action?: string; startDate?: string; endDate?: string; page?: number; limit?: number; }
`);

writeStrictFile(path.join(root, 'src/types/api/settings.ts'), `
export type { SecuritySetting, HRSettings, UpdateHRSettingsRequest } from "./settings/securityHrTypes";
export type { MFASettings, EnableMFAResponse, VerifyMFARequest, DisableMFARequest } from "./settings/mfaTypes";
export type { BillingSubscription, InvoiceItem, UpgradePlanRequest, UpdateSeatsRequest } from "./settings/billingTypes";
export type { RolePermissionItem, RolePermissionMatrix, UpdateRolePermissionsRequest, CompanyProfileSettings, AuditLogQueryFilters } from "./settings/rolePermissionTypes";
`);

// -------------------------------------------------------------
// 8. API INDEX TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/api/common/envelopeTypes.ts'), `
export interface ApiResponse<T = any> { data: T; message?: string; success: boolean; error?: string; }
export interface PaginatedResponse<T = any> { items: T[]; total: number; page: number; pageSize: number; totalPages: number; hasNext: boolean; hasPrev: boolean; }
export interface ApiError { message: string; code?: string; status?: number; errors?: Record<string, string[]>; }
`);

writeStrictFile(path.join(root, 'src/types/api/common/queryTypes.ts'), `
export interface PaginationParams { page?: number; pageSize?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; search?: string; }
export interface DateRangeParams { startDate?: string; endDate?: string; }
export interface FilterParams extends PaginationParams, DateRangeParams { status?: string; department?: string; [key: string]: any; }
`);

writeStrictFile(path.join(root, 'src/types/api/index.ts'), `
export type { ApiResponse, PaginatedResponse, ApiError } from "./common/envelopeTypes";
export type { PaginationParams, DateRangeParams, FilterParams } from "./common/queryTypes";
`);

console.log('Modularized all API types successfully!');
