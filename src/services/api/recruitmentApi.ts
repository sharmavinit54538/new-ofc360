import { baseApi } from "./baseApi";
import { Candidate, JobOpening } from "@/types/ats";

export type JobPosting = JobOpening;

export interface ATSAnalysisResult {
  candidateId: string;
  jobId: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  summary: string;
  recommendation: "Strong Fit" | "Moderate Fit" | "Low Fit";
}

export interface CreateJobInput {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface UploadResumeInput {
  candidateName: string;
  email: string;
  jobId: string;
  resumeFile?: File;
}

export interface AtsScoreInput {
  candidateId: string;
  jobId: string;
}

export const recruitmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<JobOpening[], void>({
      query: () => "/api/v1/recruitment/jobs",
      providesTags: ["Job", "Recruitment"],
    }),

    getJobById: builder.query<JobOpening, string>({
      query: (id) => `/api/v1/recruitment/jobs/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Job", id }],
    }),

    createJob: builder.mutation<JobOpening, CreateJobInput>({
      query: (body) => ({
        url: "/api/v1/recruitment/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Job", "Recruitment"],
    }),

    getCandidates: builder.query<Candidate[], { jobId?: string; status?: string }>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.jobId) search.append("jobId", params.jobId);
        if (params?.status) search.append("status", params.status);
        const q = search.toString();
        return `/api/v1/recruitment/candidates${q ? `?${q}` : ""}`;
      },
      providesTags: ["Candidate"],
    }),

    getCandidateById: builder.query<Candidate, string>({
      query: (id) => `/api/v1/recruitment/candidates/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Candidate", id }],
    }),

    uploadResume: builder.mutation<Candidate, FormData>({
      query: (formData) => ({
        url: "/api/v1/recruitment/resumes/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Candidate", "Recruitment"],
    }),

    analyzeAtsScore: builder.mutation<ATSAnalysisResult, AtsScoreInput>({
      query: (body) => ({
        url: "/api/v1/recruitment/ats/analyze",
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { candidateId }) => [
        { type: "Candidate", id: candidateId },
        "Candidate",
      ],
    }),

    rankCandidates: builder.query<Candidate[], string>({
      query: (jobId) => `/api/v1/recruitment/jobs/${jobId}/ranked-candidates`,
      providesTags: ["Candidate", "Recruitment"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useGetCandidatesQuery,
  useGetCandidateByIdQuery,
  useUploadResumeMutation,
  useAnalyzeAtsScoreMutation,
  useRankCandidatesQuery,
} = recruitmentApi;
