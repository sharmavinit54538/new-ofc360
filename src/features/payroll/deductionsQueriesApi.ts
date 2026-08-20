import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Deduction, PaginationQueryParams } from "./types";
export const deductionsQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeductions: builder.query<APIResponse<Deduction[]>, PaginationQueryParams | void>({ query: (p) => ({ url: "/v2/payroll/deductions", params: p || undefined }), providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "Deduction" as const, id })), { type: "Deduction", id: "LIST" }] : [{ type: "Deduction", id: "LIST" }] }),
    getDeductionById: builder.query<APIResponse<Deduction>, string>({ query: (id) => `/v2/payroll/deductions/${id}`, providesTags: (_, __, id) => [{ type: "Deduction", id }] }),
  }),
});
export const { useGetDeductionsQuery, useGetDeductionByIdQuery } = deductionsQueriesApi;
