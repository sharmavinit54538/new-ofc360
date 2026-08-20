import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayrollSettings } from "./types";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollSettings: builder.query<APIResponse<PayrollSettings>, void>({
      query: () => ({
        url: "/v2/payroll/settings",
        method: "GET",
      }),
      providesTags: [{ type: "PayrollSettings", id: "SETTINGS" }],
    }),

    updatePayrollSettings: builder.mutation<APIResponse<PayrollSettings>, Partial<PayrollSettings>>({
      query: (body) => ({
        url: "/v2/payroll/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "PayrollSettings", id: "SETTINGS" }],
    }),

    getPayrollSettingsHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/settings/history",
        method: "GET",
      }),
      providesTags: [{ type: "PayrollSettings", id: "HISTORY" }],
    }),

    getPayrollSettingsAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/settings/audit",
        method: "GET",
      }),
      providesTags: [{ type: "PayrollSettings", id: "AUDIT" }],
    }),

    exportPayrollSettings: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/settings/export",
        method: "GET",
      }),
    }),

    resetPayrollSettings: builder.mutation<APIResponse<PayrollSettings>, void>({
      query: () => ({
        url: "/v2/payroll/settings/reset",
        method: "POST",
      }),
      invalidatesTags: [{ type: "PayrollSettings", id: "SETTINGS" }],
    }),

    testPayrollSettings: builder.mutation<APIResponse<Record<string, any>>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/settings/test",
        method: "POST",
        body: body || {},
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayrollSettingsQuery,
  useUpdatePayrollSettingsMutation,
  useGetPayrollSettingsHistoryQuery,
  useGetPayrollSettingsAuditQuery,
  useExportPayrollSettingsQuery,
  useResetPayrollSettingsMutation,
  useTestPayrollSettingsMutation,
} = settingsApi;