import { api } from "@/api/client";

export interface PayrollPeriod {
  id: string;
  month: string;
  year: number;
  status: "draft" | "processing" | "finalized" | "paid";
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  payoutDate?: string;
}

export interface PayrollAnalytics {
  totalExpenditure: number;
  avgNetSalary: number;
  taxDeducted: number;
  reimbursementsPaid: number;
  monthlyTrend: Array<{ month: string; amount: number }>;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  bonuses: number;
  overtime: number;
  grossSalary: number;
  pfDeduction: number;
  esiDeduction: number;
  tdsDeduction: number;
  loanDeduction: number;
  totalDeductions: number;
  netSalary: number;
  status: "generated" | "published" | "paid";
}

export interface RunPayrollRequest {
  periodId: string;
}

export interface FinalizePayrollRequest {
  periodId: string;
}

export interface ApprovePayoutRequest {
  periodId: string;
}

export const payrollApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollPeriods: builder.query<PayrollPeriod[], void>({
      query: () => "/api/v1/payroll/periods",
      providesTags: ["Payroll"],
    }),

    getPayrollRuns: builder.query<PayrollPeriod[], { year?: number }>({
      query: (p) => `/api/v1/payroll/runs${p?.year ? `?year=${p.year}` : ""}`,
      providesTags: ["Payroll"],
    }),

    getPayslips: builder.query<Payslip[], { employeeId?: string; periodId?: string }>({
      query: (p) => `/api/v1/payroll/payslips?${new URLSearchParams(Object.entries(p || {}).filter(([_, v]) => v) as any).toString()}`,
      providesTags: ["Payslip"],
    }),

    getPayslipById: builder.query<Payslip, string>({
      query: (id) => `/api/v1/payroll/payslips/${id}`,
      providesTags: (_1, _2, id) => [{ type: "Payslip", id }],
    }),

    getPayrollAnalytics: builder.query<PayrollAnalytics, { year?: number }>({
      query: (p) => `/api/v1/payroll/analytics${p?.year ? `?year=${p.year}` : ""}`,
      providesTags: ["PayrollAnalytics"],
    }),

    runPayroll: builder.mutation<PayrollPeriod, RunPayrollRequest>({
      query: ({ periodId }) => ({ url: `/api/v1/payroll/runs/${periodId}/execute`, method: "POST" }),
      invalidatesTags: ["Payroll", "PayrollAnalytics"],
    }),

    finalizePayroll: builder.mutation<PayrollPeriod, FinalizePayrollRequest>({
      query: ({ periodId }) => ({ url: `/api/v1/payroll/runs/${periodId}/finalize`, method: "POST" }),
      invalidatesTags: ["Payroll", "Payslip", "PayrollAnalytics"],
    }),

    approvePayout: builder.mutation<{ success: boolean; periodId: string }, ApprovePayoutRequest>({
      query: ({ periodId }) => ({ url: `/api/v1/payroll/runs/${periodId}/approve-payout`, method: "POST" }),
      invalidatesTags: ["Payroll", "Payslip", "PayrollAnalytics"],
    }),

    generatePayslip: builder.mutation<Payslip, { employeeId: string; periodId: string }>({
      query: ({ employeeId, periodId }) => ({ url: `/api/v1/payroll/payslips/generate`, method: "POST", body: { employeeId, periodId } }),
      invalidatesTags: ["Payslip", "Payroll"],
    }),

    downloadPayslip: builder.query<Blob, { payslipId: string; format?: "pdf" | "xlsx" }>({
      query: ({ payslipId, format = "pdf" }) => ({
        url: `/api/v1/payroll/payslips/${payslipId}/download?format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    getSalaryStructure: builder.query<any, { employeeId?: string }>({
      query: (p) => `/api/v1/payroll/salary-structure?${new URLSearchParams(p as Record<string, string>).toString()}`,
      providesTags: ["Payroll"],
    }),

    createSalaryStructure: builder.mutation<any, any>({
      query: (body) => ({ url: "/api/v1/payroll/salary-structure", method: "POST", body }),
      invalidatesTags: ["Payroll"],
    }),

    updateSalaryStructure: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/api/v1/payroll/salary-structure/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Payroll"],
    }),
  }),
});

export const {
  useGetPayrollPeriodsQuery,
  useGetPayrollRunsQuery,
  useGetPayslipsQuery,
  useGetPayslipByIdQuery,
  useGetPayrollAnalyticsQuery,
  useRunPayrollMutation,
  useFinalizePayrollMutation,
  useApprovePayoutMutation,
  useGeneratePayslipMutation,
  useDownloadPayslipQuery,
  useGetSalaryStructureQuery,
  useCreateSalaryStructureMutation,
  useUpdateSalaryStructureMutation,
} = payrollApi;

export type {
  PayrollPeriod,
  PayrollAnalytics,
  Payslip,
  RunPayrollRequest,
  FinalizePayrollRequest,
  ApprovePayoutRequest,
};