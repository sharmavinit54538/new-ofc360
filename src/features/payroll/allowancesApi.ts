import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Allowance, PaginationQueryParams } from "./types";

export const allowancesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllowances: builder.query<APIResponse<Allowance[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/allowances",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Allowance" as const, id })),
              { type: "Allowance", id: "LIST" },
            ]
          : [{ type: "Allowance", id: "LIST" }],
    }),

    getAllowancesAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/allowances/audit",
        method: "GET",
      }),
      providesTags: [{ type: "Allowance", id: "AUDIT" }],
    }),

    getAllowancesHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/allowances/history",
        method: "GET",
      }),
      providesTags: [{ type: "Allowance", id: "HISTORY" }],
    }),

    exportAllowances: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/allowances/export",
        method: "GET",
      }),
    }),

    getAllowanceById: builder.query<APIResponse<Allowance>, string>({
      query: (allowanceId) => ({
        url: `/v2/payroll/allowances/${allowanceId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, allowanceId) => [{ type: "Allowance", id: allowanceId }],
    }),

    createAllowance: builder.mutation<APIResponse<Allowance>, Partial<Allowance>>({
      query: (body) => ({
        url: "/v2/payroll/allowances",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Allowance", id: "LIST" }],
    }),

    updateAllowance: builder.mutation<APIResponse<Allowance>, { id: string; data: Partial<Allowance> }>({
      query: ({ id, data }) => ({
        url: `/v2/payroll/allowances/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Allowance", id },
        { type: "Allowance", id: "LIST" },
      ],
    }),

    deleteAllowance: builder.mutation<APIResponse<void>, string>({
      query: (allowanceId) => ({
        url: `/v2/payroll/allowances/${allowanceId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, allowanceId) => [
        { type: "Allowance", id: allowanceId },
        { type: "Allowance", id: "LIST" },
      ],
    }),

    duplicateAllowance: builder.mutation<APIResponse<Allowance>, string>({
      query: (allowanceId) => ({
        url: `/v2/payroll/allowances/${allowanceId}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Allowance", id: "LIST" }],
    }),

    activateAllowance: builder.mutation<APIResponse<Allowance>, string>({
      query: (allowanceId) => ({
        url: `/v2/payroll/allowances/${allowanceId}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, allowanceId) => [
        { type: "Allowance", id: allowanceId },
        { type: "Allowance", id: "LIST" },
      ],
    }),

    deactivateAllowance: builder.mutation<APIResponse<Allowance>, string>({
      query: (allowanceId) => ({
        url: `/v2/payroll/allowances/${allowanceId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, allowanceId) => [
        { type: "Allowance", id: allowanceId },
        { type: "Allowance", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllowancesQuery,
  useGetAllowancesAuditQuery,
  useGetAllowancesHistoryQuery,
  useExportAllowancesQuery,
  useGetAllowanceByIdQuery,
  useCreateAllowanceMutation,
  useUpdateAllowanceMutation,
  useDeleteAllowanceMutation,
  useDuplicateAllowanceMutation,
  useActivateAllowanceMutation,
  useDeactivateAllowanceMutation,
} = allowancesApi;
