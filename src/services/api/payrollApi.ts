import { baseApi } from "./baseApi";

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

export interface PayrollAnalytics {
  totalExpenditure: number;
  avgNetSalary: number;
  taxDeducted: number;
  reimbursementsPaid: number;
  monthlyTrend: Array<{ month: string; amount: number }>;
}

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollPeriods: builder.query<PayrollPeriod[], void>({
      query: () => "/api/v1/payroll/periods",
      providesTags: ["Payroll"],
    }),

    getPayrollRuns: builder.query<PayrollPeriod[], { year?: number }>({
      query: (params) => {
        const query = params?.year ? `?year=${params.year}` : "";
        return `/api/v1/payroll/runs${query}`;
      },
      providesTags: ["Payroll"],
    }),

    getPayslips: builder.query<Payslip[], { employeeId?: string; periodId?: string }>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.employeeId) search.append("employeeId", params.employeeId);
        if (params?.periodId) search.append("periodId", params.periodId);
        const q = search.toString();
        return `/api/v1/payroll/payslips${q ? `?${q}` : ""}`;
      },
      providesTags: ["Payslip"],
    }),

    getPayslipById: builder.query<Payslip, string>({
      query: (id) => `/api/v1/payroll/payslips/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Payslip", id }],
    }),

    getPayrollAnalytics: builder.query<PayrollAnalytics, { year?: number }>({
      query: (params) => `/api/v1/payroll/analytics${params?.year ? `?year=${params.year}` : ""}`,
      providesTags: ["PayrollAnalytics"],
    }),

    runPayroll: builder.mutation<PayrollPeriod, { periodId: string }>({
      query: ({ periodId }) => ({
        url: `/api/v1/payroll/runs/${periodId}/execute`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll", "PayrollAnalytics"],
    }),

    finalizePayroll: builder.mutation<PayrollPeriod, { periodId: string }>({
      query: ({ periodId }) => ({
        url: `/api/v1/payroll/runs/${periodId}/finalize`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll", "Payslip", "PayrollAnalytics"],
    }),

    approvePayout: builder.mutation<{ success: boolean; periodId: string }, { periodId: string }>({
      query: ({ periodId }) => ({
        url: `/api/v1/payroll/runs/${periodId}/approve-payout`,
        method: "POST",
      }),
      invalidatesTags: ["Payroll", "Payslip", "PayrollAnalytics"],
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
} = payrollApi;
