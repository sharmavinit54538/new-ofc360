import type { AddressItem, KycDocumentItem, EducationItem, SkillItem, EmergencyContactItem, BankAccountItem } from "@/types/hr";

export const DEFAULT_ADDRESSES: AddressItem[] = [
  { id: "addr-1", type: "PRESENT", line1: "Flat 402, Highrise Tower, Andheri East", city: "Mumbai", state: "Maharashtra", country: "India", pincode: "400069" },
];

export const DEFAULT_KYC_DOCS: KycDocumentItem[] = [
  { id: "kyc-1", type: "PAN", documentNumber: "ABCDE1234F" },
];

export const DEFAULT_EDUCATION: EducationItem[] = [
  { id: "edu-1", degree: "B.Tech Computer Science", institution: "IIT Bombay", fieldOfStudy: "Software Engineering", grade: "8.9 CGPA", startYear: "2018", endYear: "2022" },
];

export const DEFAULT_SKILLS: SkillItem[] = [
  { id: "sk-1", name: "React", proficiency: "Expert", years: 4 },
  { id: "sk-2", name: "TypeScript", proficiency: "Advanced", years: 3 },
];
