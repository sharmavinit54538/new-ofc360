import type { AddressItem, KycDocumentItem, EducationItem, WorkExperienceItem, SkillItem, EmergencyContactItem, BankAccountItem } from "./employeeSubItems";

export interface Employee {
  id: string; employeeId?: string; full_name?: string; name?: string; email: string; phone?: string; role: string;
  department: string; subDepartment?: string; managerId?: string; managerName?: string;
  employmentType: "full-time" | "part-time" | "contract" | "intern"; status: "active" | "inactive" | "on_leave" | "probation";
  joiningDate: string; ctcAnnual: number; addresses?: AddressItem[]; kycDocuments?: KycDocumentItem[];
  education?: EducationItem[]; workExperience?: WorkExperienceItem[]; skills?: SkillItem[];
  emergencyContacts?: EmergencyContactItem[]; bankAccount?: BankAccountItem;
}