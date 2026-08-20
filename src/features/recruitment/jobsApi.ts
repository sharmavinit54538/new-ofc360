import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  JobPosting,
  CreateJobInput,
  UpdateJobInput,
  PublishChannel,
  GenerateDescriptionInput,
  AiAutofillInput,
  ModifyDescriptionInput,
  SourcingLinkResponse,
  QrCodeResponse,
} from "./types";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<APIResponse<JobPosting[]>, void>({
      query: () => "/api/v1/jobs",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Job" as const, id })),
              { type: "Job", id: "LIST" },
            ]
          : [{ type: "Job", id: "LIST" }],
    }),

    getJobById: builder.query<APIResponse<JobPosting>, string>({
      query: (id) => `/api/v1/jobs/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Job", id }],
    }),

    createJob: builder.mutation<APIResponse<JobPosting>, CreateJobInput>({
      query: (body) => ({
        url: "/api/v1/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),

    updateJob: builder.mutation<
      APIResponse<JobPosting>,
      { id: string; body: UpdateJobInput }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/jobs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Job", id: "LIST" },
        { type: "Job", id },
      ],
    }),

    deleteJob: builder.mutation<APIResponse<{ success: boolean }>, string>({
      query: (id) => ({
        url: `/api/v1/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Job", id: "LIST" },
        { type: "Job", id },
      ],
    }),

    getPublishChannels: builder.query<APIResponse<PublishChannel[]>, string>({
      query: (id) => `/api/v1/jobs/${id}/publish`,
      providesTags: (_res, _err, id) => [{ type: "Job", id }],
    }),

    publishJob: builder.mutation<
      APIResponse<JobPosting>,
      { id: string; channelId: string }
    >({
      query: ({ id, channelId }) => ({
        url: `/api/v1/jobs/${id}/publish`,
        method: "POST",
        body: { channel_id: channelId },
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Job", id: "LIST" },
        { type: "Job", id },
      ],
    }),

    closeJob: builder.mutation<APIResponse<JobPosting>, string>({
      query: (id) => ({
        url: `/api/v1/jobs/${id}/close`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Job", id: "LIST" },
        { type: "Job", id },
      ],
    }),

    draftJob: builder.mutation<APIResponse<JobPosting>, string>({
      query: (id) => ({
        url: `/api/v1/jobs/${id}/draft`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Job", id: "LIST" },
        { type: "Job", id },
      ],
    }),

    duplicateJob: builder.mutation<APIResponse<JobPosting>, string>({
      query: (id) => ({
        url: `/api/v1/jobs/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),

    generateDescription: builder.mutation<
      APIResponse<{ description: string; requirements: string[] }>,
      GenerateDescriptionInput
    >({
      query: (body) => ({
        url: "/api/v1/jobs/generate-description",
        method: "POST",
        body,
      }),
    }),

    aiAutofill: builder.mutation<APIResponse<Partial<CreateJobInput>>, AiAutofillInput>({
      query: (body) => ({
        url: "/api/v1/jobs/ai-autofill",
        method: "POST",
        body,
      }),
    }),

    modifyDescription: builder.mutation<
      APIResponse<{ description: string }>,
      ModifyDescriptionInput
    >({
      query: (body) => ({
        url: "/api/v1/jobs/modify-description",
        method: "POST",
        body,
      }),
    }),

    getSourcingLink: builder.query<APIResponse<SourcingLinkResponse>, string>({
      query: (id) => `/api/v1/jobs/${id}/sourcing-link`,
      providesTags: (_res, _err, id) => [{ type: "Job", id }],
    }),

    getJobQrCode: builder.query<APIResponse<QrCodeResponse>, string>({
      query: (id) => `/api/v1/jobs/${id}/qr`,
      providesTags: (_res, _err, id) => [{ type: "Job", id }],
    }),

    exportApplicantsReport: builder.query<Blob, string>({
      query: (id) => ({
        url: `/api/v1/jobs/${id}/applicants/export`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetPublishChannelsQuery,
  usePublishJobMutation,
  useCloseJobMutation,
  useDraftJobMutation,
  useDuplicateJobMutation,
  useGenerateDescriptionMutation,
  useAiAutofillMutation,
  useModifyDescriptionMutation,
  useGetSourcingLinkQuery,
  useGetJobQrCodeQuery,
  useLazyExportApplicantsReportQuery,
} = jobsApi;