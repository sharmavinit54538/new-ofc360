/**
 * TODO: backend not implemented — replace when recruitment-specific GDPR right-to-be-forgotten & EEOC compliance endpoints ship.
 * 
 * Note: The general payroll `/api/v1/payroll/security/audit` endpoint provides generic audit logging,
 * but recruitment-specific GDPR erasure requests & EEOC logs are mocked here.
 */

import { baseApi } from "@/services/api/baseApi";
import { APIResponse, GdprErasureRequest, EeocComplianceLog } from "./types";

const MOCK_GDPR_REQUESTS: GdprErasureRequest[] = [
  {
    id: "gdpr-req-01",
    candidate_email: "j.doe.privacy@example.com",
    requested_at: "2026-08-01T10:30:00Z",
    status: "processed",
  },
  {
    id: "gdpr-req-02",
    candidate_email: "samuel.k@domain.org",
    requested_at: "2026-08-11T14:15:00Z",
    status: "pending",
  },
];

const MOCK_EEOC_LOGS: EeocComplianceLog[] = [
  {
    id: "eeoc-log-01",
    event_type: "Demographic Data Masking Engaged",
    details: "Anonymized candidate resumes prior to screening round for Job #J-402",
    timestamp: "2026-08-12T09:00:00Z",
  },
  {
    id: "eeoc-log-02",
    event_type: "Adverse Impact Analysis Standard",
    details: "Evaluated 4/5th selection ratio compliance for Q2 Engineering hires; ratio passed at 88%",
    timestamp: "2026-08-10T16:45:00Z",
  },
];

export const recruitmentComplianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGdprErasureRequests: builder.query<
      APIResponse<GdprErasureRequest[]>,
      void
    >({
      // TODO: backend not implemented — mock queryFn
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "GDPR erasure requests retrieved (Mocked Data)",
            data: MOCK_GDPR_REQUESTS,
            errors: null,
          },
        };
      },
      providesTags: [{ type: "RecruitmentCompliance", id: "GDPR_LIST" }],
    }),

    getEeocComplianceLog: builder.query<
      APIResponse<EeocComplianceLog[]>,
      void
    >({
      // TODO: backend not implemented — mock queryFn
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "EEOC compliance log retrieved (Mocked Data)",
            data: MOCK_EEOC_LOGS,
            errors: null,
          },
        };
      },
      providesTags: [{ type: "RecruitmentCompliance", id: "EEOC_LOG" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetGdprErasureRequestsQuery, useGetEeocComplianceLogQuery } =
  recruitmentComplianceApi;
