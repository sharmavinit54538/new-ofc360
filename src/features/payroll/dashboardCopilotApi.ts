import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayrollDashboardData } from "./types";

export const dashboardCopilotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollDashboard: builder.query<APIResponse<PayrollDashboardData>, void>({
      query: () => ({
        url: "/v2/payroll/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "PayrollDashboard", id: "DASHBOARD" }],
    }),

    payrollCopilotChat: builder.mutation<APIResponse<{ reply: string; context?: any; [key: string]: any }>, { message: string; history?: any[] }>({
      query: (body) => ({
        url: "/v2/payroll/copilot/chat",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PayrollDashboard", id: "COPILOT_HISTORY" }],
    }),

    getPayrollCopilotHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/copilot/history",
        method: "GET",
      }),
      providesTags: [{ type: "PayrollDashboard", id: "COPILOT_HISTORY" }],
    }),

    clearPayrollCopilot: builder.mutation<APIResponse<void>, void>({
      query: () => ({
        url: "/v2/payroll/copilot/clear",
        method: "POST",
      }),
      invalidatesTags: [{ type: "PayrollDashboard", id: "COPILOT_HISTORY" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayrollDashboardQuery,
  usePayrollCopilotChatMutation,
  useGetPayrollCopilotHistoryQuery,
  useClearPayrollCopilotMutation,
} = dashboardCopilotApi;
