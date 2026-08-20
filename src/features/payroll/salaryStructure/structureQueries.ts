import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryStructure, PaginationQueryParams } from "../types";
export const structureQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeSalaryStructure: builder.query<APIResponse<SalaryStructure>, string>({ query: (empId) => `/v2/payroll/employees/${empId}/salary-structure`, providesTags: (_, __, empId) => [{ type: "SalaryStructure", id: `EMP_${empId}` }] }),
    getSalaryStructures: builder.query<APIResponse<SalaryStructure[]>, PaginationQueryParams | void>({
      query: (p) => ({ url: "/v2/payroll/salary-structures", params: p || undefined }),
      providesTags: (r) => r?.data ? [...r.data.map(({ id }) => ({ type: "SalaryStructure" as const, id })), { type: "SalaryStructure", id: "LIST" }] : [{ type: "SalaryStructure", id: "LIST" }],
    }),
    getSalaryStructuresAudit: builder.query<APIResponse<any[]>, void>({ query: () => "/v2/payroll/salary-structures/audit", providesTags: [{ type: "SalaryStructure", id: "AUDIT" }] }),
    getSalaryStructuresAiInsights: builder.query<APIResponse<any>, void>({ query: () => "/v2/payroll/salary-structures/ai-insights", providesTags: [{ type: "SalaryStructure", id: "AI_INSIGHTS" }] }),
    getSalaryStructureById: builder.query<APIResponse<SalaryStructure>, string>({ query: (id) => `/v2/payroll/salary-structures/${id}`, providesTags: (_, __, id) => [{ type: "SalaryStructure", id }] }),
  }),
});
export const { useGetEmployeeSalaryStructureQuery, useGetSalaryStructuresQuery, useGetSalaryStructuresAuditQuery, useGetSalaryStructuresAiInsightsQuery, useGetSalaryStructureByIdQuery } = structureQueriesApi;
