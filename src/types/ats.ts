export type RequisitionStatus = 'Draft' | 'Pending HR' | 'Finance Approved' | 'C-Level Approved' | 'Closed';
export type JobStatus = 'Draft' | 'Published' | 'On Hold' | 'Closed' | 'Archived';
export type CandidateStage = 'Applied' | 'Screening' | 'Tech Interview' | 'Culture Round' | 'Offer Extended' | 'Hired' | 'Rejected';
export type CandidateSource = 'Careers Site' | 'LinkedIn' | 'Indeed' | 'Referral' | 'Agency' | 'Direct Sourced';

export interface Requisition {
  id: string;
  title: string;
  department: string;
  hiringManager: string;
  targetStartDate: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  justification: string;
  isReplacement: boolean;
  replacementFor?: string;
  status: RequisitionStatus;
  createdAt: string;
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'boolean' | 'file';
  options?: string[];
  required: boolean;
}

export interface JobOpening {
  id: string;
  requisitionId?: string;
  title: string;
  department: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'Onsite';
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  screeningQuestions: ScreeningQuestion[];
  status: JobStatus;
  publishedTo: {
    careersSite: boolean;
    linkedIn: boolean;
    indeed: boolean;
    glassdoor: boolean;
  };
  pipelineStages: string[];
  createdAt: string;
  applicantCount: number;
  avgMatchScore: number;
}

export interface CandidateNote {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  mentions?: string[];
}

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  currentCompany?: string;
  currentRole?: string;
  expectedSalary?: number;
  noticePeriodDays?: number;
  source: CandidateSource;
  stage: CandidateStage;
  aiMatchScore: number;
  aiSummary: string;
  skills: string[];
  experienceYears: number;
  resumeUrl?: string;
  tags: string[];
  appliedAt: string;
  rating: number; // 1-5
  notes: CandidateNote[];
  status: 'Active' | 'Hired' | 'Rejected' | 'Archived';
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  interviewers: string[];
  stage: CandidateStage;
  scheduledAt: string; // ISO date-time string
  durationMinutes: number;
  meetLink: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
}

export interface ScorecardRating {
  criteria: string;
  score: number; // 1-5
  comment: string;
}

export interface Scorecard {
  id: string;
  candidateId: string;
  interviewerName: string;
  interviewerRole: string;
  stage: CandidateStage;
  ratings: ScorecardRating[];
  overallRecommendation: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire';
  pros: string;
  cons: string;
  submittedAt: string;
}

export interface OfferLetter {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  baseSalary: number;
  bonus: number;
  equity?: string;
  joiningDate: string;
  status: 'Draft' | 'Pending Approval' | 'Sent to Candidate' | 'Signed' | 'Declined';
  eSignatureUrl?: string;
  signedAt?: string;
  expiryDate: string;
}

export interface TalentPoolCandidate {
  id: string;
  name: string;
  email: string;
  role: string;
  tags: string[];
  source: string;
  lastContacted: string;
  nurtureSequence: string;
  aiFitScore: number;
}

export interface EmployeeReferral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  bonusAmount: number;
  status: 'Submitted' | 'Under Review' | 'Interviewing' | 'Hired' | 'Bonus Paid';
  submittedAt: string;
}

export interface VendorAgency {
  id: string;
  agencyName: string;
  contactPerson: string;
  email: string;
  candidatesSubmitted: number;
  hiredCount: number;
  status: 'Active' | 'Inactive';
}

export interface VendorCandidateSubmission {
  id: string;
  vendorId: string;
  agencyName: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  duplicateFlag: boolean;
  submittedAt: string;
  status: 'Pending Review' | 'Approved' | 'Duplicate Rejected';
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
}

export interface OnboardingBridgeRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  startDate: string;
  buddyAssigned: string;
  docsCollected: boolean;
  laptopProvisioned: boolean;
  status: 'Pending Handoff' | 'In Onboarding' | 'Completed';
}

export interface AuditLogItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  module: string;
  ipAddress: string;
}
