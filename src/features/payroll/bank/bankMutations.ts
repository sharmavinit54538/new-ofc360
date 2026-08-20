import { baseApi } from "@/services/api/baseApi";
import { APIResponse, BankTransfer } from "../types";
const tag = "BankTransfer";
export const bankMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    batchBankTransfers: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/bank-transfers/batch", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    generateBankTransferFile: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/bank-transfers/generate-file", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    initiateBankTransfer: builder.mutation<APIResponse<BankTransfer>, any>({ query: (body) => ({ url: "/v2/payroll/bank-transfers/initiate", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    reconcileBankTransfers: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/bank-transfers/reconcile", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
    retryBankTransfer: builder.mutation<APIResponse<BankTransfer>, string>({ query: (id) => ({ url: `/v2/payroll/bank-transfers/${id}/retry`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
    markBankTransferPaid: builder.mutation<APIResponse<BankTransfer>, string>({ query: (id) => ({ url: `/v2/payroll/bank-transfers/${id}/mark-paid`, method: "POST" }), invalidatesTags: (_, __, id) => [{ type: tag, id }, { type: tag, id: "LIST" }] }),
  }),
});
export const { useBatchBankTransfersMutation, useGenerateBankTransferFileMutation, useInitiateBankTransferMutation, useReconcileBankTransfersMutation, useRetryBankTransferMutation, useMarkBankTransferPaidMutation } = bankMutationsApi;
