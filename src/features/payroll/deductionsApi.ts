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

    getDeductionById: builder.query<APIResponse<Deduction>, string>({
      query: (id) => ({
        url: `/v2/payroll/deductions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Deduction", id }],
    }),

    createDeduction: builder.mutation<APIResponse<Deduction>, Partial<Deduction>>({
      query: (body) => ({
        url: "/v2/payroll/deductions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Deduction", id: "LIST" }],
    }),

    updateDeduction: builder.mutation<APIResponse<Deduction>, { id: string; data: Partial<Deduction> }>({
      query: ({ id, data }) => ({
        url: `/v2/payroll/deductions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Deduction", id },
        { type: "Deduction", id: "LIST" },
      ],
    }),

    deleteDeduction: builder.mutation<APIResponse<void>, string>({
      query: (id) => ({
        url: `/v2/payroll/deductions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Deduction", id },
        { type: "Deduction", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDeductionsQuery,
  useGetDeductionByIdQuery,
  useCreateDeductionMutation,
  useUpdateDeductionMutation,
  useDeleteDeductionMutation,
} = deductionsApi;

