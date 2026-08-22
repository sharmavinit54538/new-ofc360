import { useState } from "react";
import type { AddressItem, KycDocumentItem, EducationItem, WorkExperienceItem, SkillItem, EmergencyContactItem, BankAccountItem } from "@/types/hr";
import { DEFAULT_ADDRESSES, DEFAULT_KYC_DOCS, DEFAULT_EDUCATION, DEFAULT_SKILLS } from "../constants/formDefaultLists";
import { DEFAULT_EMERGENCY_CONTACTS, DEFAULT_BANK_ACCOUNTS } from "../constants/formDefaultAccounts";
import type { NestedListsState } from "../types/nestedListTypes";

export function useNestedListsState(): NestedListsState {
  const [addresses, setAddresses] = useState<AddressItem[]>(DEFAULT_ADDRESSES);
  const [kycDocuments, setKycDocuments] = useState<KycDocumentItem[]>(DEFAULT_KYC_DOCS);
  const [education, setEducation] = useState<EducationItem[]>(DEFAULT_EDUCATION);
  const [workExperience, setWorkExperience] = useState<WorkExperienceItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactItem[]>(DEFAULT_EMERGENCY_CONTACTS);
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>(DEFAULT_BANK_ACCOUNTS);

  return { addresses, setAddresses, kycDocuments, setKycDocuments, education, setEducation, workExperience, setWorkExperience, skills, setSkills, emergencyContacts, setEmergencyContacts, bankAccounts, setBankAccounts };
}
