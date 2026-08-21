import { baseApi } from "../baseApi";
import { Department } from "@/types/hr";
import type { GetDepartmentsQueryArg, GetDepartmentsQueryParams } from "./departmentApiTypes";
import { normalizeDepartment } from "./normalizeDepartment";

export const departmentCrudApi = baseApi.injectEndpoints({
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
        const payload = raw?.data !== undefined ? raw.data : raw;
        const items = Array.isArray(payload) ? payload : payload?.items || payload?.departments || payload?.data || [];
        return items.map(normalizeDepartment);
      },
      providesTags: (result) => Array.isArray(result) ? [...result.map(({ id }) => ({ type: "Department" as const, id })), { type: "Department", id: "LIST" }] : [{ type: "Department", id: "LIST" }],
    }),
    getDepartmentById: builder.query<Department, string>({
      query: (id) => `/api/v1/departments/${id}`,
      transformResponse: (raw: any) => normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      providesTags: (_r, _e, id) => [{ type: "Department", id }],
    }),
    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (body) => ({ url: "/api/v1/departments", method: "POST", body }),
      transformResponse: (raw: any) => normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: [{ type: "Department", id: "LIST" }],
    }),
    updateDepartment: builder.mutation<Department, { id: string; department: Partial<Department> }>({
      query: ({ id, department }) => ({ url: `/api/v1/departments/${id}`, method: "PUT", body: department }),
      transformResponse: (raw: any) => normalizeDepartment(raw?.data !== undefined ? raw.data : raw),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Department", id }, { type: "Department", id: "LIST" }],
    }),
    deleteDepartment: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({ url: `/api/v1/departments/${id}`, method: "DELETE" }),
      transformResponse: (raw: any, _m, arg) => (raw?.data && "success" in raw.data ? raw.data : { success: true, id: arg }),
      invalidatesTags: (_res, err, id) => err ? [] : [{ type: "Department", id }, { type: "Department", id: "LIST" }],
    }),
  }),
});
export const { useGetDepartmentsQuery, useLazyGetDepartmentsQuery, useGetDepartmentByIdQuery, useCreateDepartmentMutation, useUpdateDepartmentMutation, useDeleteDepartmentMutation } = departmentCrudApi;
