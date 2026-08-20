import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayrollSettings } from "./types";
const tag = "PayrollSettings";
export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollSettings: builder.query<APIResponse<PayrollSettings>, void>({ query: () => "/v2/payroll/settings", providesTags: [{ type: tag, id: "SETTINGS" }] }),
    updatePayrollSettings: builder.mutation<APIResponse<PayrollSettings>, Partial<PayrollSettings>>({ query: (body) => ({ url: "/v2/payroll/settings", method: "PUT", body }), invalidatesTags: [{ type: tag, id: "SETTINGS" }] }),
    getPayrollSettingsHistory: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/settings/history", providesTags: [{ type: tag, id: "HISTORY" }] }),
    getPayrollSettingsAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/settings/audit", providesTags: [{ type: tag, id: "AUDIT" }] }),
    exportPayrollSettings: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/settings/export" }),
    resetPayrollSettings: builder.mutation<APIResponse<PayrollSettings>, void>({ query: () => ({ url: "/v2/payroll/settings/reset", method: "POST" }), invalidatesTags: [{ type: tag, id: "SETTINGS" }] }),
    testPayrollSettings: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/settings/test", method: "POST", body: body || {} }) }),
  }),
});
export const { useGetPayrollSettingsQuery, useUpdatePayrollSettingsMutation, useGetPayrollSettingsHistoryQuery, useGetPayrollSettingsAuditQuery, useExportPayrollSettingsQuery, useResetPayrollSettingsMutation, useTestPayrollSettingsMutation } = settingsApi;