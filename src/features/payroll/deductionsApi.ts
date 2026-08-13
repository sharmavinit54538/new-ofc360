import { baseApi } from "@/services/api/baseApi";
import { APIResponse, Deduction, PaginationQueryParams } from "./types";

export const deductionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeductions: builder.query<APIResponse<Deduction[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/deductions",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Deduction" as const, id })),
              { type: "Deduction", id: "LIST" },
            ]
          : [{ type: "Deduction", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDeductionsQuery } = deductionsApi;
