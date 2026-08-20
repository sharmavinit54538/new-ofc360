import { baseApi } from "@/services/api/baseApi";
import { APIResponse, ComplianceRule } from "../types";
const tag = "Compliance";
export const complianceMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateCompliance: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/compliance/validate", method: "POST", body: body || {} }) }),
    generateComplianceChallan: builder.mutation<APIResponse<any>, any>({ query: (body) => ({ url: "/v2/payroll/compliance/challan", method: "POST", body }) }),
    createComplianceRule: builder.mutation<APIResponse<ComplianceRule>, Partial<ComplianceRule>>({ query: (body) => ({ url: "/v2/payroll/compliance", method: "POST", body }), invalidatesTags: [{ type: tag, id: "LIST" }] }),
  }),
});
export const { useValidateComplianceMutation, useGenerateComplianceChallanMutation, useCreateComplianceRuleMutation } = complianceMutationsApi;
