import { baseApi } from "../baseApi";
import type { BackendJobListResponse, BackendJobDetail } from "./recruitmentJobTypes";
import type { APIResponse } from "./recruitmentCandidateTypes";

export const recruitmentJobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecruitmentJobs: builder.query<BackendJobListResponse, { status?: string; search?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const p = params as { status?: string; search?: string; page?: number; limit?: number } | undefined;
        const sp = new URLSearchParams();
        if (p?.status) sp.append("status", p.status); if (p?.search) sp.append("search", p.search);
        if (p?.page) sp.append("page", String(p.page)); if (p?.limit) sp.append("limit", String(p.limit));
        const q = sp.toString();
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
    getJobs: builder.query<BackendJobListResponse, { status?: string; search?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const p = params as { status?: string; search?: string; page?: number; limit?: number } | undefined;
        const sp = new URLSearchParams();
        if (p?.status) sp.append("status", p.status); if (p?.search) sp.append("search", p.search);
        if (p?.page) sp.append("page", String(p.page)); if (p?.limit) sp.append("limit", String(p.limit));
        const q = sp.toString();
        return `/api/v1/jobs${q ? `?${q}` : ""}`;
      },
      transformResponse: (response: APIResponse<BackendJobListResponse>) => response.data,
      providesTags: ["Job", "Recruitment"],
    }),
  }),
});
export const { useGetRecruitmentJobsQuery, useGetJobsQuery, useGetRecruitmentJobByIdQuery } = recruitmentJobsApi;
