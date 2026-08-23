import { api } from "@/api/client";
import { Employee } from "@/types/hr";

export interface Manager {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  teamSize: number;
  avatar?: string;
}

export interface ManagerDirectoryParams {
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const managersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getManagers: builder.query<Manager[], ManagerDirectoryParams | void>({
      query: (params) => {
        const p = params as ManagerDirectoryParams | undefined;
        const queryParams = new URLSearchParams();
        if (p?.department) queryParams.append("department", p.department);
        if (p?.search) queryParams.append("search", p.search);
        if (p?.page) queryParams.append("page", String(p.page));
        if (p?.limit) queryParams.append("limit", String(p.limit));
        const queryString = queryParams.toString();
        return `/api/v1/managers${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (raw: unknown): Manager[] => {
        if (!raw) return [];
        const payload = (raw as Record<string, unknown>).data !== undefined ? (raw as Record<string, unknown>).data : raw;
        let list: unknown[] = [];
        if (Array.isArray(payload)) list = payload;
        else if (payload && typeof payload === "object") {
          const p = payload as Record<string, unknown>;
          if (Array.isArray(p.items)) list = p.items;
          else if (Array.isArray(p.managers)) list = p.managers;
          else if (Array.isArray(p.data)) list = p.data;
        }
        return list.map((m: unknown) => {
          const mm = m as Record<string, unknown>;
          return {
            id: (mm.id as string) || (mm._id as string) || (mm.manager_id as string),
            name: (mm.name as string) || (mm.full_name as string) || `${(mm.first_name as string) || ""} ${(mm.last_name as string) || ""}`.trim(),
            email: (mm.email as string) || (mm.work_email as string),
            department: (mm.department as string) || (mm.department_name as string) || "General",
            designation: (mm.designation as string) || "Manager",
            teamSize: (mm.team_size as number) || (mm.teamSize as number) || ((mm.direct_reports as unknown[])?.length || 0),
            avatar: (mm.avatar as string) || (mm.photoUrl as string) || (mm.profile_photo_url as string),
          };
        });
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Manager" as const, id })),
              { type: "Manager", id: "LIST" },
            ]
          : [{ type: "Manager", id: "LIST" }],
    }),

    getManagerById: builder.query<Manager, string>({
      query: (id) => `/api/v1/managers/${id}`,
      transformResponse: (raw: unknown): Manager => {
        const payload = (raw as Record<string, unknown>).data !== undefined ? (raw as Record<string, unknown>).data : raw;
        const p = payload as Record<string, unknown>;
        return {
          id: (p.id as string) || (p._id as string),
          name: (p.name as string) || (p.full_name as string) || `${(p.first_name as string) || ""} ${(p.last_name as string) || ""}`.trim(),
          email: (p.email as string) || (p.work_email as string),
          department: (p.department as string) || (p.department_name as string) || "General",
          designation: (p.designation as string) || "Manager",
          teamSize: (p.team_size as number) || (p.teamSize as number) || ((p.direct_reports as unknown[])?.length || 0),
          avatar: (p.avatar as string) || (p.photoUrl as string) || (p.profile_photo_url as string),
        };
      },
      providesTags: (_result, _error, id) => [{ type: "Manager", id }],
    }),

    getManagerTeam: builder.query<Employee[], string>({
      query: (managerId) => `/api/v1/managers/${managerId}/team`,
      transformResponse: (raw: unknown): Employee[] => {
        if (!raw) return [];
        const payload = (raw as Record<string, unknown>).data !== undefined ? (raw as Record<string, unknown>).data : raw;
        let list: unknown[] = [];
        if (Array.isArray(payload)) list = payload;
        else {
          const p = payload as Record<string, unknown>;
          if (Array.isArray(p.employees)) list = p.employees;
          else if (Array.isArray(p.team)) list = p.team;
        }
        return list.map((e: unknown) => {
          const ee = e as Record<string, unknown>;
          return {
            id: (ee.id as string) || (ee._id as string) || (ee.employee_id as string),
            name: (ee.name as string) || (ee.full_name as string) || `${(ee.first_name as string) || ""} ${(ee.last_name as string) || ""}`.trim(),
            email: (ee.email as string) || (ee.work_email as string),
            department: (ee.department as string) || (ee.department_name as string) || "General",
            designation: (ee.designation as string) || "Employee",
            role: (ee.role as string) || "employee",
            status: (ee.status as string) || "Active",
          };
        });
      },
      providesTags: (_result, _error, managerId) => [{ type: "Manager", id: `TEAM-${managerId}` }],
    }),

    getDirectReports: builder.query<Employee[], string>({
      query: (managerId) => `/api/v1/managers/${managerId}/direct-reports`,
      transformResponse: (raw: unknown): Employee[] => {
        if (!raw) return [];
        const payload = (raw as Record<string, unknown>).data !== undefined ? (raw as Record<string, unknown>).data : raw;
        let list: unknown[] = [];
        if (Array.isArray(payload)) list = payload;
        else {
          const p = payload as Record<string, unknown>;
          if (Array.isArray(p.employees)) list = p.employees;
          else if (Array.isArray(p.reports)) list = p.reports;
        }
        return list.map((e: unknown) => {
          const ee = e as Record<string, unknown>;
          return {
            id: (ee.id as string) || (ee._id as string) || (ee.employee_id as string),
            name: (ee.name as string) || (ee.full_name as string) || `${(ee.first_name as string) || ""} ${(ee.last_name as string) || ""}`.trim(),
            email: (ee.email as string) || (ee.work_email as string),
            department: (ee.department as string) || (ee.department_name as string) || "General",
            designation: (ee.designation as string) || "Employee",
            role: (ee.role as string) || "employee",
            status: (ee.status as string) || "Active",
          };
        });
      },
      providesTags: (_result, _error, managerId) => [{ type: "Manager", id: `REPORTS-${managerId}` }],
    }),

    getManagerAnalytics: builder.query<Record<string, unknown>, string>({
      query: (managerId) => `/api/v1/managers/${managerId}/analytics`,
      providesTags: (_result, _error, managerId) => [{ type: "Manager", id: `ANALYTICS-${managerId}` }],
    }),

    assignManager: builder.mutation<Employee, { employeeId: string; managerId: string }>({
      query: ({ employeeId, managerId }) => ({
        url: `/api/v1/employees/${employeeId}/manager`,
        method: "PUT",
        body: { manager_id: managerId },
      }),
      invalidatesTags: ["Employee", "Manager"],
    }),

    removeManager: builder.mutation<Employee, string>({
      query: (employeeId) => ({
        url: `/api/v1/employees/${employeeId}/manager`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee", "Manager"],
    }),
  }),
});

export const {
  useGetManagersQuery,
  useGetManagerByIdQuery,
  useGetManagerTeamQuery,
  useGetDirectReportsQuery,
  useGetManagerAnalyticsQuery,
  useAssignManagerMutation,
  useRemoveManagerMutation,
} = managersApi;

export type {
  Manager,
  ManagerDirectoryParams,
};