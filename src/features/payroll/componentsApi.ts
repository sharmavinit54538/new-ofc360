import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryComponent, PaginationQueryParams } from "./types";

export const componentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalaryComponents: builder.query<APIResponse<SalaryComponent[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/components",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "SalaryComponent" as const, id })),
              { type: "SalaryComponent", id: "LIST" },
            ]
          : [{ type: "SalaryComponent", id: "LIST" }],
    }),

    getSalaryComponentsAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/components/audit",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryComponent", id: "AUDIT" }],
    }),

    getSalaryComponentsHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/components/history",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryComponent", id: "HISTORY" }],
    }),

    getSalaryComponentById: builder.query<APIResponse<SalaryComponent>, string>({
      query: (componentId) => ({
        url: `/v2/payroll/components/${componentId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, componentId) => [{ type: "SalaryComponent", id: componentId }],
    }),

    createSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, Partial<SalaryComponent>>({
      query: (body) => ({
        url: "/v2/payroll/components",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SalaryComponent", id: "LIST" }],
    }),

    updateSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, { id: string; data: Partial<SalaryComponent> }>({
      query: ({ id, data }) => ({
        url: `/v2/payroll/components/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SalaryComponent", id },
        { type: "SalaryComponent", id: "LIST" },
      ],
    }),

    deleteSalaryComponent: builder.mutation<APIResponse<void>, string>({
      query: (componentId) => ({
        url: `/v2/payroll/components/${componentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, componentId) => [
        { type: "SalaryComponent", id: componentId },
        { type: "SalaryComponent", id: "LIST" },
      ],
    }),

    duplicateSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, string>({
      query: (componentId) => ({
        url: `/v2/payroll/components/${componentId}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "SalaryComponent", id: "LIST" }],
    }),

    activateSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, string>({
      query: (componentId) => ({
        url: `/v2/payroll/components/${componentId}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, componentId) => [
        { type: "SalaryComponent", id: componentId },
        { type: "SalaryComponent", id: "LIST" },
      ],
    }),

    deactivateSalaryComponent: builder.mutation<APIResponse<SalaryComponent>, string>({
      query: (componentId) => ({
        url: `/v2/payroll/components/${componentId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, componentId) => [
        { type: "SalaryComponent", id: componentId },
        { type: "SalaryComponent", id: "LIST" },
      ],
    }),

    reorderSalaryComponents: builder.mutation<APIResponse<any>, string[]>({
      query: (orderedIds) => ({
        url: "/v2/payroll/components/reorder",
        method: "POST",
        body: orderedIds,
      }),
      invalidatesTags: [{ type: "SalaryComponent", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSalaryComponentsQuery,
  useGetSalaryComponentsAuditQuery,
  useGetSalaryComponentsHistoryQuery,
  useGetSalaryComponentByIdQuery,
  useCreateSalaryComponentMutation,
  useUpdateSalaryComponentMutation,
  useDeleteSalaryComponentMutation,
  useDuplicateSalaryComponentMutation,
  useActivateSalaryComponentMutation,
  useDeactivateSalaryComponentMutation,
  useReorderSalaryComponentsMutation,
} = componentsApi;