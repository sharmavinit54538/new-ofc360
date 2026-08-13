import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  ComplianceDashboardKpis,
  ComplianceCheck,
  LaborLawStatus,
  MissingDocument,
  ComplianceRisk,
  AuditReadiness,
  ComplianceAnalytics,
  ComplianceAlert,
  ComplianceReportData,
  EmployeeComplianceDetail,
  AnalyzeCompliancePayload,
  AuditPayload,
  RiskAnalysisPayload,
  SecurityAuditLog,
} from "./types";

export const complianceReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplianceDashboard: builder.query<APIResponse<ComplianceDashboardKpis>, void>({
      query: () => ({
        url: "/v1/ai/compliance/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "DASHBOARD" }],
    }),

    getComplianceChecks: builder.query<APIResponse<ComplianceCheck[]>, void>({
      query: () => ({
        url: "/v1/ai/compliance/checks",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "CHECKS" }],
    }),

    getLaborLaws: builder.query<APIResponse<LaborLawStatus[]>, void>({
      query: () => ({
        url: "/v1/ai/compliance/labor-laws",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "LABOR_LAWS" }],
    }),

    getMissingDocuments: builder.query<APIResponse<MissingDocument[]>, void>({
      query: () => ({
        url: "/v1/ai/compliance/missing-documents",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "MISSING_DOCS" }],
    }),

    getComplianceRisks: builder.query<APIResponse<ComplianceRisk[]>, void>({
      query: () => ({
        url: "/v1/ai/compliance/risks",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "RISKS" }],
    }),

    getAuditReadiness: builder.query<APIResponse<AuditReadiness>, void>({
      query: () => ({
        url: "/v1/ai/compliance/audit-readiness",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "AUDIT_READINESS" }],
    }),

    getComplianceAnalytics: builder.query<APIResponse<ComplianceAnalytics>, void>({
      query: () => ({
        url: "/v1/ai/compliance/analytics",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "ANALYTICS" }],
    }),

    getComplianceAlerts: builder.query<APIResponse<ComplianceAlert[]>, void>({
      query: () => ({
        url: "/v1/ai/compliance/alerts",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "ALERTS" }],
    }),

    getComplianceReport: builder.query<APIResponse<ComplianceReportData>, void>({
      query: () => ({
        url: "/v1/ai/compliance/report",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "REPORT" }],
    }),

    getEmployeeComplianceDetail: builder.query<
      APIResponse<EmployeeComplianceDetail>,
      string
    >({
      query: (employeeId) => ({
        url: `/v1/ai/compliance/employee/${employeeId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [
        { type: "ComplianceReport", id: `EMPLOYEE_${id}` },
      ],
    }),

    analyzeCompliance: builder.mutation<APIResponse<any>, AnalyzeCompliancePayload>({
      query: (body) => ({
        url: "/v1/ai/compliance/analyze",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ComplianceReport", id: "DASHBOARD" }],
    }),

    runAudit: builder.mutation<APIResponse<any>, AuditPayload>({
      query: (body) => ({
        url: "/v1/ai/compliance/audit",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ComplianceReport", id: "AUDIT_READINESS" }],
    }),

    runRiskAnalysis: builder.mutation<APIResponse<ComplianceRisk[]>, RiskAnalysisPayload>({
      query: (body) => ({
        url: "/v1/ai/compliance/risk-analysis",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ComplianceReport", id: "RISKS" }],
    }),

    getSecurityAuditLog: builder.query<APIResponse<SecurityAuditLog[]>, void>({
      query: () => ({
        url: "/v2/payroll/security/audit",
        method: "GET",
      }),
      providesTags: [{ type: "ComplianceReport", id: "SECURITY_AUDIT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetComplianceDashboardQuery,
  useGetComplianceChecksQuery,
  useGetLaborLawsQuery,
  useGetMissingDocumentsQuery,
  useGetComplianceRisksQuery,
  useGetAuditReadinessQuery,
  useGetComplianceAnalyticsQuery,
  useGetComplianceAlertsQuery,
  useGetComplianceReportQuery,
  useGetEmployeeComplianceDetailQuery,
  useAnalyzeComplianceMutation,
  useRunAuditMutation,
  useRunRiskAnalysisMutation,
  useGetSecurityAuditLogQuery,
} = complianceReportsApi;
