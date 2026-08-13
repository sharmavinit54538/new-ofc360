import { baseApi } from "@/services/api/baseApi";
import { APIResponse, PayCycle, PaginationQueryParams } from "./types";

export const payCyclesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayCycles: builder.query<APIResponse<PayCycle[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/cycles",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "PayCycle" as const, id })),
              { type: "PayCycle", id: "LIST" },
            ]
          : [{ type: "PayCycle", id: "LIST" }],
    }),

    getPayCycleLogs: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/cycles/logs",
        method: "GET",
      }),
      providesTags: [{ type: "PayCycle", id: "LOGS" }],
    }),

    getPayCycleHistory: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/cycles/history",
        method: "GET",
      }),
      providesTags: [{ type: "PayCycle", id: "HISTORY" }],
    }),

    getPayCycleById: builder.query<APIResponse<PayCycle>, string>({
      query: (cycleId) => ({
        url: `/v2/payroll/cycles/${cycleId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, cycleId) => [{ type: "PayCycle", id: cycleId }],
    }),

    createPayCycle: builder.mutation<APIResponse<PayCycle>, Partial<PayCycle>>({
      query: (body) => ({
        url: "/v2/payroll/cycles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PayCycle", id: "LIST" }],
    }),

    updatePayCycle: builder.mutation<APIResponse<PayCycle>, { id: string; data: Partial<PayCycle> }>({
      query: ({ id, data }) => ({
        url: `/v2/payroll/cycles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PayCycle", id },
        { type: "PayCycle", id: "LIST" },
      ],
    }),

    deletePayCycle: builder.mutation<APIResponse<void>, string>({
      query: (cycleId) => ({
        url: `/v2/payroll/cycles/${cycleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, cycleId) => [
        { type: "PayCycle", id: cycleId },
        { type: "PayCycle", id: "LIST" },
      ],
    }),

    activatePayCycle: builder.mutation<APIResponse<PayCycle>, string>({
      query: (cycleId) => ({
        url: `/v2/payroll/cycles/${cycleId}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, cycleId) => [
        { type: "PayCycle", id: cycleId },
        { type: "PayCycle", id: "LIST" },
      ],
    }),

    lockPayCycle: builder.mutation<APIResponse<PayCycle>, string>({
      query: (cycleId) => ({
        url: `/v2/payroll/cycles/${cycleId}/lock`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, cycleId) => [
        { type: "PayCycle", id: cycleId },
        { type: "PayCycle", id: "LIST" },
      ],
    }),

    unlockPayCycle: builder.mutation<APIResponse<PayCycle>, string>({
      query: (cycleId) => ({
        url: `/v2/payroll/cycles/${cycleId}/unlock`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, cycleId) => [
        { type: "PayCycle", id: cycleId },
        { type: "PayCycle", id: "LIST" },
      ],
    }),

    duplicatePayCycle: builder.mutation<APIResponse<PayCycle>, string>({
      query: (cycleId) => ({
        url: `/v2/payroll/cycles/${cycleId}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "PayCycle", id: "LIST" }],
    }),

    archivePayCycle: builder.mutation<APIResponse<PayCycle>, string>({
      query: (cycleId) => ({
        url: `/v2/payroll/cycles/${cycleId}/archive`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, cycleId) => [
        { type: "PayCycle", id: cycleId },
        { type: "PayCycle", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayCyclesQuery,
  useGetPayCycleLogsQuery,
  useGetPayCycleHistoryQuery,
  useGetPayCycleByIdQuery,
  useCreatePayCycleMutation,
  useUpdatePayCycleMutation,
  useDeletePayCycleMutation,
  useActivatePayCycleMutation,
  useLockPayCycleMutation,
  useUnlockPayCycleMutation,
  useDuplicatePayCycleMutation,
  useArchivePayCycleMutation,
} = payCyclesApi;
