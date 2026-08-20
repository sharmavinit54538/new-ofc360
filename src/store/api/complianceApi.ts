import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const complianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2PoliciesDocuments: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/policies/documents` : typeof data === 'object' && data?.id ? `/api/v2/policies/documents` : '/api/v2/policies/documents',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Compliance'],
    }),
    createV2PoliciesChat: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/policies/chat` : typeof data === 'object' && data?.id ? `/api/v2/policies/chat` : '/api/v2/policies/chat',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Compliance'],
    }),
    createV2ComplianceAudit: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/compliance/audit` : typeof data === 'object' && data?.id ? `/api/v2/compliance/audit` : '/api/v2/compliance/audit',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Compliance'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2PoliciesDocumentsMutation,
  useCreateV2PoliciesChatMutation,
  useCreateV2ComplianceAuditMutation,
} = complianceApi;