import { baseApi } from "../baseApi";
import { Employee } from "@/types/hr";
import type { GetEmployeesQueryArg, GetEmployeesQueryParams } from "./employeeApiTypes";
import { normalizeEmployee } from "./normalizeEmployee";
import { buildEmployeeCreatePayload } from "./buildEmployeeCreatePayload";
import { buildEmployeeUpdatePayload } from "./buildEmployeeUpdatePayload";

export const employeeCrudApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], GetEmployeesQueryArg>({
      query: (params) => {
        const p = params as GetEmployeesQueryParams | undefined;
        const qp = new URLSearchParams();
        if (p?.department && p.department !== "ALL") qp.append("department", p.department);
        if (p?.status && p.status !== "ALL") qp.append("status", p.status);
        if (p?.role && p.role !== "ALL") qp.append("role", p.role);
        if (p?.search) qp.append("search", p.search);
        if (p?.page) qp.append("page", String(p.page));
        if (p?.limit) qp.append("limit", String(p.limit));
        const qs = qp.toString();
        return `/api/v1/employees${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any): Employee[] => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        const list = Array.isArray(payload) ? payload : payload?.items || payload?.employees || payload?.data || [];
        return list.map(normalizeEmployee);
      },
      providesTags: (result) => Array.isArray(result) ? [...result.map(({ id }) => ({ type: "Employee" as const, id })), { type: "Employee", id: "LIST" }] : [{ type: "Employee", id: "LIST" }],
    }),
    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/api/v1/employees/${id}`,
      transformResponse: (raw: any): Employee => normalizeEmployee(raw?.data !== undefined ? raw.data : raw),
      providesTags: (_r, _e, id) => [{ type: "Employee", id }],
    }),
    createEmployee: builder.mutation<Employee, Omit<Employee, "id"> | Partial<Employee>>({
      query: (body) => ({ url: "/api/v1/employees", method: "POST", body: buildEmployeeCreatePayload(body) }),
      transformResponse: (raw: any): Employee => normalizeEmployee(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: [{ type: "Employee", id: "LIST" }, "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    updateEmployee: builder.mutation<Employee, { id: string; changes: Partial<Employee> }>({
      query: ({ id, changes }) => ({ url: `/api/v1/employees/${id}`, method: "PATCH", body: buildEmployeeUpdatePayload(changes) }),
      transformResponse: (raw: any): Employee => normalizeEmployee(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }, "Timeline", "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    updateEmployeeFull: builder.mutation<Employee, { id: string; employee: Omit<Employee, "id"> }>({
      query: ({ id, employee }) => ({ url: `/api/v1/employees/${id}`, method: "PUT", body: employee }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }, "Timeline", "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    deleteEmployee: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}`, method: "DELETE" }),
      transformResponse: (raw: any, _m, arg) => raw?.data || (typeof raw === "object" && raw?.success !== undefined ? raw : { success: true, id: arg }),
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }, "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
  }),
});
export const { useGetEmployeesQuery, useGetEmployeeByIdQuery, useCreateEmployeeMutation, useUpdateEmployeeMutation, useUpdateEmployeeFullMutation, useDeleteEmployeeMutation } = employeeCrudApi;
