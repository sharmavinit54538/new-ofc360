import { baseApi } from "./baseApi";
import { Department, DepartmentStats, Employee, Manager } from "@/types/hr";
import { RawEnvelope } from "./envelope";

export interface GetDepartmentsQueryParams {
  status?: string;
  location?: string;
  hiring?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type GetDepartmentsQueryArg = GetDepartmentsQueryParams | void;

export function normalizeDepartment(dept: any): Department {
  if (!dept || typeof dept !== "object") return dept;
  const rawId = dept.id || dept._id || dept.departmentId || dept.department_id || "";
  const id = typeof rawId === "string" ? rawId : String(rawId || "");
  const name = dept.department_name || dept.departmentName || dept.name || dept.title || "";
  const code = dept.department_code || dept.departmentCode || dept.code || (name ? name.slice(0, 4).toUpperCase() : "DEP");
  const head = dept.manager_name || dept.managerName || dept.head || dept.headOfDepartment || dept.head_of_department || "";
  const manager = dept.reporting_manager_name || dept.reportingManagerName || dept.reportingManager || dept.manager || head || "";
  const managerId = dept.manager_id || dept.managerId || dept.reporting_manager_id || "";
  const capacity = dept.employee_capacity !== undefined ? dept.employee_capacity : (dept.capacity !== undefined ? dept.capacity : null);
  const employeeCount = dept.employee_count !== undefined ? dept.employee_count : (dept.employeeCount !== undefined ? dept.employeeCount : 0);
  const status = typeof dept.status === "string"
    ? (dept.status.toUpperCase() === "ACTIVE" ? "Active" : dept.status.toUpperCase() === "INACTIVE" ? "Inactive" : dept.status)
    : "Active";
  const hiringStatus = dept.hiring_status || dept.hiringStatus || "Open";

  return {
    ...dept,
    id,
    _id: id,
    name,
    code,
    head,
    manager,
    managerId,
    location: dept.location || "Headquarters",
    employeeCount,
    capacity,
    openPositions: dept.openPositions ?? dept.open_positions ?? (capacity && employeeCount ? Math.max(0, capacity - employeeCount) : null),
    budget: dept.budget !== undefined && dept.budget !== null ? String(dept.budget) : "0",
    costCenter: dept.cost_center || dept.costCenter || "",
    status,
    hiringStatus,
    parentDepartment: dept.parent_department_name || dept.parentDepartment || "",
    extension: dept.extension_number || dept.extension || "",
    color: dept.color || "#0d9488",
    icon: dept.icon || "",
    description: dept.description || "",
    notes: dept.notes || "",
    createdAt: dept.created_at || dept.createdAt || new Date().toISOString(),
    updatedAt: dept.updated_at || dept.updatedAt || new Date().toISOString(),
  };
}

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], GetDepartmentsQueryArg>({
      query: (params) => {
        const p = params as GetDepartmentsQueryParams | undefined;
        const qp = new URLSearchParams();
        if (p?.status && p.status !== "all") qp.append("status", p.status);
        if (p?.location && p.location !== "all") qp.append("location", p.location);
        if (p?.hiring && p.hiring !== "all") qp.append("hiring", p.hiring);
        if (p?.search) qp.append("search", p.search);
        if (p?.page) qp.append("page", String(p.page));
        if (p?.limit) qp.append("limit", String(p.limit));
        const qs = qp.toString();
        return `/api/v1/departments${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any): Department[] => {
        if (!raw) return [];
        const payload = raw.data !== undefined ? raw.data : raw;
        let items: any[] = [];
        if (Array.isArray(payload)) {
          items = payload;
        } else if (payload && typeof payload === "object") {
          if (Array.isArray(payload.items)) items = payload.items;
          else if (Array.isArray(payload.departments)) items = payload.departments;
          else if (Array.isArray(payload.data)) items = payload.data;
        }
        return items.map(normalizeDepartment);
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Department" as const, id })),
              { type: "Department", id: "LIST" },
            ]
          : [{ type: "Department", id: "LIST" }],
    }),

    getDepartmentById: builder.query<Department, string>({
      query: (id) => `/api/v1/departments/${id}`,
      transformResponse: (raw: RawEnvelope<Department> | any) =>
        normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      providesTags: (_r, _e, id) => [{ type: "Department", id }],
    }),

    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (body) => {
        const name = body.name || (body as any).department_name || "";
        const code = body.code || (body as any).department_code || (name ? name.slice(0, 4).toUpperCase() : "DEP");
        const payload = {
          ...body,
          name,
          department_name: name,
          code,
          department_code: code,
          description: body.description || "",
          location: body.location || "Headquarters",
          employee_capacity: body.capacity !== undefined ? body.capacity : (body as any).employee_capacity,
          budget: body.budget !== undefined ? Number(body.budget) || 0 : 0,
          cost_center: body.costCenter || (body as any).cost_center || "",
          status: typeof body.status === "string" ? body.status.toUpperCase() : "ACTIVE",
          hiring_status: body.hiringStatus || (body as any).hiring_status || "Open",
        };
        return {
          url: "/api/v1/departments",
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (raw: RawEnvelope<Department> | any) =>
        normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: [{ type: "Department", id: "LIST" }],
    }),

    updateDepartment: builder.mutation<Department, { id: string; department: Partial<Department> }>({
      query: ({ id, department }) => {
        const name = department.name || (department as any).department_name || "";
        const code = department.code || (department as any).department_code || (name ? name.slice(0, 4).toUpperCase() : "DEP");
        const payload = {
          ...department,
          name,
          department_name: name,
          code,
          department_code: code,
          description: department.description || "",
          location: department.location || "Headquarters",
          employee_capacity: department.capacity !== undefined ? department.capacity : (department as any).employee_capacity,
          budget: department.budget !== undefined ? Number(department.budget) || 0 : 0,
          cost_center: department.costCenter || (department as any).cost_center || "",
          status: typeof department.status === "string" ? department.status.toUpperCase() : "ACTIVE",
          hiring_status: department.hiringStatus || (department as any).hiring_status || "Open",
        };
        return {
          url: `/api/v1/departments/${id}`,
          method: "PUT",
          body: payload,
        };
      },
      transformResponse: (raw: RawEnvelope<Department> | any) =>
        normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
      ],
    }),

    deleteDepartment: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/v1/departments/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { queryFulfilled }) => {
        console.log(`[deleteDepartment] Starting deletion for department ID: ${id}`);
        try {
          const result = await queryFulfilled;
          console.log(`[deleteDepartment] Successfully deleted department ${id}:`, result.data);
        } catch (error: any) {
          const errorData = error?.error?.data || error?.data || error?.error || error;
          console.error(`[deleteDepartment] Failed to delete department ${id}:`, errorData);
          if (errorData?.detail) {
            console.error(`[deleteDepartment] FastAPI validation / constraint details:`, errorData.detail);
          }
        }
      },
      transformResponse: (raw: any, _meta, arg) => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        if (payload && typeof payload === "object" && "success" in payload) {
          return payload;
        }
        return { success: true, id: arg };
      },
      invalidatesTags: (_r, _e, id) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
      ],
    }),

    assignDepartmentManager: builder.mutation<Department, { id: string; managerId: string }>({
      query: ({ id, managerId }) => ({
        url: `/api/v1/departments/${id}/assign-manager`,
        method: "POST",
        body: { managerId, manager_id: managerId },
      }),
      transformResponse: (raw: RawEnvelope<Department> | any) =>
        normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
        { type: "Manager", id: "LIST" },
      ],
    }),

    assignDepartmentEmployees: builder.mutation<Department, { id: string; employeeIds: string[] }>({
      query: ({ id, employeeIds }) => ({
        url: `/api/v1/departments/${id}/assign-employees`,
        method: "POST",
        body: { employeeIds, employee_ids: employeeIds },
      }),
      transformResponse: (raw: RawEnvelope<Department> | any) =>
        normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Department", id },
        "Employee",
      ],
    }),

    removeDepartmentManager: builder.mutation<Department, string>({
      query: (id) => ({
        url: `/api/v1/departments/${id}/remove-manager`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<Department> | any) =>
        normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, id) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
      ],
    }),

    removeDepartmentEmployee: builder.mutation<Department, { id: string; employeeId: string }>({
      query: ({ id, employeeId }) => ({
        url: `/api/v1/departments/${id}/remove-employee/${employeeId}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<Department> | any) =>
        normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Department", id },
        "Employee",
      ],
    }),

    getDepartmentEmployees: builder.query<Employee[], string>({
      query: (id) => `/api/v1/departments/${id}/employees`,
      transformResponse: (raw: any): Employee[] => {
        if (!raw) return [];
        const payload = raw.data !== undefined ? raw.data : raw;
        if (Array.isArray(payload)) return payload;
        if (payload && typeof payload === "object") {
          if (Array.isArray(payload.items)) return payload.items;
          else if (Array.isArray(payload.employees)) return payload.employees;
        }
        return [];
      },
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
  useGetDepartmentsQuery,
  useLazyGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useAssignDepartmentManagerMutation,
  useAssignDepartmentEmployeesMutation,
  useRemoveDepartmentManagerMutation,
  useRemoveDepartmentEmployeeMutation,
  useGetDepartmentEmployeesQuery,
  useGetDepartmentManagerQuery,
  useGetDepartmentStatsQuery,
} = departmentApi;
