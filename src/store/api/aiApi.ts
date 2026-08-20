import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAiUploadResume: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/upload-resume` : typeof data === 'object' && data?.id ? `/api/v1/ai/upload-resume` : '/api/v1/ai/upload-resume',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createAiExtract: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/extract` : typeof data === 'object' && data?.id ? `/api/v1/ai/extract` : '/api/v1/ai/extract',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createAiEmbedding: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/embedding` : typeof data === 'object' && data?.id ? `/api/v1/ai/embedding` : '/api/v1/ai/embedding',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createAiMatch: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/match` : typeof data === 'object' && data?.id ? `/api/v1/ai/match` : '/api/v1/ai/match',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createAiAnalyze: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/analyze` : typeof data === 'object' && data?.id ? `/api/v1/ai/analyze` : '/api/v1/ai/analyze',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createAiRank: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/rank` : typeof data === 'object' && data?.id ? `/api/v1/ai/rank` : '/api/v1/ai/rank',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createAiInterview: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/interview` : typeof data === 'object' && data?.id ? `/api/v1/ai/interview` : '/api/v1/ai/interview',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    getAiDashboardResumeDocumentId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/ai/dashboard/${params.resume_document_id}` : typeof params === 'object' && params?.id ? `/api/v1/ai/dashboard/{resume_document_id}` : '/api/v1/ai/dashboard/{resume_document_id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['AI'],
    }),
    getAiJobRankingJobId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/ai/job-ranking/${params.job_id}` : typeof params === 'object' && params?.id ? `/api/v1/ai/job-ranking/{job_id}` : '/api/v1/ai/job-ranking/{job_id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['AI'],
    }),
    createAiCopilot: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/copilot` : typeof data === 'object' && data?.id ? `/api/v1/ai/copilot` : '/api/v1/ai/copilot',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createAiChat: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/chat` : typeof data === 'object' && data?.id ? `/api/v1/ai/chat` : '/api/v1/ai/chat',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    getAiHistory: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/ai/history` : typeof params === 'object' && params?.id ? `/api/v1/ai/history` : '/api/v1/ai/history',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['AI'],
    }),
    getAiHistoryConversationId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/ai/history/${params.conversation_id}` : typeof params === 'object' && params?.id ? `/api/v1/ai/history/{conversation_id}` : '/api/v1/ai/history/{conversation_id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['AI'],
    }),
    updateAiHistoryConversationId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/history/${data.conversation_id}` : typeof data === 'object' && data?.id ? `/api/v1/ai/history/{conversation_id}` : '/api/v1/ai/history/{conversation_id}',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    deleteAiHistoryConversationId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/history/${data.conversation_id}` : typeof data === 'object' && data?.id ? `/api/v1/ai/history/{conversation_id}` : '/api/v1/ai/history/{conversation_id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createAiClear: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/ai/clear` : typeof data === 'object' && data?.id ? `/api/v1/ai/clear` : '/api/v1/ai/clear',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    getAiSuggestions: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/ai/suggestions` : typeof params === 'object' && params?.id ? `/api/v1/ai/suggestions` : '/api/v1/ai/suggestions',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['AI'],
    }),
    createV2EmailsGenerate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/emails/generate` : typeof data === 'object' && data?.id ? `/api/v2/emails/generate` : '/api/v2/emails/generate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createV2EmotionsSessions: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/emotions/sessions` : typeof data === 'object' && data?.id ? `/api/v2/emotions/sessions` : '/api/v2/emotions/sessions',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createV2EmotionsSessionsSessionIdMessages: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/emotions/sessions/${data.session_id}/messages` : typeof data === 'object' && data?.id ? `/api/v2/emotions/sessions/{session_id}/messages` : '/api/v2/emotions/sessions/{session_id}/messages',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createV2CopilotQuery: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/copilot/query` : typeof data === 'object' && data?.id ? `/api/v2/copilot/query` : '/api/v2/copilot/query',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateAiUploadResumeMutation,
  useCreateAiExtractMutation,
  useCreateAiEmbeddingMutation,
  useCreateAiMatchMutation,
  useCreateAiAnalyzeMutation,
  useCreateAiRankMutation,
  useCreateAiInterviewMutation,
  useGetAiDashboardResumeDocumentIdQuery,
  useGetAiJobRankingJobIdQuery,
  useCreateAiCopilotMutation,
  useCreateAiChatMutation,
  useGetAiHistoryQuery,
  useGetAiHistoryConversationIdQuery,
  useUpdateAiHistoryConversationIdMutation,
  useDeleteAiHistoryConversationIdMutation,
  useCreateAiClearMutation,
  useGetAiSuggestionsQuery,
  useCreateV2EmailsGenerateMutation,
  useCreateV2EmotionsSessionsMutation,
  useCreateV2EmotionsSessionsSessionIdMessagesMutation,
  useCreateV2CopilotQueryMutation,
} = aiApi;
