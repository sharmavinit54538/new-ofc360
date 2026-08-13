import { baseApi } from "@/services/api/baseApi";
import { APIResponse, SalaryProcessingRun } from "./types";

const SALARY_PROCESSING_MUTATION_TAGS = [
  { type: "SalaryProcessing" as const, id: "LIST" },
  { type: "SalaryProcessing" as const, id: "HERO" },
  { type: "SalaryProcessing" as const, id: "KPIS" },
  { type: "SalaryProcessing" as const, id: "WORKFLOW" },
  { type: "SalaryProcessing" as const, id: "INSIGHTS" },
  { type: "SalaryProcessing" as const, id: "VALIDATIONS" },
  { type: "SalaryProcessing" as const, id: "ANALYTICS" },
  { type: "PayCycle" as const, id: "LIST" },
  { type: "Payslip" as const, id: "LIST" },
];

export const salaryProcessingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalaryProcessing: builder.query<APIResponse<SalaryProcessingRun>, void>({
      query: () => ({
        url: "/v2/payroll/salary-processing",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryProcessing", id: "LIST" }],
    }),

    getSalaryProcessingHero: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/salary-processing/hero",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryProcessing", id: "HERO" }],
    }),

    getSalaryProcessingKpis: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/salary-processing/kpis",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryProcessing", id: "KPIS" }],
    }),

    getSalaryProcessingApprovalWorkflow: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/salary-processing/approval-workflow",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryProcessing", id: "WORKFLOW" }],
    }),

    getSalaryProcessingAiInsights: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/salary-processing/ai-insights",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryProcessing", id: "INSIGHTS" }],
    }),

    getSalaryProcessingValidations: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/salary-processing/validations",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryProcessing", id: "VALIDATIONS" }],
    }),

    getSalaryProcessingAnalytics: builder.query<APIResponse<Record<string, any>>, void>({
      query: () => ({
        url: "/v2/payroll/salary-processing/analytics",
        method: "GET",
      }),
      providesTags: [{ type: "SalaryProcessing", id: "ANALYTICS" }],
    }),

    runSalaryProcessing: builder.mutation<APIResponse<SalaryProcessingRun>, { cycle_id?: string; [key: string]: any } | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/run",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    approveSalaryProcessing: builder.mutation<APIResponse<SalaryProcessingRun>, { run_id?: string; [key: string]: any } | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/approve",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    rollbackSalaryProcessing: builder.mutation<APIResponse<SalaryProcessingRun>, { run_id?: string; [key: string]: any } | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/rollback",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    recalculateEmployeeSalary: builder.mutation<APIResponse<any>, string>({
      query: (employeeId) => ({
        url: `/v2/payroll/salary-processing/recalculate/${employeeId}`,
        method: "POST",
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    resolveSalaryProcessingException: builder.mutation<APIResponse<any>, { exception_id: string; resolution?: string }>({
      query: ({ exception_id, ...body }) => ({
        url: `/v2/payroll/salary-processing/resolve-exception/${exception_id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    autoFixSalaryProcessing: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/auto-fix",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    batchPayoutSalaryProcessing: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/batch-payout",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    batchApproveSalaryProcessing: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/batch-approve",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    batchRecalculateSalaryProcessing: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/batch-recalculate",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    generateSalaryProcessingPayslips: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/payslips",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    initiateSalaryProcessingBankTransfer: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/bank-transfer",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),

    exportSalaryProcessing: builder.mutation<APIResponse<any>, Record<string, any> | void>({
      query: (body) => ({
        url: "/v2/payroll/salary-processing/export",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: SALARY_PROCESSING_MUTATION_TAGS,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSalaryProcessingQuery,
  useGetSalaryProcessingHeroQuery,
  useGetSalaryProcessingKpisQuery,
  useGetSalaryProcessingApprovalWorkflowQuery,
  useGetSalaryProcessingAiInsightsQuery,
  useGetSalaryProcessingValidationsQuery,
  useGetSalaryProcessingAnalyticsQuery,
  useRunSalaryProcessingMutation,
  useApproveSalaryProcessingMutation,
  useRollbackSalaryProcessingMutation,
  useRecalculateEmployeeSalaryMutation,
  useResolveSalaryProcessingExceptionMutation,
  useAutoFixSalaryProcessingMutation,
  useBatchPayoutSalaryProcessingMutation,
  useBatchApproveSalaryProcessingMutation,
  useBatchRecalculateSalaryProcessingMutation,
  useGenerateSalaryProcessingPayslipsMutation,
  useInitiateSalaryProcessingBankTransferMutation,
  useExportSalaryProcessingMutation,
} = salaryProcessingApi;
