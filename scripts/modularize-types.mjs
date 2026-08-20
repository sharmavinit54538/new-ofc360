import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Helper to write compliant file (<= 20 lines)
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

// 1. Modularize hrAdminOnboarding.ts
writeStrictFile(path.join(root, 'src/types/onboarding/companyTypes.ts'), `
export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";

export interface CompanyDetails {
  companyName: string; legalEntityName: string; businessRegistrationNumber?: string;
  taxIdGstPan?: string; industry: string; companySize: CompanySize;
  websiteUrl?: string; officialEmail: string; officialPhone: string;
  headquartersAddress: { street: string; city: string; stateProvince: string; postalCode: string; country: string; };
  foundedYear?: number;
}
`);

writeStrictFile(path.join(root, 'src/types/onboarding/hrAdminProfileTypes.ts'), `
export interface HRAdminProfile {
  fullName: string; jobTitle: string; workEmail: string; phoneNumber: string;
  department: string; linkedinProfileUrl?: string; profilePhotoUrl?: string;
}

export interface CompanyBranding {
  logoUrl?: string; brandColorPrimary?: string; brandColorSecondary?: string;
  tagline?: string; officialStampSealUrl?: string;
}
`);

writeStrictFile(path.join(root, 'src/types/onboarding/preferenceTypes.ts'), `
export interface OnboardingPreferences {
  defaultCurrency: string; defaultTimezone: string; fiscalYearStartMonth: number;
  enableFaceAttendance: boolean; enableAiFeatures: boolean;
}

export interface OnboardingStatus {
  step: number; isCompleted: boolean; completedAt?: string;
  completedSteps: number[]; lastSavedAt?: string;
}
`);

writeStrictFile(path.join(root, 'src/types/onboarding/workflowTypes.ts'), `
import type { CompanyDetails } from "./companyTypes";
import type { HRAdminProfile, CompanyBranding } from "./hrAdminProfileTypes";
import type { OnboardingPreferences, OnboardingStatus } from "./preferenceTypes";

export interface CompleteOnboardingData {
  company: CompanyDetails; hrAdmin: HRAdminProfile;
  branding: CompanyBranding; preferences: OnboardingPreferences;
  status: OnboardingStatus;
}
`);

writeStrictFile(path.join(root, 'src/types/onboarding/itemsTypes.ts'), `
export interface OnboardingDocumentItem { id: string; name: string; required: boolean; category: string; }
export interface OnboardingTaskItem { id: string; title: string; assignedRole: string; dueDays: number; }
export interface OnboardingWorkflow {
  id: string; title: string; targetDepartment: string;
  documentChecklist: OnboardingDocumentItem[]; taskChecklist: OnboardingTaskItem[];
}
export interface NewHireOnboardingRecord {
  id: string; employeeId: string; employeeName: string; department: string;
  joiningDate: string; workflowId: string; status: "Pending" | "In Progress" | "Completed"; progressPercentage: number;
}
`);

writeStrictFile(path.join(root, 'src/types/hrAdminOnboarding.ts'), `
export type { CompanySize, CompanyDetails } from "./onboarding/companyTypes";
export type { HRAdminProfile, CompanyBranding } from "./onboarding/hrAdminProfileTypes";
export type { OnboardingPreferences, OnboardingStatus } from "./onboarding/preferenceTypes";
export type { CompleteOnboardingData } from "./onboarding/workflowTypes";
export type { OnboardingWorkflow, NewHireOnboardingRecord, OnboardingDocumentItem, OnboardingTaskItem } from "./onboarding/itemsTypes";
`);

console.log('Modularized hrAdminOnboarding.ts');
