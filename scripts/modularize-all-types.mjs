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
// 1. HR ADMIN ONBOARDING API TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/onboardingApi/apiResponses.ts'), `
export interface APIResponse<T> { success: boolean; data?: T; message?: string; error?: string; }
export interface OnboardingStatusResponse {
  step: number; is_completed: boolean; completed_steps: number[];
  completion_percentage: number; current_step: number; completed_at?: string; last_saved_at?: string;
}
export type OnboardingWizardData = Record<string, any>;
export type SaveStepPayload = { step: number; data: Record<string, any>; };
`);

writeStrictFile(path.join(root, 'src/types/onboardingApi/workflowApiTypes.ts'), `
export interface Workflow {
  id: string; company_id: string; title: string; target_department: string;
  document_checklist: any[]; task_checklist: any[]; created_at: string;
}
export interface CreateWorkflowPayload {
  title: string; target_department: string; document_checklist: any[]; task_checklist: any[];
}
`);

writeStrictFile(path.join(root, 'src/types/onboardingApi/newHireApiTypes.ts'), `
export enum NewHireStatus { PENDING = "Pending", IN_PROGRESS = "In Progress", COMPLETED = "Completed" }
export interface NewHire {
  id: string; company_id: string; employee_id: string; employee_name: string;
  department: string; joining_date: string; workflow_id: string; status: NewHireStatus; progress_percentage: number;
}
export interface CreateNewHirePayload {
  employee_id: string; employee_name: string; department: string; joining_date: string; workflow_id: string;
}
export type UpdateNewHirePayload = Partial<CreateNewHirePayload> & { status?: NewHireStatus; progress_percentage?: number };
`);

writeStrictFile(path.join(root, 'src/types/onboardingApi/documentTaskApiTypes.ts'), `
export enum DocumentStatus { PENDING = "Pending", UPLOADED = "Uploaded", VERIFIED = "Verified", REJECTED = "Rejected" }
export interface OnboardingDocument { id: string; new_hire_id: string; name: string; required: boolean; category: string; file_url?: string; status: DocumentStatus; }
export interface CreateDocumentPayload { new_hire_id: string; name: string; required: boolean; category: string; file_url?: string; }
export type UpdateDocumentPayload = Partial<CreateDocumentPayload> & { status?: DocumentStatus };
export enum TaskStatus { PENDING = "Pending", COMPLETED = "Completed" }
export interface OnboardingTask { id: string; new_hire_id: string; title: string; assigned_role: string; due_days: number; status: TaskStatus; }
export interface CreateTaskPayload { new_hire_id: string; title: string; assigned_role: string; due_days: number; }
export type UpdateTaskPayload = Partial<CreateTaskPayload> & { status?: TaskStatus };
export interface ListFilters { department?: string; status?: string; search?: string; }
`);

writeStrictFile(path.join(root, 'src/types/hrAdminOnboardingApi.types.ts'), `
export type { APIResponse, OnboardingStatusResponse, OnboardingWizardData, SaveStepPayload } from "./onboardingApi/apiResponses";
export type { Workflow, CreateWorkflowPayload } from "./onboardingApi/workflowApiTypes";
export { NewHireStatus } from "./onboardingApi/newHireApiTypes";
export type { NewHire, CreateNewHirePayload, UpdateNewHirePayload } from "./onboardingApi/newHireApiTypes";
export { DocumentStatus, TaskStatus } from "./onboardingApi/documentTaskApiTypes";
export type { OnboardingDocument, CreateDocumentPayload, UpdateDocumentPayload, OnboardingTask, CreateTaskPayload, UpdateTaskPayload, ListFilters } from "./onboardingApi/documentTaskApiTypes";
`);

// -------------------------------------------------------------
// 2. ATS TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/ats/atsStatusTypes.ts'), `
export type RequisitionStatus = "Draft" | "Pending Approval" | "Approved" | "Open" | "On Hold" | "Filled" | "Cancelled";
export type JobStatus = "Draft" | "Published" | "Internal Only" | "Confidential" | "Closed" | "Archived";
export type CandidateStage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
export type CandidateSource = "Careers Page" | "LinkedIn" | "Referral" | "Agency" | "Job Board" | "Direct Sourcing";
`);

writeStrictFile(path.join(root, 'src/types/ats/requisitionTypes.ts'), `
import type { RequisitionStatus } from "./atsStatusTypes";

export interface Requisition {
  id: string; title: string; department: string; hiringManager: string;
  positionsCount: number; budgetMin: number; budgetMax: number; currency: string;
  targetStartDate: string; priority: "Low" | "Medium" | "High" | "Urgent";
  status: RequisitionStatus; approvedBy?: string; approvedAt?: string; jobDescription: string;
}

export interface ScreeningQuestion {
  id: string; question: string; type: "text" | "multiple_choice" | "yes_no" | "numeric";
  required: boolean; idealAnswer?: string; weight: number;
}
`);

writeStrictFile(path.join(root, 'src/types/ats/jobOpeningTypes.ts'), `
import type { JobStatus } from "./atsStatusTypes";
import type { ScreeningQuestion } from "./requisitionTypes";

export interface JobOpening {
  id: string; requisitionId?: string; title: string; department: string; location: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Internship";
  workplaceType: "On-Site" | "Hybrid" | "Remote"; experienceLevel: "Entry" | "Mid" | "Senior" | "Lead" | "Executive";
  status: JobStatus; postedDate: string; closingDate?: string; applicantsCount: number;
  skills: string[]; screeningQuestions?: ScreeningQuestion[];
}
`);

writeStrictFile(path.join(root, 'src/types/ats/candidateTypes.ts'), `
import type { CandidateStage, CandidateSource } from "./atsStatusTypes";

export interface CandidateNote { id: string; authorName: string; authorRole: string; content: string; createdAt: string; isPrivate: boolean; }
export interface Candidate {
  id: string; jobId: string; name: string; email: string; phone: string; location: string;
  currentRole?: string; currentCompany?: string; totalExperienceYears: number;
  stage: CandidateStage; source: CandidateSource; appliedDate: string;
  matchScore: number; rating?: number; resumeUrl?: string; skills: string[];
  notes?: CandidateNote[]; rejectionReason?: string;
}
`);

writeStrictFile(path.join(root, 'src/types/ats/interviewScorecardTypes.ts'), `
export interface ScorecardRating { criterion: string; category: "Technical" | "Behavioral" | "Culture" | "Role-Specific"; rating: 1 | 2 | 3 | 4 | 5; comments?: string; }
export interface Scorecard { id: string; interviewId: string; interviewerId: string; interviewerName: string; submittedAt: string; overallRecommendation: "Strong Yes" | "Yes" | "Neutral" | "No" | "Strong No"; ratings: ScorecardRating[]; notes: string; }
export interface Interview { id: string; candidateId: string; jobId: string; roundName: string; interviewType: "Screening" | "Technical" | "Cultural" | "Executive"; scheduledTime: string; durationMins: number; interviewerNames: string[]; status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled"; scorecard?: Scorecard; meetingLink?: string; }
export interface OfferLetter { id: string; candidateId: string; jobId: string; baseSalary: number; variableBonus?: number; signOnBonus?: number; stockOptions?: string; joiningDate: string; validUntil: string; status: "Draft" | "Pending Approval" | "Sent" | "Accepted" | "Declined"; }
`);

writeStrictFile(path.join(root, 'src/types/ats/atsIntegrationsTypes.ts'), `
export interface TalentPoolCandidate { id: string; name: string; email: string; tags: string[]; totalExperienceYears: number; previousApplicationsCount: number; notes: string; addedDate: string; }
export interface EmployeeReferral { id: string; candidateName: string; candidateEmail: string; candidatePhone: string; jobId: string; referrerEmployeeId: string; referrerName: string; relationship: string; submittedDate: string; status: "Submitted" | "In Review" | "Interviewing" | "Hired" | "Bonus Paid"; referralBonusAmount: number; }
export interface VendorAgency { id: string; agencyName: string; contactPerson: string; email: string; phone: string; commissionRatePct: number; activeRequisitions: string[]; status: "Active" | "Inactive"; }
export interface VendorCandidateSubmission { id: string; vendorId: string; vendorName: string; candidateName: string; jobId: string; submittedDate: string; status: "Pending" | "Accepted" | "Rejected"; }
export interface AutomationRule { id: string; title: string; triggerEvent: "Candidate Applied" | "Stage Changed" | "Scorecard Submitted" | "Offer Accepted"; condition: string; action: "Send Email" | "Assign Task" | "Slack Alert" | "Auto-Reject" | "Advance Stage"; isEnabled: boolean; }
export interface OnboardingBridgeRecord { id: string; candidateId: string; employeeId: string; preboardingWorkflowId: string; status: "Initiated" | "Documents Pending" | "Ready For Day 1"; targetStartDate: string; }
export interface AuditLogItem { id: string; timestamp: string; actor: string; action: string; targetEntity: string; details: string; }
`);

writeStrictFile(path.join(root, 'src/types/ats.ts'), `
export type { RequisitionStatus, JobStatus, CandidateStage, CandidateSource } from "./ats/atsStatusTypes";
export type { Requisition, ScreeningQuestion } from "./ats/requisitionTypes";
export type { JobOpening } from "./ats/jobOpeningTypes";
export type { CandidateNote, Candidate } from "./ats/candidateTypes";
export type { ScorecardRating, Scorecard, Interview, OfferLetter } from "./ats/interviewScorecardTypes";
export type { TalentPoolCandidate, EmployeeReferral, VendorAgency, VendorCandidateSubmission, AutomationRule, OnboardingBridgeRecord, AuditLogItem } from "./ats/atsIntegrationsTypes";
`);

console.log('Modularized ats.ts');
