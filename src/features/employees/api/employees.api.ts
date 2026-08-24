// eslint-disable-file -- ESLint parser bug with complex RTK Query endpoint definitions
import { api } from "@/api/client";
import { Employee } from "@/types/hr";
import { RawEnvelope } from "@/services/api/envelope";
import {
  GetEmployeesQueryParams,
  GetEmployeesQueryArg,
  EmployeeStats,
  EmployeeDashboardData,
  ImportResult,
  OnboardingStatus,
  ActivateEmployeePayload,
  ActivateEmployeeResponse,
  EmployeeCreateInput,
} from "./employeesApiTypes";
import {
  buildEmployeeCreatePayload,
  buildEmployeeUpdatePayload,
  normalizeEmployee,
} from "./employeesApiTransformers";

export const employeesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], GetEmployeesQueryArg>({
      query: (params) => {
        const p = params as GetEmployeesQueryParams | undefined;
        const queryParams = new URLSearchParams();
        if (p?.department && p.department !== "ALL") {
          queryParams.append("department", p.department);
        }
        if (p?.status && p.status !== "ALL") {
          queryParams.append("status", p.status);
        }
        if (p?.role && p.role !== "ALL") {
          queryParams.append("role", p.role);
        }
        if (p?.search) {
          queryParams.append("search", p.search);
        }
        if (p?.page) {
          queryParams.append("page", String(p.page));
        }
        if (p?.limit) {
          queryParams.append("limit", String(p.limit));
        }
        if (p?.sort) {
          queryParams.append("sort", p.sort);
        }
        if (p?.order) {
          queryParams.append("order", p.order);
        }
        const queryString = queryParams.toString();
        return `/api/v1/employees${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (raw: any): Employee[] => {
        if (!raw) return [];
        const payload = raw.data !== undefined ? raw.data : raw;
        let list: any[] = [];
        if (Array.isArray(payload)) {
          list = payload;
        } else if (payload && typeof payload === "object") {
          if (Array.isArray(payload.items)) list = payload.items;
          else if (Array.isArray(payload.employees)) list = payload.employees;
          else if (Array.isArray(payload.data)) list = payload.data;
          else if (Array.isArray(payload.results)) list = payload.results;
        }
        return list.map(normalizeEmployee);
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),

    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/api/v1/employees/${id}`,
      transformResponse: (raw: any): Employee => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeEmployee(payload);
      },
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation<Employee, Omit<Employee, "id"> | Partial<Employee>>({
      query: (body) => {
        const payload = buildEmployeeCreatePayload(body);
        console.log("[createEmployee] Outgoing HTTP POST /api/v1/employees Body:", payload);
        return {
          url: "/api/v1/employees",
          method: "POST",
          body: payload,
        };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        console.log("[createEmployee] Mutation started with input arg:", arg);
        try {
          const result = await queryFulfilled;
          console.log("[createEmployee] Employee created successfully:", result.data);
        } catch (error: any) {
          const errorData = error?.error?.data || error?.data || error?.error || error;
          console.error("[createEmployee] FULL RAW ERROR DATA:", errorData);
          if (errorData?.detail) {
            console.error("[createEmployee] FastAPI/Pydantic validation details:", errorData.detail);
          }
        }
      },
      transformResponse: (raw: any): Employee => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeEmployee(payload);
      },
      invalidatesTags: [
        { type: "Employee", id: "LIST" },
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    updateEmployee: builder.mutation<Employee, { id: string; changes: Partial<Employee> }>({
      query: ({ id, changes }) => {
        const payload = buildEmployeeUpdatePayload(changes);
        console.log(`[updateEmployee] Outgoing HTTP PATCH /api/v1/employees/${id} Body:`, payload);
        return {
          url: `/api/v1/employees/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
      onQueryStarted: async ({ id, changes }, { queryFulfilled }) => {
        console.log(`[updateEmployee] Mutation started for ${id}:`, changes);
        try {
          const result = await queryFulfilled;
          console.log(`[updateEmployee] Success response for ${id}:`, result.data);
        } catch (error: any) {
          const errorData = error?.error?.data || error?.data || error?.error || error;
          console.error(`[updateEmployee] Error for ${id} - Full Raw Error Data:`, errorData);
          if (errorData?.detail) {
            console.error(`[updateEmployee] FastAPI/Pydantic validation details for ${id}:`, errorData.detail);
          }
        }
      },
      transformResponse: (raw: any): Employee => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeEmployee(payload);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "Timeline",
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    updateEmployeeFull: builder.mutation<Employee, { id: string; employee: Omit<Employee, "id"> }>({
      query: ({ id, employee }) => ({
        url: `/api/v1/employees/${id}`,
        method: "PUT",
        body: employee,
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "Timeline",
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    deleteEmployee: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; id: string }> | { success: boolean; id: string }, _meta, arg) =>
        (raw as RawEnvelope<{ success: boolean; id: string }>)?.data || (raw as { success: boolean; id: string }) || { success: true, id: arg },
      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    getEmployeeStats: builder.query<EmployeeStats, void>({
      query: () => "/api/v1/employees/stats",
      transformResponse: (raw: RawEnvelope<EmployeeStats> | EmployeeStats) =>
        (raw as RawEnvelope<EmployeeStats>)?.data || (raw as EmployeeStats),
      providesTags: [{ type: "Employee", id: "STATS" }],
    }),

    getEmployeeDashboard: builder.query<EmployeeDashboardData, void>({
      query: () => "/api/v1/employees/dashboard",
      transformResponse: (raw: RawEnvelope<EmployeeDashboardData> | EmployeeDashboardData) =>
        (raw as RawEnvelope<EmployeeDashboardData>)?.data || (raw as EmployeeDashboardData),
      providesTags: [{ type: "Employee", id: "DASHBOARD" }],
    }),

    importEmployees: builder.mutation<ImportResult, FormData>({
      query: (formData) => ({
        url: "/api/v1/employees/import",
        method: "POST",
        body: formData,
      }),
      transformResponse: (raw: RawEnvelope<ImportResult> | ImportResult) =>
        (raw as RawEnvelope<ImportResult>)?.data || (raw as ImportResult),
      invalidatesTags: [
        { type: "Employee", id: "LIST" },
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    exportEmployees: builder.query<Blob, { format: "xlsx" | "csv" | "pdf" }>({
      query: ({ format }) => ({
        url: `/api/v1/employees/export?format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    sendInvitation: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/send-invitation`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; message?: string }> | { success: boolean; message?: string }) =>
        (raw as RawEnvelope<{ success: boolean; message?: string }>)?.data || (raw as { success: boolean; message?: string }) || { success: true },
    }),

    sendInvite: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/send-invite`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; message?: string }> | { success: boolean; message?: string }) =>
        (raw as RawEnvelope<{ success: boolean; message?: string }>)?.data || (raw as { success: boolean; message?: string }) || { success: true },
    }),

    deactivateEmployee: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/deactivate`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    activateEmployeeByAdmin: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/activate-by-admin`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    activateEmployee: builder.mutation<
      ActivateEmployeeResponse,
      ActivateEmployeePayload
    >({
      query: ({ id, employee_id, token, new_password, confirm_password }) => {
        const empId = id || employee_id;
        if (!empId || empId === "me") {
          throw new Error("Employee UUID is required for password activation.");
        }
        return {
          url: `/api/v1/employees/${empId}/activate`,
          method: "POST",
          body: {
            token,
            new_password,
            confirm_password,
          },
        };
      },
      transformResponse: (raw: RawEnvelope<ActivateEmployeeResponse> | ActivateEmployeeResponse) =>
        (raw as RawEnvelope<ActivateEmployeeResponse>)?.data || (raw as ActivateEmployeeResponse),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Employee", id: arg.id || arg.employee_id },
        { type: "Employee", id: "LIST" },
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    approveOnboarding: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/approve`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    rejectOnboarding: builder.mutation<Employee, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/api/v1/employees/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "SuperAdminOrganizations",
        "SuperAdminDashboard",
      ],
    }),

    resetEmployeePassword: builder.mutation<{ temporaryPassword?: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/reset-password`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<{ temporaryPassword?: string }> | { temporaryPassword?: string }) =>
        (raw as RawEnvelope<{ temporaryPassword?: string }>)?.data || (raw as { temporaryPassword?: string }),
    }),

    getOnboardingStatus: builder.query<OnboardingStatus, string>({
      query: (id) => `/api/v1/employees/${id}/onboarding-status`,
      transformResponse: (raw: RawEnvelope<OnboardingStatus> | OnboardingStatus) =>
        (raw as RawEnvelope<OnboardingStatus>)?.data || (raw as OnboardingStatus),
      providesTags: (_r, _e, id) => [{ type: "Employee", id: `ONBOARDING-${id}` }],
    }),

    validateEmployeeInvitation: builder.query<{
      valid?: boolean;
      employee_id?: string;
      employeeId?: string;
      id?: string;
      email?: string;
      name?: string;
      full_name?: string;
      company_name?: string;
      [key: string]: any;
    }, string>({
      query: (token) => ({
        url: "/api/v1/onboarding/validate",
        params: { token },
      }),
      transformResponse: (raw: any) => raw?.data || raw,
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeeFullMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeStatsQuery,
  useGetEmployeeDashboardQuery,
  useImportEmployeesMutation,
  useExportEmployeesQuery,
  useLazyExportEmployeesQuery,
  useSendInvitationMutation,
  useSendInviteMutation,
  useDeactivateEmployeeMutation,
  useActivateEmployeeByAdminMutation,
  useActivateEmployeeMutation,
  useApproveOnboardingMutation,
  useRejectOnboardingMutation,
  useResetEmployeePasswordMutation,
  useGetOnboardingStatusQuery,
  useValidateEmployeeInvitationQuery,
  useLazyValidateEmployeeInvitationQuery,
} = employeesApi;

export type {
  GetEmployeesQueryParams,
  GetEmployeesQueryArg,
  EmployeeStats,
  EmployeeDashboardData,
  ImportResult,
  OnboardingStatus,
  ActivateEmployeePayload,
  ActivateEmployeeResponse,
  EmployeeCreateInput,
};