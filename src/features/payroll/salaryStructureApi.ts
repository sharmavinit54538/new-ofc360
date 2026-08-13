import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryStructure, PaginationQueryParams } from "./types";

export const salaryStructureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeSalaryStructure: builder.query<APIResponse<SalaryStructure>, string>({
      query: (employeeId) => ({
        url: `/v2/payroll/employees/${employeeId}/salary-structure`,
        method: "GET",
      }),
      providesTags: (_result, _error, employeeId) => [{ type: "SalaryStructure", id: `EMP_${employeeId}` }],
    }),

    getSalaryStructures: builder.query<APIResponse<SalaryStructure[]>, PaginationQueryParams | void>({
      query: (params) => ({
        url: "/v2/payroll/salary-structures",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "SalaryStructure" as const, id })),
              { type: "SalaryStructure", id: "LIST" },
            ]
          : [{ type: "SalaryStructure", id: "LIST" }],
    }),

    getSalaryStructuresAudit: builder.query<APIResponse<any[]>, void>({
      query: () => ({
        url: "/v2/payroll/salary-structures/audit",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryStructure", id: "AUDIT" }],
    }),

    getSalaryStructuresAiInsights: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/salary-structures/ai-insights",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryStructure", id: "AI_INSIGHTS" }],
    }),

    getSalaryStructureById: builder.query<APIResponse<SalaryStructure>, string>({
      query: (structureId) => ({
        url: `/v2/payroll/salary-structures/${structureId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, structureId) => [{ type: "SalaryStructure", id: structureId }],
    }),

    createSalaryStructure: builder.mutation<APIResponse<SalaryStructure>, Partial<SalaryStructure>>({
      query: (body) => ({
        url: "/v2/payroll/salary-structures",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SalaryStructure", id: "LIST" }],
    }),

    updateSalaryStructure: builder.mutation<APIResponse<SalaryStructure>, { id: string; data: Partial<SalaryStructure> }>({
      query: ({ id, data }) => ({
        url: `/v2/payroll/salary-structures/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SalaryStructure", id },
        { type: "SalaryStructure", id: "LIST" },
      ],
    }),

    cloneSalaryStructure: builder.mutation<APIResponse<SalaryStructure>, string>({
      query: (structureId) => ({
        url: `/v2/payroll/salary-structures/${structureId}/clone`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "SalaryStructure", id: "LIST" }],
    }),

    assignSalaryStructure: builder.mutation<APIResponse<any>, { employee_id: string; structure_id: string; [key: string]: any }>({
      query: (body) => ({
        url: "/v2/payroll/salary-structures/assign",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { employee_id }) => [
        { type: "SalaryStructure", id: "LIST" },
        { type: "SalaryStructure", id: `EMP_${employee_id}` },
      ],
    }),

    approveSalaryStructure: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-structures/approve",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: [{ type: "SalaryStructure", id: "LIST" }],
    }),

    rollbackSalaryStructure: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-structures/rollback",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: [{ type: "SalaryStructure", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEmployeeSalaryStructureQuery,
  useGetSalaryStructuresQuery,
  useGetSalaryStructuresAuditQuery,
  useGetSalaryStructuresAiInsightsQuery,
  useGetSalaryStructureByIdQuery,
  useCreateSalaryStructureMutation,
  useUpdateSalaryStructureMutation,
  useCloneSalaryStructureMutation,
  useAssignSalaryStructureMutation,
  useApproveSalaryStructureMutation,
  useRollbackSalaryStructureMutation,
} = salaryStructureApi;
