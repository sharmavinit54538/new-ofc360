import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJobs: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs` : typeof data === 'object' && data?.id ? `/api/v1/jobs` : '/api/v1/jobs',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    getJobs: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/jobs` : typeof params === 'object' && params?.id ? `/api/v1/jobs` : '/api/v1/jobs',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Job'],
    }),
    getJobsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/jobs/${params}` : typeof params === 'object' && params?.id ? `/api/v1/jobs/${params.id}` : '/api/v1/jobs/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Job'],
    }),
    updateJobsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs/${data}` : typeof data === 'object' && data?.id ? `/api/v1/jobs/${data.id}` : '/api/v1/jobs/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    deleteJobsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs/${data}` : typeof data === 'object' && data?.id ? `/api/v1/jobs/${data.id}` : '/api/v1/jobs/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    createJobsIdPublish: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs/${data}/publish` : typeof data === 'object' && data?.id ? `/api/v1/jobs/${data.id}/publish` : '/api/v1/jobs/{id}/publish',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    createJobsIdClose: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs/${data}/close` : typeof data === 'object' && data?.id ? `/api/v1/jobs/${data.id}/close` : '/api/v1/jobs/{id}/close',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    createJobsIdDraft: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs/${data}/draft` : typeof data === 'object' && data?.id ? `/api/v1/jobs/${data.id}/draft` : '/api/v1/jobs/{id}/draft',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    createJobsIdDuplicate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs/${data}/duplicate` : typeof data === 'object' && data?.id ? `/api/v1/jobs/${data.id}/duplicate` : '/api/v1/jobs/{id}/duplicate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    createJobsGenerateDescription: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs/generate-description` : typeof data === 'object' && data?.id ? `/api/v1/jobs/generate-description` : '/api/v1/jobs/generate-description',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    createJobsAiAutofill: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/jobs/ai-autofill` : typeof data === 'object' && data?.id ? `/api/v1/jobs/ai-autofill` : '/api/v1/jobs/ai-autofill',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
    getPublicCareers: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/public/careers` : typeof params === 'object' && params?.id ? `/api/public/careers` : '/api/public/careers',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Job'],
    }),
    getPublicCareersSearch: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/public/careers/search` : typeof params === 'object' && params?.id ? `/api/public/careers/search` : '/api/public/careers/search',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Job'],
    }),
    getPublicCareersFilter: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/public/careers/filter` : typeof params === 'object' && params?.id ? `/api/public/careers/filter` : '/api/public/careers/filter',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Job'],
    }),
    getPublicCareersSlug: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/public/careers/${params}` : typeof params === 'object' && params?.id ? `/api/public/careers/{slug}` : '/api/public/careers/{slug}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Job'],
    }),
    createPublicCareersSlugApply: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/public/careers/${data}/apply` : typeof data === 'object' && data?.id ? `/api/public/careers/{slug}/apply` : '/api/public/careers/{slug}/apply',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Job'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateJobsMutation,
  useGetJobsQuery,
  useGetJobsIdQuery,
  useUpdateJobsIdMutation,
  useDeleteJobsIdMutation,
  useCreateJobsIdPublishMutation,
  useCreateJobsIdCloseMutation,
  useCreateJobsIdDraftMutation,
  useCreateJobsIdDuplicateMutation,
  useCreateJobsGenerateDescriptionMutation,
  useCreateJobsAiAutofillMutation,
  useGetPublicCareersQuery,
  useGetPublicCareersSearchQuery,
  useGetPublicCareersFilterQuery,
  useGetPublicCareersSlugQuery,
  useCreatePublicCareersSlugApplyMutation,
} = jobsApi;