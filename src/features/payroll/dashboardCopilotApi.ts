import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayrollDashboardData } from "./types";
const tag = "PayrollDashboard";
export const dashboardCopilotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollDashboard: builder.query<APIResponse<PayrollDashboardData>, void>({ query: () => "/v2/payroll/dashboard", providesTags: [{ type: tag, id: "DASHBOARD" }] }),
    payrollCopilotChat: builder.mutation<APIResponse<any>, { message: string; history?: any[] }>({ query: (body) => ({ url: "/v2/payroll/copilot/chat", method: "POST", body }), invalidatesTags: [{ type: tag, id: "COPILOT_HISTORY" }] }),
    getPayrollCopilotHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/copilot/history", providesTags: [{ type: tag, id: "COPILOT_HISTORY" }] }),
    clearPayrollCopilot: builder.mutation<APIResponse<void>, void>({ query: () => ({ url: "/v2/payroll/copilot/clear", method: "POST" }), invalidatesTags: [{ type: tag, id: "COPILOT_HISTORY" }] }),
  }),
});
export const { useGetPayrollDashboardQuery, usePayrollCopilotChatMutation, useGetPayrollCopilotHistoryQuery, useClearPayrollCopilotMutation } = dashboardCopilotApi;