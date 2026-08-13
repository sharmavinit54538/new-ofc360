import { baseApi } from "@/services/api/baseApi";
import { APIResponse, OvertimeEntry, PaginationQueryParams } from "./types";

export const overtimeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOvertimeEntries: builder.query<APIResponse<OvertimeEntry[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/overtime",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Overtime" as const, id })),
              { type: "Overtime", id: "LIST" },
            ]
          : [{ type: "Overtime", id: "LIST" }],
    }),

    createOvertimeEntry: builder.mutation<APIResponse<OvertimeEntry>, Partial<OvertimeEntry>>({
      query: (body) => ({
        url: "/v2/payroll/overtime",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Overtime", id: "LIST" }],
    }),

    approveOvertime: builder.mutation<APIResponse<OvertimeEntry>, string>({
      query: (overtimeId) => ({
        url: `/v2/payroll/overtime/${overtimeId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Overtime", id },
        { type: "Overtime", id: "LIST" },
      ],
    }),

    rejectOvertime: builder.mutation<APIResponse<OvertimeEntry>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/v2/payroll/overtime/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Overtime", id },
        { type: "Overtime", id: "LIST" },
      ],
    }),

    overtimeCopilotChat: builder.mutation<APIResponse<{ reply: string; [key: string]: any }>, { message: string }>({
      query: (body) => ({
        url: "/v2/payroll/overtime/copilot",
        method: "POST",
        body,
      }),
    }),

    getOvertimeSettings: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/overtime/settings",
        method: "GET",
      }),
      providesTags: [{ type: "Overtime", id: "SETTINGS" }],
    }),

    updateOvertimeSettings: builder.mutation<APIResponse<Record<string, any>>, Record<string, any>>({
      query: (body) => ({
        url: "/v2/payroll/overtime/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Overtime", id: "SETTINGS" }],
    }),

    calculateOvertime: builder.mutation<APIResponse<Record<string, any>>, Record<string, any>>({
      query: (body) => ({
        url: "/v2/payroll/overtime/calculate",
        method: "POST",
        body,
      }),
    }),

    requestOvertime: builder.mutation<APIResponse<OvertimeEntry>, Partial<OvertimeEntry>>({
      query: (body) => ({
        url: "/v2/payroll/overtime/request",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Overtime", id: "LIST" }],
    }),

    getOvertimeHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/overtime/history",
        method: "GET",
      }),
      providesTags: [{ type: "Overtime", id: "HISTORY" }],
    }),

    getOvertimeAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/overtime/audit",
        method: "GET",
      }),
      providesTags: [{ type: "Overtime", id: "AUDIT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOvertimeEntriesQuery,
  useCreateOvertimeEntryMutation,
  useApproveOvertimeMutation,
  useRejectOvertimeMutation,
  useOvertimeCopilotChatMutation,
  useGetOvertimeSettingsQuery,
  useUpdateOvertimeSettingsMutation,
  useCalculateOvertimeMutation,
  useRequestOvertimeMutation,
  useGetOvertimeHistoryQuery,
  useGetOvertimeAuditQuery,
} = overtimeApi;
