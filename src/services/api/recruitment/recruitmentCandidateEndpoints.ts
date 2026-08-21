import { baseApi } from "../baseApi";
import type { BackendCandidateScreeningResponse, BackendCandidateATSAnalysis, BackendCandidateListItem, APIResponse } from "./recruitmentCandidateTypes";

export const recruitmentCandidateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadResumeForScreening: builder.mutation<BackendCandidateScreeningResponse, FormData>({
      query: (formData) => ({ url: "/api/v1/recruitment/resume/upload", method: "POST", body: formData }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Candidate", "Recruitment"],
    }),
    getRecruitmentCandidates: builder.query<{ items: BackendCandidateListItem[]; total: number }, { search?: string; status?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const p = params as { search?: string; status?: string; page?: number; limit?: number } | undefined;
        const sp = new URLSearchParams();
        if (p?.search) sp.append("search", p.search); if (p?.status) sp.append("status", p.status);
        if (p?.page) sp.append("page", String(p.page)); if (p?.limit) sp.append("limit", String(p.limit));
        const q = sp.toString();
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
    getCandidateATSAnalysis: builder.query<BackendCandidateATSAnalysis, string>({
      query: (id) => `/api/v1/recruitment/candidates/${id}/ats`,
      transformResponse: (response: APIResponse<BackendCandidateATSAnalysis>) => response.data,
      providesTags: (_res, _err, id) => [{ type: "Candidate", id }],
    }),
    uploadResume: builder.mutation<BackendCandidateScreeningResponse, FormData>({
      query: (formData) => ({ url: "/api/v1/recruitment/resume/upload", method: "POST", body: formData }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Candidate", "Recruitment"],
    }),
  }),
});
export const {
  useUploadResumeForScreeningMutation, useUploadResumeMutation,
  useGetRecruitmentCandidatesQuery, useGetRecruitmentCandidateByIdQuery, useGetCandidateATSAnalysisQuery,
} = recruitmentCandidateApi;
