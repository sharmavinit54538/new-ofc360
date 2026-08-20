export interface AddressItem {
  id?: string;
  type: "permanent" | "current" | "PRESENT" | "PERMANENT" | string;
  street?: string;
  line1?: string;
  city: string;
  state: string;
  zip?: string;
  pincode?: string;
  country: string;
  [key: string]: any;
}

export interface KycDocumentItem {
  id?: string;
  type: "aadhaar" | "pan" | "passport" | "voter_id" | "driving_license" | "AADHAAR" | "PAN" | string;
  docNumber?: string;
  documentNumber?: string;
  documentUrl?: string;
  verified?: boolean;
  expiryDate?: string;
  [key: string]: any;
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  year?: number;
  endYear?: string | number;
  grade?: string;
  gpa?: string;
  [key: string]: any;
}

export interface WorkExperienceItem {
  id?: string;
  company?: string;
  companyName?: string;
  role?: string;
  designation?: string;
  fromYear?: number;
  toYear?: number;
  startDate?: string;
  endDate?: string;
  employmentType?: string;
  description?: string;
  [key: string]: any;
}

export interface SkillItem {
  id?: string;
  name: string;
  level?: "beginner" | "intermediate" | "expert" | string;
  proficiency?: string;
  years?: number;
  [key: string]: any;
}

export interface EmergencyContactItem {
  id?: string;
  name: string;
  relationship: string;
  phone?: string;
  primaryPhone?: string;
  [key: string]: any;
}

export interface BankAccountItem {
  id?: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName?: string;
  accountHolder?: string;
  accountType?: string;
  isPrimary?: boolean;
  [key: string]: any;
}