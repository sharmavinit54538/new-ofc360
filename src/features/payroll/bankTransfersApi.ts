import { baseApi } from "@/services/api/baseApi";
import { APIResponse, BankTransfer, PaginationQueryParams } from "./types";

export const bankTransfersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBankTransfers: builder.query<APIResponse<BankTransfer[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/bank-transfers",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "BankTransfer" as const, id })),
              { type: "BankTransfer", id: "LIST" },
            ]
          : [{ type: "BankTransfer", id: "LIST" }],
    }),

    getBankTransfersDashboard: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/bank-transfers/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "BankTransfer", id: "DASHBOARD" }],
    }),

    getBankTransfersAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/bank-transfers/audit",
        method: "GET",
      }),
      providesTags: [{ type: "BankTransfer", id: "AUDIT" }],
    }),

    getBankTransferById: builder.query<APIResponse<BankTransfer>, string>({
      query: (transferId) => ({
        url: `/v2/payroll/bank-transfers/${transferId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, transferId) => [{ type: "BankTransfer", id: transferId }],
    }),

    batchBankTransfers: builder.mutation<APIResponse<any>, Record<string, any>>({
      query: (body) => ({
        url: "/v2/payroll/bank-transfers/batch",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "BankTransfer", id: "LIST" }],
    }),

    generateBankTransferFile: builder.mutation<APIResponse<{ file_url: string; [key: string]: any }>, Record<string, any>>({
      query: (body) => ({
        url: "/v2/payroll/bank-transfers/generate-file",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "BankTransfer", id: "LIST" }],
    }),

    initiateBankTransfer: builder.mutation<APIResponse<BankTransfer>, Record<string, any>>({
      query: (body) => ({
        url: "/v2/payroll/bank-transfers/initiate",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "BankTransfer", id: "LIST" }],
    }),

    reconcileBankTransfers: builder.mutation<APIResponse<any>, Record<string, any>>({
      query: (body) => ({
        url: "/v2/payroll/bank-transfers/reconcile",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "BankTransfer", id: "LIST" }],
    }),

    retryBankTransfer: builder.mutation<APIResponse<BankTransfer>, string>({
      query: (transferId) => ({
        url: `/v2/payroll/bank-transfers/${transferId}/retry`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, transferId) => [
        { type: "BankTransfer", id: transferId },
        { type: "BankTransfer", id: "LIST" },
      ],
    }),

    markBankTransferPaid: builder.mutation<APIResponse<BankTransfer>, string>({
      query: (transferId) => ({
        url: `/v2/payroll/bank-transfers/${transferId}/mark-paid`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, transferId) => [
        { type: "BankTransfer", id: transferId },
        { type: "BankTransfer", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBankTransfersQuery,
  useGetBankTransfersDashboardQuery,
  useGetBankTransfersAuditQuery,
  useGetBankTransferByIdQuery,
  useBatchBankTransfersMutation,
  useGenerateBankTransferFileMutation,
  useInitiateBankTransferMutation,
  useReconcileBankTransfersMutation,
  useRetryBankTransferMutation,
  useMarkBankTransferPaidMutation,
} = bankTransfersApi;
