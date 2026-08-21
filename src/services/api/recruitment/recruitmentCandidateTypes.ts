import type { BackendParsedResume, BackendATSScoreBreakdown, BackendAIInsights } from "./recruitmentAtsTypes";

export interface BackendCandidateScreeningResponse {
  candidate_id: string; application_id: string | null; resume_document_id: string; job_id: string | null;
  status: string; ats_score: number; rank: number; match_tier: string; candidate_details: BackendParsedResume;
  ats_breakdown: BackendATSScoreBreakdown; ai_insights: BackendAIInsights;
  quality_analysis: { is_valid: boolean; issues: string[]; missing_fields: string[]; formatting_score: number };
  duplicate_info: { is_duplicate: boolean; duplicate_candidate_id: string | null; matched_by: string[] };
  created_at: string;
}
export interface BackendCandidateATSAnalysis {
  candidate_id: string; job_id: string | null; overall_ats_score: number; rank: number; match_tier: string;
  ats_breakdown: BackendATSScoreBreakdown; ai_insights: BackendAIInsights;
}
export interface BackendCandidateListItem {
  candidate_id: string; resume_document_id: string | null; application_id: string | null; job_id: string | null;
  job_title: string | null; name: string; email: string | null; phone: string | null; location: string | null;
  current_company: string | null; current_role: string | null; years_experience: number; ats_score: number;
  rank: number; match_tier: string; status: string; created_at: string; applied_at: string | null;
}
export interface APIResponse<T> { success: boolean; message: string; data: T; errors: string[] | null; }
