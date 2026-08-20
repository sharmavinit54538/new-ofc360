import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDocumentsEmployees: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/employees` : typeof data === 'object' && data?.id ? `/api/v1/documents/employees` : '/api/v1/documents/employees',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    getDocumentsEmployees: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/documents/employees` : typeof params === 'object' && params?.id ? `/api/v1/documents/employees` : '/api/v1/documents/employees',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    getDocumentsEmployeesId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/documents/employees/${params}` : typeof params === 'object' && params?.id ? `/api/v1/documents/employees/${params.id}` : '/api/v1/documents/employees/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    updateDocumentsEmployeesId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/employees/${data}` : typeof data === 'object' && data?.id ? `/api/v1/documents/employees/${data.id}` : '/api/v1/documents/employees/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    deleteDocumentsEmployeesId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/employees/${data}` : typeof data === 'object' && data?.id ? `/api/v1/documents/employees/${data.id}` : '/api/v1/documents/employees/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    getDocumentsEmployeesIdDownload: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/documents/employees/${params}/download` : typeof params === 'object' && params?.id ? `/api/v1/documents/employees/${params.id}/download` : '/api/v1/documents/employees/{id}/download',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    createDocumentsCompany: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/company` : typeof data === 'object' && data?.id ? `/api/v1/documents/company` : '/api/v1/documents/company',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    getDocumentsCompany: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/documents/company` : typeof params === 'object' && params?.id ? `/api/v1/documents/company` : '/api/v1/documents/company',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    getDocumentsCompanyId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/documents/company/${params}` : typeof params === 'object' && params?.id ? `/api/v1/documents/company/${params.id}` : '/api/v1/documents/company/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    deleteDocumentsCompanyId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/company/${data}` : typeof data === 'object' && data?.id ? `/api/v1/documents/company/${data.id}` : '/api/v1/documents/company/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    createDocumentsIdRequestSignature: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/${data}/request-signature` : typeof data === 'object' && data?.id ? `/api/v1/documents/${data.id}/request-signature` : '/api/v1/documents/{id}/request-signature',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    createDocumentsIdSign: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/${data}/sign` : typeof data === 'object' && data?.id ? `/api/v1/documents/${data.id}/sign` : '/api/v1/documents/{id}/sign',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    getDocumentsIdSignatureStatus: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/documents/${params}/signature-status` : typeof params === 'object' && params?.id ? `/api/v1/documents/${params.id}/signature-status` : '/api/v1/documents/{id}/signature-status',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    updateDocumentsIdVerify: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/${data}/verify` : typeof data === 'object' && data?.id ? `/api/v1/documents/${data.id}/verify` : '/api/v1/documents/{id}/verify',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    updateDocumentsIdReject: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/documents/${data}/reject` : typeof data === 'object' && data?.id ? `/api/v1/documents/${data.id}/reject` : '/api/v1/documents/{id}/reject',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    getDocumentsExpiring: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/documents/expiring` : typeof params === 'object' && params?.id ? `/api/v1/documents/expiring` : '/api/v1/documents/expiring',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    getDocumentsExpired: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/documents/expired` : typeof params === 'object' && params?.id ? `/api/v1/documents/expired` : '/api/v1/documents/expired',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    getDocumentTemplates: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/document-templates` : typeof params === 'object' && params?.id ? `/api/v1/document-templates` : '/api/v1/document-templates',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Document'],
    }),
    createDocumentTemplates: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/document-templates` : typeof data === 'object' && data?.id ? `/api/v1/document-templates` : '/api/v1/document-templates',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
    createDocumentTemplatesIdGenerate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/document-templates/${data}/generate` : typeof data === 'object' && data?.id ? `/api/v1/document-templates/${data.id}/generate` : '/api/v1/document-templates/{id}/generate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Document'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateDocumentsEmployeesMutation,
  useGetDocumentsEmployeesQuery,
  useGetDocumentsEmployeesIdQuery,
  useUpdateDocumentsEmployeesIdMutation,
  useDeleteDocumentsEmployeesIdMutation,
  useGetDocumentsEmployeesIdDownloadQuery,
  useCreateDocumentsCompanyMutation,
  useGetDocumentsCompanyQuery,
  useGetDocumentsCompanyIdQuery,
  useDeleteDocumentsCompanyIdMutation,
  useCreateDocumentsIdRequestSignatureMutation,
  useCreateDocumentsIdSignMutation,
  useGetDocumentsIdSignatureStatusQuery,
  useUpdateDocumentsIdVerifyMutation,
  useUpdateDocumentsIdRejectMutation,
  useGetDocumentsExpiringQuery,
  useGetDocumentsExpiredQuery,
  useGetDocumentTemplatesQuery,
  useCreateDocumentTemplatesMutation,
  useCreateDocumentTemplatesIdGenerateMutation,
} = documentsApi;
