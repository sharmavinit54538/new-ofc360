import type { AddressItem, KycDocumentItem, EducationItem, WorkExperienceItem, SkillItem, EmergencyContactItem, BankAccountItem } from "@/types/hr";

export interface NestedListsState {
  addresses: AddressItem[];
  setAddresses: React.Dispatch<React.SetStateAction<AddressItem[]>>;
  kycDocuments: KycDocumentItem[];
  setKycDocuments: React.Dispatch<React.SetStateAction<KycDocumentItem[]>>;
  education: EducationItem[];
  setEducation: React.Dispatch<React.SetStateAction<EducationItem[]>>;
  workExperience: WorkExperienceItem[];
  setWorkExperience: React.Dispatch<React.SetStateAction<WorkExperienceItem[]>>;
  skills: SkillItem[];
  setSkills: React.Dispatch<React.SetStateAction<SkillItem[]>>;
  emergencyContacts: EmergencyContactItem[];
  setEmergencyContacts: React.Dispatch<React.SetStateAction<EmergencyContactItem[]>>;
  bankAccounts: BankAccountItem[];
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccountItem[]>>;
}
