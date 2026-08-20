import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const candidatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCandidates: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/candidates` : typeof data === 'object' && data?.id ? `/api/v1/candidates` : '/api/v1/candidates',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    getCandidates: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/candidates` : typeof params === 'object' && params?.id ? `/api/v1/candidates` : '/api/v1/candidates',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    getCandidatesId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/candidates/${params}` : typeof params === 'object' && params?.id ? `/api/v1/candidates/${params.id}` : '/api/v1/candidates/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
    updateCandidatesId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/candidates/${data}` : typeof data === 'object' && data?.id ? `/api/v1/candidates/${data.id}` : '/api/v1/candidates/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    deleteCandidatesId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/candidates/${data}` : typeof data === 'object' && data?.id ? `/api/v1/candidates/${data.id}` : '/api/v1/candidates/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    createCandidatesImport: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/candidates/import` : typeof data === 'object' && data?.id ? `/api/v1/candidates/import` : '/api/v1/candidates/import',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Candidate'],
    }),
    getCandidatesExportCsv: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/candidates/export/csv` : typeof params === 'object' && params?.id ? `/api/v1/candidates/export/csv` : '/api/v1/candidates/export/csv',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Candidate'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCandidatesMutation,
  useGetCandidatesQuery,
  useGetCandidatesIdQuery,
  useUpdateCandidatesIdMutation,
  useDeleteCandidatesIdMutation,
  useCreateCandidatesImportMutation,
  useGetCandidatesExportCsvQuery,
} = candidatesApi;