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
// 3. HR TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/hr/employeeSubItems.ts'), `
export interface AddressItem { type: "permanent" | "current"; street: string; city: string; state: string; zip: string; country: string; }
export interface KycDocumentItem { type: "aadhaar" | "pan" | "passport" | "voter_id" | "driving_license"; docNumber: string; documentUrl?: string; verified: boolean; }
export interface EducationItem { degree: string; institution: string; year: number; gpa?: string; }
export interface WorkExperienceItem { company: string; role: string; fromYear: number; toYear: number; description?: string; }
export interface SkillItem { name: string; level: "beginner" | "intermediate" | "expert"; }
export interface EmergencyContactItem { name: string; relationship: string; phone: string; }
export interface BankAccountItem { accountNumber: string; bankName: string; ifscCode: string; branchName?: string; }
`);

writeStrictFile(path.join(root, 'src/types/hr/employeeType.ts'), `
import type { AddressItem, KycDocumentItem, EducationItem, WorkExperienceItem, SkillItem, EmergencyContactItem, BankAccountItem } from "./employeeSubItems";

export interface Employee {
  id: string; employeeId?: string; full_name?: string; name?: string; email: string; phone?: string; role: string;
  department: string; subDepartment?: string; managerId?: string; managerName?: string;
  employmentType: "full-time" | "part-time" | "contract" | "intern"; status: "active" | "inactive" | "on_leave" | "probation";
  joiningDate: string; ctcAnnual: number; addresses?: AddressItem[]; kycDocuments?: KycDocumentItem[];
  education?: EducationItem[]; workExperience?: WorkExperienceItem[]; skills?: SkillItem[];
  emergencyContacts?: EmergencyContactItem[]; bankAccount?: BankAccountItem;
}
`);

writeStrictFile(path.join(root, 'src/types/hr/managerType.ts'), `
export interface ManagerPermissions {
  canApproveLeave: boolean; canApproveAttendance: boolean; canApprovePayroll: boolean;
  canConductAppraisals: boolean; canInitiateRequisitions: boolean;
}

export interface Manager {
  id: string; employeeId: string; name: string; email: string; department: string;
  role: string; teamSize: number; directReportIds: string[]; permissions: ManagerPermissions;
}
`);

writeStrictFile(path.join(root, 'src/types/hr/leaveDocCandidateTypes.ts'), `
export interface LeaveRequest {
  id: string; employeeId: string; employeeName: string; leaveType: "casual" | "sick" | "earned" | "maternity" | "paternity" | "unpaid";
  startDate: string; endDate: string; totalDays: number; reason: string; status: "pending" | "approved" | "rejected"; appliedAt: string;
}

export interface Candidate {
  id: string; name: string; email: string; phone: string; position: string; department: string;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected"; appliedDate: string; matchScore: number;
}

export interface DocItem {
  id: string; name: string; type: "policy" | "offer_letter" | "handbook" | "form" | "report";
  size: string; uploadedAt: string; url: string;
}
`);

writeStrictFile(path.join(root, 'src/types/hr/departmentPayrollTypes.ts'), `
export interface Department { id: string; name: string; code: string; headOfDepartment: string; employeeCount: number; budget: number; }
export interface DepartmentStats { totalEmployees: number; activeDepartments: number; avgTenureMonths: number; monthlyPayrollTotal: number; }
export interface AttendanceRecord { id: string; employeeId: string; employeeName: string; date: string; checkIn: string; checkOut?: string; totalHours?: number; status: "present" | "absent" | "half_day" | "late" | "on_leave"; }
export interface PayrollRow { id: string; employeeId: string; employeeName: string; department: string; month: string; baseSalary: number; deductions: number; bonuses: number; netSalary: number; status: "draft" | "approved" | "paid"; }
export const stageColor = { applied: "bg-blue-100 text-blue-800", screening: "bg-purple-100 text-purple-800", interview: "bg-yellow-100 text-yellow-800", offer: "bg-orange-100 text-orange-800", hired: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
`);

writeStrictFile(path.join(root, 'src/types/hr.ts'), `
export type { AddressItem, KycDocumentItem, EducationItem, WorkExperienceItem, SkillItem, EmergencyContactItem, BankAccountItem } from "./hr/employeeSubItems";
export type { Employee } from "./hr/employeeType";
export type { ManagerPermissions, Manager } from "./hr/managerType";
export type { LeaveRequest, Candidate, DocItem } from "./hr/leaveDocCandidateTypes";
export type { Department, DepartmentStats, AttendanceRecord, PayrollRow } from "./hr/departmentPayrollTypes";
export { stageColor } from "./hr/departmentPayrollTypes";
`);

console.log('Modularized hr.ts');
