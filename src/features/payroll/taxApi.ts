import { baseApi } from "@/services/api/baseApi";
import { APIResponse, TaxSetting, PaginationQueryParams } from "./types";

export const taxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTax: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/admin/tax",
        method: "GET",
      }),
      providesTags: [{ type: "Tax", id: "ADMIN_TAX" }],
    }),

    getTaxes: builder.query<APIResponse<TaxSetting[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/taxes",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Tax" as const, id })),
              { type: "Tax", id: "LIST" },
            ]
          : [{ type: "Tax", id: "LIST" }],
    }),

    getTaxById: builder.query<APIResponse<TaxSetting>, string>({
      query: (taxId) => ({
        url: `/v2/payroll/taxes/${taxId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, taxId) => [{ type: "Tax", id: taxId }],
    }),

    getTaxesAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/taxes/audit",
        method: "GET",
      }),
      providesTags: [{ type: "Tax", id: "AUDIT" }],
    }),

    getTaxesHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/taxes/history",
        method: "GET",
      }),
      providesTags: [{ type: "Tax", id: "HISTORY" }],
    }),

    exportTaxes: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/taxes/export",
        method: "GET",
      }),
    }),

    createTax: builder.mutation<APIResponse<TaxSetting>, Partial<TaxSetting>>({
      query: (body) => ({
        url: "/v2/payroll/taxes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }],
    }),

    updateTax: builder.mutation<APIResponse<TaxSetting>, { id: string; data: Partial<TaxSetting> }>({
      query: ({ id, data }) => ({
        url: `/v2/payroll/taxes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tax", id },
        { type: "Tax", id: "LIST" },
      ],
    }),

    deleteTax: builder.mutation<APIResponse<void>, string>({
      query: (taxId) => ({
        url: `/v2/payroll/taxes/${taxId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, taxId) => [
        { type: "Tax", id: taxId },
        { type: "Tax", id: "LIST" },
      ],
    }),

    importTaxes: builder.mutation<APIResponse<any>, Record<string, any>>({
      query: (body) => ({
        url: "/v2/payroll/taxes/import",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }],
    }),

    recalculateTaxes: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/taxes/recalculate",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }],
    }),

    activateTax: builder.mutation<APIResponse<TaxSetting>, string>({
      query: (taxId) => ({
        url: `/v2/payroll/taxes/${taxId}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, taxId) => [
        { type: "Tax", id: taxId },
        { type: "Tax", id: "LIST" },
      ],
    }),

    deactivateTax: builder.mutation<APIResponse<TaxSetting>, string>({
      query: (taxId) => ({
        url: `/v2/payroll/taxes/${taxId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, taxId) => [
        { type: "Tax", id: taxId },
        { type: "Tax", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminTaxQuery,
  useGetTaxesQuery,
  useGetTaxByIdQuery,
  useGetTaxesAuditQuery,
  useGetTaxesHistoryQuery,
  useExportTaxesQuery,
  useCreateTaxMutation,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
  useImportTaxesMutation,
  useRecalculateTaxesMutation,
  useActivateTaxMutation,
  useDeactivateTaxMutation,
} = taxApi;