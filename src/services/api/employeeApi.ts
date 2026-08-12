import { baseApi } from "./baseApi";
import { Employee } from "@/types/hr";
import { RawEnvelope } from "./envelope";

export interface GetEmployeesQueryParams {
  department?: string;
  status?: string;
  search?: string;
}

export type GetEmployeesQueryArg = GetEmployeesQueryParams | void;

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  probationEmployees: number;
  departmentCounts?: Record<string, number>;
}

export interface EmployeeDashboardData {
  totalCount: number;
  activeCount: number;
  newHiresThisMonth: number;
  turnoverRate: number;
  departmentDistribution: Array<{ department: string; count: number }>;
  recentActivities?: Array<{ id: string; type: string; description: string; timestamp: string }>;
}

export interface ImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors?: Array<{ row: number; error: string }>;
}

export interface OnboardingStatus {
  employeeId: string;
  status: "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | string;
  completedSteps: number;
  totalSteps: number;
  steps?: Array<{ id: string; name: string; isCompleted: boolean }>;
}

export const employeeApi = baseApi.injectEndpoints({
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
        if (p?.search) {
          queryParams.append("search", p.search);
        }
        const queryString = queryParams.toString();
        return `/api/v1/employees${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (raw: any): Employee[] => {
        if (!raw) return [];
        const payload = raw.data !== undefined ? raw.data : raw;
        if (Array.isArray(payload)) {
          return payload;
        }
        if (payload && typeof payload === "object") {
          if (Array.isArray(payload.items)) return payload.items;
          if (Array.isArray(payload.employees)) return payload.employees;
          if (Array.isArray(payload.data)) return payload.data;
        }
        return [];
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
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation<Employee, Omit<Employee, "id"> | Partial<Employee>>({
      query: (body) => {
        const b = body as any;
        const firstName = b.firstName || b.first_name || (b.name ? b.name.split(" ")[0] : "");
        const lastName = b.lastName || b.last_name || (b.name ? b.name.split(" ").slice(1).join(" ") : "");
        const name = b.name || `${firstName} ${lastName}`.trim();
        const email = b.companyWorkEmail || b.email || b.personalEmail || b.work_email || b.personal_email || "";
        const payload = {
          ...b,
          name,
          full_name: name,
          firstName,
          first_name: firstName,
          lastName,
          last_name: lastName,
          email,
          work_email: b.companyWorkEmail || email,
          personal_email: b.personalEmail || email,
          phone: b.phone || b.phone_number || "",
          phone_number: b.phone || b.phone_number || "",
          designation: b.designation || b.role || "",
          role: b.role || b.designation || "employee",
          department: b.department || "General",
          department_name: b.department || "General",
          system_role: b.systemRole || b.system_role || "employee",
          systemRole: b.systemRole || b.system_role || "employee",
          joining_date: b.joiningDate || b.joinedAt || b.joining_date || new Date().toISOString().split("T")[0],
          salary: b.salary || b.ctc || 0,
          ctc: b.ctc || b.salary || 0,
          status: typeof b.status === "string" ? b.status : "Active",
          employment_type: b.employmentType || b.employment_type || "FULL_TIME",
        };
        return {
          url: "/api/v1/employees",
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    updateEmployee: builder.mutation<Employee, { id: string; changes: Partial<Employee> }>({
      query: ({ id, changes }) => {
        const b = changes as any;
        const firstName = b.firstName || b.first_name || (b.name ? b.name.split(" ")[0] : undefined);
        const lastName = b.lastName || b.last_name || (b.name ? b.name.split(" ").slice(1).join(" ") : undefined);
        const name = b.name || (firstName && lastName ? `${firstName} ${lastName}`.trim() : undefined);
        const payload = {
          ...b,
          ...(name ? { name, full_name: name } : {}),
          ...(firstName ? { firstName, first_name: firstName } : {}),
          ...(lastName ? { lastName, last_name: lastName } : {}),
          ...(b.companyWorkEmail || b.personalEmail || b.email
            ? { email: b.companyWorkEmail || b.email || b.personalEmail, work_email: b.companyWorkEmail || b.email, personal_email: b.personalEmail || b.email }
            : {}),
          ...(b.phone ? { phone: b.phone, phone_number: b.phone } : {}),
          ...(b.designation || b.role ? { designation: b.designation || b.role, role: b.role || b.designation } : {}),
          ...(b.department ? { department: b.department, department_name: b.department } : {}),
          ...(b.systemRole ? { systemRole: b.systemRole, system_role: b.systemRole } : {}),
        };
        return {
          url: `/api/v1/employees/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "Timeline",
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
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
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
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
    }),

    activateEmployeeByAdmin: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/activate-by-admin`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
    }),

    activateEmployee: builder.mutation<Employee, { id: string; token?: string }>({
      query: ({ id, token }) => ({
        url: `/api/v1/employees/${id}/activate`,
        method: "POST",
        body: { token },
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
    }),

    approveOnboarding: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/approve`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
    }),

    rejectOnboarding: builder.mutation<Employee, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/api/v1/employees/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
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
} = employeeApi;
