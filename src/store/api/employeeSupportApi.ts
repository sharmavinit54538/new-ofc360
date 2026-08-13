import { baseApi } from "./baseApi";

export interface TicketComment {
  id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number?: string;
  user_id?: string;
  user_name?: string;
  subject: string;
  description: string;
  category?: string;
  priority: "low" | "medium" | "high" | "urgent" | string;
  status: "open" | "in_progress" | "resolved" | "closed" | string;
  comments?: TicketComment[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "urgent" | string;
}

export interface UpdateTicketRequest {
  status?: string;
  comment?: string;
  priority?: string;
  category?: string;
}

export interface TicketQueryParams {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export interface CopilotChatRequest {
  message: string;
  conversation_id?: string;
  context?: Record<string, unknown>;
}

export interface CopilotChatResponse {
  response: string;
  conversation_id?: string;
  suggestions?: string[];
  metadata?: Record<string, unknown>;
}

export interface HrCopilotStats {
  total_conversations: number;
  total_tickets_created: number;
  avg_response_time_ms: number;
  sla_compliance_rate: number;
  resolved_by_copilot_count: number;
  escalated_to_hr_count: number;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function transformApiResponse<T>(response: APIResponse<T> | T): T {
  if (response && typeof response === "object" && "data" in response && "success" in response) {
    return (response as APIResponse<T>).data;
  }
  return response as T;
}

export const employeeSupportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    chatCopilot: builder.mutation<CopilotChatResponse, CopilotChatRequest>({
      query: (body) => ({
        url: "/api/v2/employee-support/chat",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
    }),

    createTicket: builder.mutation<SupportTicket, CreateTicketRequest>({
      query: (body) => ({
        url: "/api/v2/employee-support/tickets",
        method: "POST",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: [{ type: "SupportTicket", id: "LIST" }],
    }),

    getMyTickets: builder.query<SupportTicket[], TicketQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append("status", params.status);
        if (params?.priority) searchParams.append("priority", params.priority);
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit) searchParams.append("limit", params.limit.toString());
        const q = searchParams.toString();
        return `/api/v2/employee-support/tickets/my${q ? `?${q}` : ""}`;
      },
      keepUnusedDataFor: 60,
      transformResponse: transformApiResponse,
      providesTags: (result) => {
        const items = Array.isArray(result) ? result : [];
        return [
          ...items.map(({ id }) => ({ type: "SupportTicket" as const, id })),
          { type: "SupportTicket", id: "LIST" },
        ];
      },
    }),

    updateTicket: builder.mutation<SupportTicket, { ticket_id: string; body: UpdateTicketRequest }>({
      query: ({ ticket_id, body }) => ({
        url: `/api/v2/employee-support/tickets/${ticket_id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: transformApiResponse,
      invalidatesTags: (_result, _error, { ticket_id }) => [
        { type: "SupportTicket", id: ticket_id },
        { type: "SupportTicket", id: "LIST" },
      ],
    }),

    getHrCopilotStats: builder.query<HrCopilotStats, void>({
      query: () => "/api/v2/employee-support/hr-copilot/stats",
      transformResponse: transformApiResponse,
      providesTags: ["HrCopilotStats"],
    }),
  }),
});

export const {
  useChatCopilotMutation,
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  useUpdateTicketMutation,
  useGetHrCopilotStatsQuery,
} = employeeSupportApi;
