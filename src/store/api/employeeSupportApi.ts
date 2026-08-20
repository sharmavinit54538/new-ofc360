import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const employeeSupportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2EmployeeSupportChat: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/employee-support/chat` : typeof data === 'object' && data?.id ? `/api/v2/employee-support/chat` : '/api/v2/employee-support/chat',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['EmployeeSupport'],
    }),
    createV2EmployeeSupportTickets: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/employee-support/tickets` : typeof data === 'object' && data?.id ? `/api/v2/employee-support/tickets` : '/api/v2/employee-support/tickets',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['EmployeeSupport'],
    }),
    getV2EmployeeSupportTicketsMy: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v2/employee-support/tickets/my` : typeof params === 'object' && params?.id ? `/api/v2/employee-support/tickets/my` : '/api/v2/employee-support/tickets/my',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['EmployeeSupport'],
    }),
    updateV2EmployeeSupportTicketsTicketId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/employee-support/tickets/${data.ticket_id}` : typeof data === 'object' && data?.id ? `/api/v2/employee-support/tickets/{ticket_id}` : '/api/v2/employee-support/tickets/{ticket_id}',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['EmployeeSupport'],
    }),
    getV2EmployeeSupportHrCopilotStats: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v2/employee-support/hr-copilot/stats` : typeof params === 'object' && params?.id ? `/api/v2/employee-support/hr-copilot/stats` : '/api/v2/employee-support/hr-copilot/stats',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['EmployeeSupport'],
    }),
    createV2WellnessCheckins: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/wellness/checkins` : typeof data === 'object' && data?.id ? `/api/v2/wellness/checkins` : '/api/v2/wellness/checkins',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['EmployeeSupport'],
    }),
    createV2WellnessEscalationRules: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/wellness/escalation-rules` : typeof data === 'object' && data?.id ? `/api/v2/wellness/escalation-rules` : '/api/v2/wellness/escalation-rules',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['EmployeeSupport'],
    }),
    createV2WellnessAnonymousChats: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/wellness/anonymous-chats` : typeof data === 'object' && data?.id ? `/api/v2/wellness/anonymous-chats` : '/api/v2/wellness/anonymous-chats',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['EmployeeSupport'],
    }),
    createV2WellnessAnonymousChatsSessionIdMessages: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/wellness/anonymous-chats/${data.session_id}/messages` : typeof data === 'object' && data?.id ? `/api/v2/wellness/anonymous-chats/{session_id}/messages` : '/api/v2/wellness/anonymous-chats/{session_id}/messages',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['EmployeeSupport'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2EmployeeSupportChatMutation,
  useCreateV2EmployeeSupportTicketsMutation,
  useGetV2EmployeeSupportTicketsMyQuery,
  useUpdateV2EmployeeSupportTicketsTicketIdMutation,
  useGetV2EmployeeSupportHrCopilotStatsQuery,
  useCreateV2WellnessCheckinsMutation,
  useCreateV2WellnessEscalationRulesMutation,
  useCreateV2WellnessAnonymousChatsMutation,
  useCreateV2WellnessAnonymousChatsSessionIdMessagesMutation,
} = employeeSupportApi;
