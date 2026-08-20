import { SystemRole } from "@/features/auth/authTypes";

export interface AddressItem {
  id: string;
  type: "PRESENT" | "PERMANENT" | "OFFICE";
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isSameAsCurrent?: boolean;
}

export interface KycDocumentItem {
  id: string;
  type: "PAN" | "AADHAAR" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENSE" | "OTHER";
  documentNumber: string;
  fileUrl?: string;
  expiryDate?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  grade?: string;
  startYear?: string;
  endYear?: string;
}

export interface WorkExperienceItem {
  id: string;
  companyName: string;
  designation: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  responsibilities?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  years: number;
}

export interface EmergencyContactItem {
  id: string;
  name: string;
  relationship: "Spouse" | "Parent" | "Sibling" | "Friend" | "Other";
  primaryPhone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
}

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  accountType: "SAVINGS" | "CURRENT";
  isPrimary: boolean;
}

export interface Employee {
  id: string;
  name: string; // computed from firstName + lastName
  firstName?: string;
  lastName?: string;
  email: string;
  role: SystemRole;
  department: "Engineering" | "Design" | "Marketing" | "Sales" | "HR" | "Finance" | string;
  systemRole?: SystemRole;
  manager?: string;
  status: "Active" | "On Leave" | "Probation" | "Notice";
  joinedAt: string;
  salary: number;
  performance?: number;
  productivity?: number;
  attendanceRate?: number;
  burnoutRisk?: "low" | "medium" | "high";
  avatar?: string;
  phone?: string;
  location?: string;

  // 11-Tab Details
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  dob?: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed";
  photoUrl?: string;

  personalEmail?: string;
  companyWorkEmail?: string;
  alternatePhone?: string;

  designation?: string;
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  joiningDate?: string;
  reportingManager?: string;
  shift?: "General" | "Morning" | "Evening" | "Night";
  team?: string;
  branchOffice?: string;
  workLocation?: "Onsite" | "Remote" | "Hybrid";
  probationPeriod?: number; // months
  capacity?: number; // %
  costCenterId?: string;
  portalRole?: SystemRole;
  leaveGroup?: string;

  ctc?: number;
  basicSalary?: number;
  hra?: number;
  bonus?: number;
  pfDeduction?: number;
  esiDeduction?: number;
  profTax?: number;

  addresses?: AddressItem[];
  kycDocuments?: KycDocumentItem[];
  education?: EducationItem[];
  workExperience?: WorkExperienceItem[];
  skills?: SkillItem[];
  emergencyContacts?: EmergencyContactItem[];
  bankAccounts?: BankAccountItem[];
}

export interface ManagerPermissions {
  canApproveLeaves?: boolean;
  canManageTeam?: boolean;
  canViewSalaries?: boolean;
  canApproveExpenses?: boolean;
  customPermissions?: string[];
  [key: string]: unknown;
}

export interface Manager extends Employee {
  teamSize?: number;
  directReports?: string[];
  departmentScope?: string[];
  permissions?: ManagerPermissions;
  isActivated?: boolean;
  onboardingStatus?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  type: "Sick" | "Vacation" | "Remote" | "Personal" | "Casual Leave (CL)" | "Sick Leave (SL)" | "Earned / Privilege Leave (EL)" | "Compensatory Off (Comp-Off)" | string;
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  days: number;
  status: "Pending" | "Approved" | "Denied" | "Rejected";
  reason?: string;
  createdAt?: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
  aiScore: number;
  appliedAt: string;
  source: "LinkedIn" | "Referral" | "Website" | "Indeed";
  email?: string;
  phone?: string;
  experience?: string;
  skills?: string[];
  notes?: string;
}

export interface DocItem {
  id: string;
  name: string;
  category: "Policy" | "Contract" | "Report" | "Personal" | "Compliance";
  size: string;
  updatedAt: string;
  author: string;
  status?: "Verified" | "Pending" | "Archived";
  url?: string;
}

export interface Department {
  id: string;
  _id?: string;
  name: string;
  code: string;
  head?: string;
  headOfDepartment?: string;
  manager?: string;
  managerId?: string;
  manager_id?: string;
  location?: string;
  employeeCount?: number | null;
  employee_count?: number | null;
  capacity?: number | null;
  openPositions?: number | null;
  open_positions?: number | null;
  budget?: string | number | null;
  costCenter?: string;
  cost_center?: string;
  status: "Active" | "Inactive" | "Hiring" | "Growing" | string;
  hiringStatus?: "Open" | "Paused" | "Closed" | string;
  hiring_status?: "Open" | "Paused" | "Closed" | string;
  parentDepartment?: string;
  parent_department?: string;
  extension?: string;
  color?: string;
  icon?: string;
  description?: string;
  notes?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface DepartmentStats {
  totalEmployees?: number;
  activeEmployees?: number;
  totalCapacity?: number;
  openPositions?: number;
  budgetUtilized?: number;
  [key: string]: unknown;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Remote" | "Leave";
  checkIn: string;
  checkOut: string;
  hours: number;
  location?: string;
}

export interface PayrollRow {
  employeeId: string;
  name: string;
  department: string;
  base: number;
  bonus: number;
  deductions: number;
  net: number;
  status: "Paid" | "Pending" | "Processing";
  payDate?: string;
}

export const stageColor: Record<string, string> = {
  Applied: "bg-info/10 text-info border-info/20",
  Screening: "bg-primary/10 text-primary border-primary/20",
  Interview: "bg-accent/10 text-accent border-accent/20",
  Offer: "bg-warning/10 text-warning border-warning/20",
  Hired: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};