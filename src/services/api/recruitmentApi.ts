import { baseApi } from "./baseApi";

// ── Backend Response Types ─────────────────────────────────────────────────

export interface BackendJobSkill {
  id: string;
  name: string;
  category: string;
  is_required: boolean;
}

export interface BackendJobListItem {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: string;
  vacancies: number;
  status: string;
  created_at: string;
}

export interface BackendJobDetail {
  id: string;
  title: string;
  slug: string;
  department: string;
  designation: string;
  employment_type: string;
  experience_required: string | null;
  min_experience: number;
  max_experience: number | null;
  min_salary: number | null;
  max_salary: number | null;
  location: string;
  vacancies: number;
  job_description: string;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  application_deadline: string | null;
  interview_process_description: string | null;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  skills: BackendJobSkill[];
}

export interface BackendJobListResponse {
  items: BackendJobListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ── Resume / ATS Response Types ────────────────────────────────────────────

export interface BackendATSScoreBreakdown {
  overall_ats_score: number;
  skill_match_score: number;
  experience_match_score: number;
  education_match_score: number;
  keyword_match_score: number;
  role_match_score: number;
  industry_match_score: number;
  location_match_score: number;
  certification_match_score: number;
  resume_completeness: number;
  formatting_quality: number;
  matched_skills: string[];
  missing_skills: string[];
  extra_skills: string[];
}

export interface BackendAIInsights {
  candidate_summary: string;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  recommended_interview_questions: string[];
  risk_factors: string[];
  hiring_recommendation: string;
  career_level: string;
  technical_assessment: string;
  communication_assessment: string;
  leadership_indicators: string[];
}

export interface BackendParsedResume {
  candidate_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  summary: string | null;
  total_experience_years: number;
  current_company: string | null;
  previous_companies: string[];
  current_designation: string | null;
  skills: string[];
  technical_skills: string[];
  soft_skills: string[];
  languages: string[];
  education: { degree?: string; field_of_study?: string; university?: string; college?: string; passing_year?: number }[];
  work_history: { company: string; designation?: string; duration_months?: number; start_date?: string; end_date?: string; description?: string }[];
  certifications: string[];
  projects: { title: string; description?: string; technologies: string[] }[];
  achievements: string[];
  current_salary: number | null;
  expected_salary: number | null;
  notice_period_days: number | null;
  current_location: string | null;
  preferred_location: string | null;
  willing_to_relocate: boolean;
}

export interface BackendCandidateScreeningResponse {
  candidate_id: string;
  application_id: string | null;
  resume_document_id: string;
  job_id: string | null;
  status: string;
  ats_score: number;
  rank: number;
  match_tier: string;
  candidate_details: BackendParsedResume;
  ats_breakdown: BackendATSScoreBreakdown;
  ai_insights: BackendAIInsights;
  quality_analysis: { is_valid: boolean; issues: string[]; missing_fields: string[]; formatting_score: number };
  duplicate_info: { is_duplicate: boolean; duplicate_candidate_id: string | null; matched_by: string[] };
  created_at: string;
}

export interface BackendCandidateATSAnalysis {
  candidate_id: string;
  job_id: string | null;
  overall_ats_score: number;
  rank: number;
  match_tier: string;
  ats_breakdown: BackendATSScoreBreakdown;
  ai_insights: BackendAIInsights;
}

export interface BackendCandidateListItem {
  candidate_id: string;
  resume_document_id: string | null;
  application_id: string | null;
  job_id: string | null;
  job_title: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  current_company: string | null;
  current_role: string | null;
  years_experience: number;
  ats_score: number;
  rank: number;
  match_tier: string;
  status: string;
  created_at: string;
  applied_at: string | null;
}

// ── Generic API Response Wrapper ───────────────────────────────────────────

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

// ── RTK Query Endpoints ────────────────────────────────────────────────────

export const recruitmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ── Jobs ─────────────────────────────────────────────────────────────
    getRecruitmentJobs: builder.query<BackendJobListResponse, { status?: string; search?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const p = params as { status?: string; search?: string; page?: number; limit?: number } | undefined;
        const search = new URLSearchParams();
        if (p?.status) search.append("status", p.status);
        if (p?.search) search.append("search", p.search);
        if (p?.page) search.append("page", String(p.page));
        if (p?.limit) search.append("limit", String(p.limit));
        const q = search.toString();
        return `/api/v1/jobs${q ? `?${q}` : ""}`;
      },
      transformResponse: (response: APIResponse<BackendJobListResponse>) => response.data,
      providesTags: ["Job", "Recruitment"],
    }),

    getRecruitmentJobById: builder.query<BackendJobDetail, string>({
      query: (id) => `/api/v1/jobs/${id}`,
      transformResponse: (response: APIResponse<BackendJobDetail>) => response.data,
      providesTags: (_res, _err, id) => [{ type: "Job", id }],
    }),

    // ── Resume Upload & AI Screening ─────────────────────────────────────
    uploadResumeForScreening: builder.mutation<BackendCandidateScreeningResponse, FormData>({
      query: (formData) => ({
        url: "/api/v1/recruitment/resume/upload",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: BackendCandidateScreeningResponse | APIResponse<BackendCandidateScreeningResponse>) => {
        // Backend may or may not wrap in APIResponse
        if ("data" in response && "success" in response) {
          return (response as APIResponse<BackendCandidateScreeningResponse>).data;
        }
        return response as BackendCandidateScreeningResponse;
      },
      invalidatesTags: ["Candidate", "Recruitment"],
    }),

    // ── Candidates ───────────────────────────────────────────────────────
    getRecruitmentCandidates: builder.query<{ items: BackendCandidateListItem[]; total: number }, { search?: string; status?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const p = params as { search?: string; status?: string; page?: number; limit?: number } | undefined;
        const search = new URLSearchParams();
        if (p?.search) search.append("search", p.search);
        if (p?.status) search.append("status", p.status);
        if (p?.page) search.append("page", String(p.page));
        if (p?.limit) search.append("limit", String(p.limit));
        const q = search.toString();
        return `/api/v1/recruitment/candidates${q ? `?${q}` : ""}`;
      },
      transformResponse: (response: APIResponse<{ items: BackendCandidateListItem[]; total: number }>) => response.data,
      providesTags: ["Candidate"],
    }),

    getRecruitmentCandidateById: builder.query<BackendCandidateScreeningResponse, string>({
      query: (id) => `/api/v1/recruitment/candidates/${id}`,
      transformResponse: (response: APIResponse<BackendCandidateScreeningResponse>) => response.data,
      providesTags: (_res, _err, id) => [{ type: "Candidate", id }],
    }),

    // ── ATS Analysis ─────────────────────────────────────────────────────
    getCandidateATSAnalysis: builder.query<BackendCandidateATSAnalysis, string>({
      query: (candidateId) => `/api/v1/recruitment/candidates/${candidateId}/ats`,
      transformResponse: (response: APIResponse<BackendCandidateATSAnalysis>) => response.data,
      providesTags: (_res, _err, id) => [{ type: "Candidate", id }],
    }),

    // ── Job Matching ─────────────────────────────────────────────────────
    getJobs: builder.query<BackendJobListResponse, { status?: string; search?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const p = params as { status?: string; search?: string; page?: number; limit?: number } | undefined;
        const search = new URLSearchParams();
        if (p?.status) search.append("status", p.status);
        if (p?.search) search.append("search", p.search);
        if (p?.page) search.append("page", String(p.page));
        if (p?.limit) search.append("limit", String(p.limit));
        const q = search.toString();
        return `/api/v1/jobs${q ? `?${q}` : ""}`;
      },
      transformResponse: (response: APIResponse<BackendJobListResponse>) => response.data,
      providesTags: ["Job", "Recruitment"],
    }),

    uploadResume: builder.mutation<BackendCandidateScreeningResponse, FormData>({
      query: (formData) => ({
        url: "/api/v1/recruitment/resume/upload",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: BackendCandidateScreeningResponse | APIResponse<BackendCandidateScreeningResponse>) => {
        if ("data" in response && "success" in response) {
          return (response as APIResponse<BackendCandidateScreeningResponse>).data;
        }
        return response as BackendCandidateScreeningResponse;
      },
      invalidatesTags: ["Candidate", "Recruitment"],
    }),
  }),
});

export const {
  useGetRecruitmentJobsQuery,
  useGetJobsQuery,
  useGetRecruitmentJobByIdQuery,
  useUploadResumeForScreeningMutation,
  useUploadResumeMutation,
  useGetRecruitmentCandidatesQuery,
  useGetRecruitmentCandidateByIdQuery,
  useGetCandidateATSAnalysisQuery,
  useMatchCandidatesForJobMutation,
} = recruitmentApi;

