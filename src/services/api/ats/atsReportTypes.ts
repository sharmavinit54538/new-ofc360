import type { ScoreBreakdown, CategoryScores } from "./atsScoreTypes";
import type { ParsedResumeInfo } from "./atsParsedResumeTypes";

export interface ResumeATSReport {
  ats_score: number; job_match_score: number | null; has_job_context: boolean; formatting_score: number;
  score_breakdown: ScoreBreakdown; category_scores: CategoryScores;
  matched_skills: string[]; missing_skills: string[]; extra_skills: string[];
  issues: string[]; missing_fields: string[]; parsed_resume: ParsedResumeInfo; recommendations: string[];
  meta: { file_name: string; file_size_bytes: number; char_count: number; ocr_engine_used: string };
}
export interface ATSApiResponse<T> { success: boolean; message: string; data: T; errors: string[] | null; }
