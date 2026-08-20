export interface AddressItem { type: "permanent" | "current"; street: string; city: string; state: string; zip: string; country: string; }
export interface KycDocumentItem { type: "aadhaar" | "pan" | "passport" | "voter_id" | "driving_license"; docNumber: string; documentUrl?: string; verified: boolean; }
export interface EducationItem { degree: string; institution: string; year: number; gpa?: string; }
export interface WorkExperienceItem { company: string; role: string; fromYear: number; toYear: number; description?: string; }
export interface SkillItem { name: string; level: "beginner" | "intermediate" | "expert"; }
export interface EmergencyContactItem { name: string; relationship: string; phone: string; }
export interface BankAccountItem { accountNumber: string; bankName: string; ifscCode: string; branchName?: string; }