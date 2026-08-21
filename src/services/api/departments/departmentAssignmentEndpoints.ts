import { baseApi } from "../baseApi";
import { Department, DepartmentStats, Employee, Manager } from "@/types/hr";
import { normalizeDepartment } from "./normalizeDepartment";

export const departmentAssignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    assignDepartmentManager: builder.mutation<Department, { id: string; managerId: string }>({
      query: ({ id, managerId }) => ({ url: `/api/v1/departments/${id}/assign-manager`, method: "POST", body: { managerId, manager_id: managerId } }),
      transformResponse: (raw: any) => normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Department", id }, { type: "Department", id: "LIST" }, { type: "Manager", id: "LIST" }],
    }),
    assignDepartmentEmployees: builder.mutation<Department, { id: string; employeeIds: string[] }>({
      query: ({ id, employeeIds }) => ({ url: `/api/v1/departments/${id}/assign-employees`, method: "POST", body: { employeeIds, employee_ids: employeeIds } }),
      transformResponse: (raw: any) => normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Department", id }, "Employee"],
    }),
    removeDepartmentManager: builder.mutation<Department, string>({
      query: (id) => ({ url: `/api/v1/departments/${id}/remove-manager`, method: "DELETE" }),
      transformResponse: (raw: any) => normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, id) => [{ type: "Department", id }, { type: "Department", id: "LIST" }],
    }),
    removeDepartmentEmployee: builder.mutation<Department, { id: string; employeeId: string }>({
      query: ({ id, employeeId }) => ({ url: `/api/v1/departments/${id}/remove-employee/${employeeId}`, method: "DELETE" }),
      transformResponse: (raw: any) => normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Department", id }, "Employee"],
    }),
    getDepartmentEmployees: builder.query<Employee[], string>({
      query: (id) => `/api/v1/departments/${id}/employees`,
      transformResponse: (raw: any): Employee[] => { const p = raw?.data !== undefined ? raw.data : raw; return Array.isArray(p) ? p : p?.items || p?.employees || []; },
      providesTags: (_r, _e, id) => [{ type: "Department", id: `EMPLOYEES-${id}` }],
    }),
    getDepartmentManager: builder.query<Manager, string>({
      query: (id) => `/api/v1/departments/${id}/manager`,
      transformResponse: (raw: any): Manager => (raw?.data !== undefined ? raw.data : raw),
      providesTags: (_r, _e, id) => [{ type: "Department", id: `MANAGER-${id}` }],
    }),
    getDepartmentStats: builder.query<DepartmentStats, string>({
      query: (id) => `/api/v1/departments/${id}/stats`,
      transformResponse: (raw: any): DepartmentStats => (raw?.data !== undefined ? raw.data : raw),
      providesTags: (_r, _e, id) => [{ type: "Department", id: `STATS-${id}` }],
    }),
  }),
});
export const {
  useAssignDepartmentManagerMutation, useAssignDepartmentEmployeesMutation,
  useRemoveDepartmentManagerMutation, useRemoveDepartmentEmployeeMutation,
  useGetDepartmentEmployeesQuery, useGetDepartmentManagerQuery, useGetDepartmentStatsQuery,
} = departmentAssignmentApi;
