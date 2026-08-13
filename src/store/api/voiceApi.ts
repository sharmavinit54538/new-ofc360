import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const voiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2VoiceCommand: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/voice/command` : typeof data === 'object' && data?.id ? `/api/v2/voice/command` : '/api/v2/voice/command',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Voice'],
    }),
    createV2MeetingsAnalyze: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/meetings/analyze` : typeof data === 'object' && data?.id ? `/api/v2/meetings/analyze` : '/api/v2/meetings/analyze',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Voice'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2VoiceCommandMutation,
  useCreateV2MeetingsAnalyzeMutation,
} = voiceApi;
