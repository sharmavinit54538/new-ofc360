import { api } from "../client";

export interface WorkforceReport {
  total_employees: number;
  active_employees: number;
  new_hires: number;
  terminations: number;
  by_department: Array<{ department: string; count: number }>;
  by_employment_type: Array<{ type: string; count: number }>;
  by_location: Array<{ location: string; count: number }>;
  turnover_rate: number;
  average_tenure: number;
}

export interface AttendanceReport {
  date_range: { start: string; end: string };
  total_working_days: number;
  average_attendance_rate: number;
  by_department: Array<{ department: string; present: number; absent: number; late: number; rate: number }>;
  by_employee: Array<{ employee_id: string; name: string; present: number; absent: number; late: number; rate: number }>;
  trends: Array<{ date: string; present: number; absent: number; late: number }>;
}

export interface PayrollReport {
  period: { month: string; year: number };
  total_gross: number;
  total_net: number;
  total_deductions: number;
  total_tax: number;
  by_department: Array<{ department: string; gross: number; net: number; count: number }>;
  by_component: Array<{ component: string; amount: number }>;
  top_earners: Array<{ employee_id: string; name: string; gross: number }>;
}

export interface RecruitmentReport {
  date_range: { start: string; end: string };
  total_applications: number;
  total_hired: number;
  total_rejected: number;
  average_time_to_hire: number;
  by_source: Array<{ source: string; applications: number; hired: number }>;
  by_stage: Array<{ stage: string; count: number }>;
  by_department: Array<{ department: string; openings: number; filled: number }>;
}

export interface PerformanceReport {
  cycle: string;
  total_reviews: number;
  completed_reviews: number;
  average_score: number;
  by_department: Array<{ department: string; average: number; completed: number; total: number }>;
  by_rating: Array<{ rating: string; count: number }>;
  top_performers: Array<{ employee_id: string; name: string; score: number }>;
}

export interface EngagementReport {
  survey_id: string;
  participation_rate: number;
  overall_score: number;
  by_category: Array<{ category: string; score: number }>;
  by_department: Array<{ department: string; score: number; participation: number }>;
  trends: Array<{ date: string; score: number }>;
}

export interface ComplianceReport {
  period: { start: string; end: string };
  statutory_compliance: Array<{ requirement: string; status: "compliant" | "non_compliant" | "pending"; details?: string }>;
  pf_compliance: { total_employees: number; enrolled: number; pending: number };
  esi_compliance: { total_employees: number; enrolled: number; pending: number };
  pt_compliance: { total_employees: number; enrolled: number; pending: number };
  labor_law_compliance: Array<{ law: string; status: string; details?: string }>;
}

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWorkforceReport: builder.query<WorkforceReport, { start_date?: string; end_date?: string }>({
      query: (params) => `/api/v1/reports/workforce?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Reports"],
    }),

    getAttendanceReport: builder.query<AttendanceReport, { start_date: string; end_date: string; department?: string }>({
      query: (params) => `/api/v1/reports/attendance?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Reports", "Attendance"],
    }),

    getPayrollReport: builder.query<PayrollReport, { month: string; year: number }>({
      query: (params) => `/api/v1/reports/payroll?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Reports", "Payroll"],
    }),

    getRecruitmentReport: builder.query<RecruitmentReport, { start_date?: string; end_date?: string }>({
      query: (params) => `/api/v1/reports/recruitment?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Reports", "Recruitment"],
    }),

    getPerformanceReport: builder.query<PerformanceReport, { cycle_id: string }>({
      query: (params) => `/api/v1/reports/performance?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Reports", "Performance"],
    }),

    getEngagementReport: builder.query<EngagementReport, { survey_id: string }>({
      query: (params) => `/api/v1/reports/engagement?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Reports"],
    }),

    getComplianceReport: builder.query<ComplianceReport, { start_date: string; end_date: string }>({
      query: (params) => `/api/v1/reports/compliance?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Reports"],
    }),

    exportWorkforceReport: builder.query<Blob, { start_date?: string; end_date?: string; format: "csv" | "pdf" | "xlsx" }>({
      query: ({ format, ...params }) => ({
        url: `/api/v1/reports/workforce/export?${new URLSearchParams({ ...params, format } as Record<string, string>).toString()}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    exportAttendanceReport: builder.query<Blob, { start_date: string; end_date: string; format: "csv" | "pdf" | "xlsx" }>({
      query: ({ format, ...params }) => ({
        url: `/api/v1/reports/attendance/export?${new URLSearchParams({ ...params, format } as Record<string, string>).toString()}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    exportPayrollReport: builder.query<Blob, { month: string; year: number; format: "csv" | "pdf" | "xlsx" }>({
      query: ({ format, ...params }) => ({
        url: `/api/v1/reports/payroll/export?${new URLSearchParams({ ...params, format } as Record<string, string>).toString()}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    getDashboardMetrics: builder.query<any, void>({
      query: () => "/api/v1/reports/dashboard",
      providesTags: ["Reports"],
    }),

    getCustomReport: builder.query<any, { report_id: string; params?: Record<string, any> }>({
      query: ({ report_id, params }) => `/api/v1/reports/custom/${report_id}?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Reports"],
    }),

    createCustomReport: builder.mutation<any, { name: string; query: string; description?: string }>({
      query: (body) => ({
        url: "/api/v1/reports/custom",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),

    scheduleReport: builder.mutation<any, { report_id: string; frequency: "daily" | "weekly" | "monthly"; recipients: string[]; format: "csv" | "pdf" }>({
      query: (body) => ({
        url: "/api/v1/reports/schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetWorkforceReportQuery,
  useGetAttendanceReportQuery,
  useGetPayrollReportQuery,
  useGetRecruitmentReportQuery,
  useGetPerformanceReportQuery,
  useGetEngagementReportQuery,
  useGetComplianceReportQuery,
  useExportWorkforceReportQuery,
  useExportAttendanceReportQuery,
  useExportPayrollReportQuery,
  useGetDashboardMetricsQuery,
  useGetCustomReportQuery,
  useCreateCustomReportMutation,
  useScheduleReportMutation,
} = reportsApi;