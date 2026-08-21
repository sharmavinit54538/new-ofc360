import { baseApi } from "../baseApi";
import type { EmployeeStats, EmployeeDashboardData, ImportResult } from "./employeeApiTypes";

export const employeeStatsAndExportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeStats: builder.query<EmployeeStats, void>({
      query: () => "/api/v1/employees/stats",
      transformResponse: (raw: any) => raw?.data || raw,
      providesTags: [{ type: "Employee", id: "STATS" }],
    }),
    getEmployeeDashboard: builder.query<EmployeeDashboardData, void>({
      query: () => "/api/v1/employees/dashboard",
      transformResponse: (raw: any) => raw?.data || raw,
      providesTags: [{ type: "Employee", id: "DASHBOARD" }],
    }),
    importEmployees: builder.mutation<ImportResult, FormData>({
      query: (formData) => ({ url: "/api/v1/employees/import", method: "POST", body: formData }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: [{ type: "Employee", id: "LIST" }, "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    exportEmployees: builder.query<Blob, { format: "xlsx" | "csv" | "pdf" }>({
      query: ({ format }) => ({ url: `/api/v1/employees/export?format=${format}`, responseHandler: (response) => response.blob() }),
    }),
  }),
});
export const { useGetEmployeeStatsQuery, useGetEmployeeDashboardQuery, useImportEmployeesMutation, useExportEmployeesQuery, useLazyExportEmployeesQuery } = employeeStatsAndExportApi;
