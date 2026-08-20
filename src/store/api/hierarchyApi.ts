import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const hierarchyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2OrgMapGenerate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/org-map/generate` : typeof data === 'object' && data?.id ? `/api/v2/org-map/generate` : '/api/v2/org-map/generate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Department'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2OrgMapGenerateMutation,
} = hierarchyApi;