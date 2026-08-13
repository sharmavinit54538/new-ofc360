/**
 * Recruitment Module Types & Response Envelopes
 */

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: { field?: string; message: string }[] | null;
}

export type RecruitmentModuleType =
  | "Jobs Manager & AI Wizard"
  | "Requisitions & Approvals"
  | "Candidates 360° Directory"
  | "Drag & Drop Pipeline"
  | "Interviews & Calendar Sync"
  | "Structured Scorecards"
  | "Offer Letters & E-Signatures"
  | "Employee Referral Portal"
  | "Vendor & Agency Portal"
  | "Onboarding Handoff Bridge"
  | "AI Recruiter Copilot"
  | "Executive Dashboard"
  | "Executive Analytics & Reports"
  | "Passive Talent Pool & CRM"
  | "Workflow Automation Engine"
  | "Compliance & Audit Logs";

// ==========================================
// 1. JOBS TYPES
// ==========================================
export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote" | "hybrid";
  status: "draft" | "published" | "closed" | "archived";
  description: string;
  requirements: string[];
  salary_range?: { min: number; max: number; currency: string };
  sourcing_link?: string;
  qr_code_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobInput {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary_range?: { min: number; max: number; currency: string };
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  status?: "draft" | "published" | "closed";
}

export interface PublishChannel {
  channel_id: string;
  channel_name: string;
  is_connected: boolean;
  published_at?: string;
}

export interface GenerateDescriptionInput {
  title: string;
  department: string;
  key_skills: string[];
  seniority_level: string;
}

export interface AiAutofillInput {
  prompt: string;
  department?: string;
}

export interface ModifyDescriptionInput {
  current_description: string;
  instruction: string;
}

export interface SourcingLinkResponse {
  job_id: string;
  sourcing_link: string;
}

export interface QrCodeResponse {
  job_id: string;
  qr_code_url: string;
}

// ==========================================
// 2. REQUISITION TYPES
// ==========================================
export interface Requisition {
  id: string;
  title: string;
  department: string;
  headcount: number;
  budget: number;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "approved" | "rejected";
  requester_id: string;
  requester_name: string;
  approver_comments?: string;
  created_at: string;
}

export interface RequisitionCreateInput {
  title: string;
  department: string;
  headcount: number;
  budget: number;
  priority: "low" | "medium" | "high" | "urgent";
  reasoning: string;
}

export interface RequisitionApproveInput {
  decision: "approve" | "reject";
  comment?: string;
}

// ==========================================
// 3. CANDIDATE & ATS TYPES
// ==========================================
export type CandidatePipelineStage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  current_role?: string;
  company?: string;
  experience_years: number;
  stage: CandidatePipelineStage;
  job_id: string;
  job_title?: string;
  resume_url?: string;
  ats_score?: number;
  skills: string[];
  created_at: string;
}

export interface CandidateFilters {
  search?: string;
  stage?: CandidatePipelineStage | string;
  jobId?: string;
}

export interface AtsScoreBreakdown {
  candidate_id: string;
  job_id: string;
  overall_score: number;
  skill_match_score: number;
  experience_match_score: number;
  education_match_score: number;
  strengths: string[];
  gaps: string[];
  insights: string;
}

// ==========================================
// 4. INTERVIEW TYPES
// ==========================================
export interface InterviewRound {
  round_id: string;
  round_number: number;
  round_name: string;
  status: "pending" | "passed" | "rejected" | "hold";
  interviewer_name?: string;
  scheduled_at?: string;
  notes?: string;
}

export interface Interview {
  id: string;
  candidate_id: string;
  candidate_name: string;
  job_id: string;
  job_title: string;
  round_name: string;
  round_number: number;
  interviewer_id: string;
  interviewer_name: string;
  scheduled_at: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  meeting_link?: string;
  rounds?: InterviewRound[];
}

export interface SendInterviewInput {
  candidate_id: string;
  round_name: string;
  interviewer_ids: string[];
  proposed_slots: string[];
}

export interface InterviewScheduleInput {
  selected_slot: string;
  candidate_timezone?: string;
}

export interface RoundDecisionInput {
  decision_notes?: string;
  rating?: number;
}

// ==========================================
// 5. SCORECARD TYPES
// ==========================================
export interface ScorecardCategory {
  name: string;
  weight: number;
  criteria: string[];
}

export interface ScorecardTemplate {
  id: string;
  title: string;
  department: string;
  categories: ScorecardCategory[];
}

export interface ScorecardTemplateInput {
  title: string;
  department: string;
  categories: ScorecardCategory[];
}

export interface ScorecardSubmission {
  id: string;
  round_id: string;
  candidate_id: string;
  interviewer_id: string;
  overall_rating: number; // 1-5 star rubric
  category_ratings: Record<string, number>;
  comments: string;
  recommendation: "strong_hire" | "hire" | "no_hire" | "strong_no_hire";
  submitted_at: string;
}

export interface ScorecardSubmissionInput {
  round_id: string;
  candidate_id: string;
  overall_rating: number;
  category_ratings: Record<string, number>;
  comments: string;
  recommendation: "strong_hire" | "hire" | "no_hire" | "strong_no_hire";
}

// ==========================================
// 6. OFFER TYPES
// ==========================================
export interface OfferLetter {
  id: string;
  candidate_id: string;
  job_id: string;
  candidate_name: string;
  job_title: string;
  salary: number;
  bonus?: number;
  start_date: string;
  expiry_date: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  signature_url?: string;
}

export interface OfferCreateInput {
  candidate_id: string;
  salary: number;
  bonus?: number;
  start_date: string;
  expiry_date: string;
  benefits?: string[];
}

export interface ConvertCandidateInput {
  candidate_id: string;
  employee_code: string;
  department_id: string;
  designation_id: string;
  joining_date: string;
}

// ==========================================
// 7. REFERRAL TYPES
// ==========================================
export interface Referral {
  id: string;
  referrer_id: string;
  referrer_name: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  job_id: string;
  job_title?: string;
  resume_url?: string;
  status: "submitted" | "under_review" | "interviewing" | "hired" | "rejected";
  bonus_amount?: number;
  created_at: string;
}

export interface ReferralCreateInput {
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  job_id: string;
  notes?: string;
}

export interface ReferralStatusUpdateInput {
  status: "submitted" | "under_review" | "interviewing" | "hired" | "rejected";
  note?: string;
}

// ==========================================
// 8. VENDOR TYPES
// ==========================================
export interface VendorAgency {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  commission_rate: number;
  active_jobs_count: number;
  candidates_submitted_count: number;
  status: "active" | "inactive" | "pending";
}

export interface VendorInput {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  commission_rate: number;
}

// ==========================================
// 9. ONBOARDING HANDOFF TYPES
// ==========================================
export interface CompanyOnboardingStatus {
  step: number;
  total_steps: number;
  is_completed: boolean;
  active_modules: string[];
}

export interface EmployeeOnboardingStatus {
  step: number;
  is_completed: boolean;
  is_draft: boolean;
  documents_uploaded: number;
}

export interface AdminOnboardingProgress {
  employee_id: string;
  employee_name: string;
  step: number;
  status: "pending" | "in_progress" | "completed";
  pending_verifications: number;
}

export interface HRAdminWorkflow {
  id: string;
  name: string;
  steps_count: number;
  active: boolean;
}

export interface HRAdminNewHire {
  id: string;
  name: string;
  email: string;
  position: string;
  start_date: string;
  onboarding_status: string;
}

export interface HRAdminDocument {
  id: string;
  title: string;
  category: string;
  required: boolean;
}

export interface HRAdminTask {
  id: string;
  title: string;
  assignee: string;
  due_date: string;
  completed: boolean;
}

// ==========================================
// 10. AI RECRUITER TYPES
// ==========================================
export interface AiDashboardKpis {
  total_jobs: number;
  total_candidates: number;
  ai_screened_count: number;
  avg_ats_score: number;
  top_matches_count: number;
  interview_conversion_rate: number;
}

export interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
}

export interface MatchDistribution {
  bucket: string;
  count: number;
}

export interface CandidateScore {
  candidate_id: string;
  technical_fit: number;
  culture_fit: number;
  experience_fit: number;
  overall: number;
}

export interface AiRecommendation {
  candidate_id: string;
  recommendation: string;
  key_strengths: string[];
  risk_factors: string[];
}

export interface QuestionGenInput {
  job_title: string;
  skills: string[];
  seniority: string;
  round_type: string;
}

export interface QuestionGenOutput {
  questions: {
    category: string;
    question: string;
    evaluation_criteria: string;
  }[];
}

// ==========================================
// 11. RECRUITMENT ANALYTICS & NOTIFICATIONS
// ==========================================
export interface RecruitmentFunnelAnalytics {
  time_to_hire_days: number;
  cost_per_hire: number;
  funnel_conversion_rate: number;
  sourcing_channels: {
    channel: string;
    count: number;
    conversion: number;
  }[];
}

export interface RecruitmentDashboardStats {
  active_jobs: number;
  pending_approvals: number;
  upcoming_interviews: number;
  offers_pending: number;
}

export interface RecruitingNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

// ==========================================
// MOCKED ENDPOINTS TYPES
// ==========================================
export interface SilverMedalistCandidate {
  id: string;
  name: string;
  role: string;
  last_interview_date: string;
  rating: number;
  tags: string[];
  notes: string;
}

export interface TalentPoolTag {
  id: string;
  name: string;
  count: number;
}

export interface AutomationRule {
  id: string;
  trigger: string;
  condition: Record<string, any>;
  action: string;
  enabled: boolean;
}

export interface AutomationRuleCreateInput {
  trigger: string;
  condition: Record<string, any>;
  action: string;
}

export interface GdprErasureRequest {
  id: string;
  candidate_email: string;
  requested_at: string;
  status: "pending" | "processed" | "rejected";
}

export interface EeocComplianceLog {
  id: string;
  event_type: string;
  details: string;
  timestamp: string;
}
