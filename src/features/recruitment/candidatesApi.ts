import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  Candidate,
  CandidateFilters,
  AtsScoreBreakdown,
} from "./types";

export const candidatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadResume: builder.mutation<APIResponse<Candidate>, FormData>({
      query: (formData) => ({
        url: "/api/v1/recruitment/resume/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Candidate", id: "LIST" }],
    }),

    getCandidates: builder.query<APIResponse<Candidate[]>, CandidateFilters | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.stage) queryParams.append("stage", params.stage);
        if (params?.jobId) queryParams.append("jobId", params.jobId);
        const queryStr = queryParams.toString();
        return `/api/v1/recruitment/candidates${queryStr ? `?${queryStr}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Candidate" as const,
                id,
              })),
              { type: "Candidate", id: "LIST" },
            ]
          : [{ type: "Candidate", id: "LIST" }],
    }),

    getCandidateProfile: builder.query<APIResponse<Candidate>, string>({
      query: (candidateId) => `/api/v1/recruitment/candidates/${candidateId}`,
      providesTags: (_res, _err, candidateId) => [
        { type: "Candidate", id: candidateId },
      ],
    }),

    getCandidateAtsBreakdown: builder.query<
      APIResponse<AtsScoreBreakdown>,
      string
    >({
      query: (candidateId) =>
        `/api/v1/recruitment/candidates/${candidateId}/ats`,
      providesTags: (_res, _err, candidateId) => [
        { type: "Candidate", id: candidateId },
      ],
    }),

    recalculateJobAtsMatch: builder.mutation<
      APIResponse<{ match_count: number; updated: boolean }>,
      string
    >({
      query: (jobId) => ({
        url: `/api/v1/recruitment/jobs/${jobId}/match`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Candidate", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadResumeMutation,
  useGetCandidatesQuery,
  useGetCandidateProfileQuery,
  useGetCandidateAtsBreakdownQuery,
  useRecalculateJobAtsMatchMutation,
} = candidatesApi;
