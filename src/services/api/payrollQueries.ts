import { baseApi } from "./baseApi";
import { PayrollPeriod, Payslip, PayrollAnalytics } from "./payrollTypes";

export const payrollQueriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollPeriods: builder.query<PayrollPeriod[], void>({ query: () => "/api/v1/payroll/periods", providesTags: ["Payroll"] }),
    getPayrollRuns: builder.query<PayrollPeriod[], { year?: number }>({ query: (p) => `/api/v1/payroll/runs${p?.year ? `?year=${p.year}` : ""}`, providesTags: ["Payroll"] }),
    getPayslips: builder.query<Payslip[], { employeeId?: string; periodId?: string }>({
      query: (p) => `/api/v1/payroll/payslips?${new URLSearchParams(Object.entries(p || {}).filter(([_, v]) => v) as any).toString()}`,
      providesTags: ["Payslip"],
    }),
    getPayslipById: builder.query<Payslip, string>({ query: (id) => `/api/v1/payroll/payslips/${id}`, providesTags: (_1, _2, id) => [{ type: "Payslip", id }] }),
    getPayrollAnalytics: builder.query<PayrollAnalytics, { year?: number }>({ query: (p) => `/api/v1/payroll/analytics${p?.year ? `?year=${p.year}` : ""}`, providesTags: ["PayrollAnalytics"] }),
  }),
});
export const { useGetPayrollPeriodsQuery, useGetPayrollRunsQuery, useGetPayslipsQuery, useGetPayslipByIdQuery, useGetPayrollAnalyticsQuery } = payrollQueriesApi;
