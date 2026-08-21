import type { AddressItem, KycDocumentItem, EducationItem, WorkExperienceItem, SkillItem, EmergencyContactItem, BankAccountItem } from "../employeeSubItems";

export interface EmployeeNestedArrays {
  addresses?: AddressItem[];
  kycDocuments?: KycDocumentItem[];
  education?: EducationItem[];
  workExperience?: WorkExperienceItem[];
  skills?: SkillItem[];
  emergencyContacts?: EmergencyContactItem[];
  bankAccount?: BankAccountItem;
  bankAccounts?: BankAccountItem[];
}
