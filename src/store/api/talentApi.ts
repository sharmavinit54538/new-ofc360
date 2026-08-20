import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const talentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2DigitalTwinSync: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/digital-twin/sync` : typeof data === 'object' && data?.id ? `/api/v2/digital-twin/sync` : '/api/v2/digital-twin/sync',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Talent'],
    }),
    createV2TalentMatch: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/talent/match` : typeof data === 'object' && data?.id ? `/api/v2/talent/match` : '/api/v2/talent/match',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Talent'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2DigitalTwinSyncMutation,
  useCreateV2TalentMatchMutation,
} = talentApi;