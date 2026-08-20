import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const interviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createApplicationsIdSendInterview: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/${data}/send-interview` : typeof data === 'object' && data?.id ? `/api/v1/applications/${data.id}/send-interview` : '/api/v1/applications/{id}/send-interview',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    createInterviewsIdSchedule: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/interviews/${data}/schedule` : typeof data === 'object' && data?.id ? `/api/v1/interviews/${data.id}/schedule` : '/api/v1/interviews/{id}/schedule',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    getInterviews: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/interviews` : typeof params === 'object' && params?.id ? `/api/v1/interviews` : '/api/v1/interviews',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Interview'],
    }),
    getInterviewsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/interviews/${params}` : typeof params === 'object' && params?.id ? `/api/v1/interviews/${params.id}` : '/api/v1/interviews/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Interview'],
    }),
    updateInterviewsRoundsRoundIdPass: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/interviews/rounds/${data}/pass` : typeof data === 'object' && data?.id ? `/api/v1/interviews/rounds/{round_id}/pass` : '/api/v1/interviews/rounds/{round_id}/pass',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    updateInterviewsRoundsRoundIdReject: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/interviews/rounds/${data}/reject` : typeof data === 'object' && data?.id ? `/api/v1/interviews/rounds/{round_id}/reject` : '/api/v1/interviews/rounds/{round_id}/reject',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    updateInterviewsRoundsRoundIdHold: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/interviews/rounds/${data}/hold` : typeof data === 'object' && data?.id ? `/api/v1/interviews/rounds/{round_id}/hold` : '/api/v1/interviews/rounds/{round_id}/hold',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    createScorecardsTemplates: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/scorecards/templates` : typeof data === 'object' && data?.id ? `/api/v1/scorecards/templates` : '/api/v1/scorecards/templates',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    getScorecardsTemplates: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/scorecards/templates` : typeof params === 'object' && params?.id ? `/api/v1/scorecards/templates` : '/api/v1/scorecards/templates',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Interview'],
    }),
    createScorecardsSubmissions: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/scorecards/submissions` : typeof data === 'object' && data?.id ? `/api/v1/scorecards/submissions` : '/api/v1/scorecards/submissions',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    getScorecardsSubmissionsRoundId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/scorecards/submissions/${params}` : typeof params === 'object' && params?.id ? `/api/v1/scorecards/submissions/{round_id}` : '/api/v1/scorecards/submissions/{round_id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Interview'],
    }),
    createV2InterviewBotSessions: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/interview-bot/sessions` : typeof data === 'object' && data?.id ? `/api/v2/interview-bot/sessions` : '/api/v2/interview-bot/sessions',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    createV2InterviewBotSessionsSessionIdStart: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/interview-bot/sessions/${data}/start` : typeof data === 'object' && data?.id ? `/api/v2/interview-bot/sessions/{session_id}/start` : '/api/v2/interview-bot/sessions/{session_id}/start',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    createV2InterviewBotSessionsSessionIdAnswer: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/interview-bot/sessions/${data}/answer` : typeof data === 'object' && data?.id ? `/api/v2/interview-bot/sessions/{session_id}/answer` : '/api/v2/interview-bot/sessions/{session_id}/answer',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    createV2InterviewBotSessionsSessionIdProctorAlert: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/interview-bot/sessions/${data}/proctor-alert` : typeof data === 'object' && data?.id ? `/api/v2/interview-bot/sessions/{session_id}/proctor-alert` : '/api/v2/interview-bot/sessions/{session_id}/proctor-alert',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    createV2InterviewBotSessionsSessionIdFinalize: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/interview-bot/sessions/${data}/finalize` : typeof data === 'object' && data?.id ? `/api/v2/interview-bot/sessions/{session_id}/finalize` : '/api/v2/interview-bot/sessions/{session_id}/finalize',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    createV2BehaviouralSessions: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/behavioural/sessions` : typeof data === 'object' && data?.id ? `/api/v2/behavioural/sessions` : '/api/v2/behavioural/sessions',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
    createV2BehaviouralQuestionsQuestionIdRespond: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/behavioural/questions/${data}/respond` : typeof data === 'object' && data?.id ? `/api/v2/behavioural/questions/{question_id}/respond` : '/api/v2/behavioural/questions/{question_id}/respond',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Interview'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateApplicationsIdSendInterviewMutation,
  useCreateInterviewsIdScheduleMutation,
  useGetInterviewsQuery,
  useGetInterviewsIdQuery,
  useUpdateInterviewsRoundsRoundIdPassMutation,
  useUpdateInterviewsRoundsRoundIdRejectMutation,
  useUpdateInterviewsRoundsRoundIdHoldMutation,
  useCreateScorecardsTemplatesMutation,
  useGetScorecardsTemplatesQuery,
  useCreateScorecardsSubmissionsMutation,
  useGetScorecardsSubmissionsRoundIdQuery,
  useCreateV2InterviewBotSessionsMutation,
  useCreateV2InterviewBotSessionsSessionIdStartMutation,
  useCreateV2InterviewBotSessionsSessionIdAnswerMutation,
  useCreateV2InterviewBotSessionsSessionIdProctorAlertMutation,
  useCreateV2InterviewBotSessionsSessionIdFinalizeMutation,
  useCreateV2BehaviouralSessionsMutation,
  useCreateV2BehaviouralQuestionsQuestionIdRespondMutation,
} = interviewApi;
