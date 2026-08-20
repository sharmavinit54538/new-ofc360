import { baseApi } from "./baseApi";

// ── TypeScript Interfaces for ATS Checker ─────────────────────────────────────

export interface CategoryScores {
  skills: number;
  experience: number;
  education: number;
  keywords: number;
  projects: number;
  certifications: number;
  resume_quality: number;
}

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  education: number;
  keywords: number;
  projects: number;
  certifications: number;
  resume_quality: number;
}

export interface ParsedEducation {
  degree?: string;
  field_of_study?: string;
  university?: string;
  college?: string;
  passing_year?: number | string;
  grade?: string;
}

export interface ParsedProject {
  title: string;
  description?: string;
  technologies?: string[];
  url?: string;
}

export interface ParsedResumeInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  summary: string | null;
  experience_years: number;
  current_company: string | null;
  current_designation: string | null;
  skills: string[];
  technical_skills: string[];
  soft_skills: string[];
  education: ParsedEducation[];
  projects: ParsedProject[];
  certifications: string[];
  languages: string[];
}

export interface ResumeATSReport {
  ats_score: number;
  job_match_score: number | null;
  has_job_context: boolean;
  formatting_score: number;
  score_breakdown: ScoreBreakdown;
  category_scores: CategoryScores;
  matched_skills: string[];
  missing_skills: string[];
  extra_skills: string[];
  issues: string[];
  missing_fields: string[];
  parsed_resume: ParsedResumeInfo;
  recommendations: string[];
  meta: {
    file_name: string;
    file_size_bytes: number;
    char_count: number;
    ocr_engine_used: string;
  };
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

// ── RTK Query Injection ────────────────────────────────────────────────────────

export const resumeAtsCheckerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkResumeATS: builder.mutation<ResumeATSReport, FormData>({
      query: (formData) => ({
        url: "/api/v2/resume-ats-checker/check",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: APIResponse<ResumeATSReport> | ResumeATSReport) => {
        if ("data" in response && "success" in response) {
          return (response as APIResponse<ResumeATSReport>).data;
        }
        return response as ResumeATSReport;
      },
    }),
  }),
  overrideExisting: true,
});

export const { useCheckResumeATSMutation } = resumeAtsCheckerApi;