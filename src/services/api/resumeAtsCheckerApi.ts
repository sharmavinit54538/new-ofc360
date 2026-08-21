import { baseApi } from "./baseApi";
import type { ResumeATSReport, ATSApiResponse } from "./ats/atsReportTypes";

export * from "./ats/atsScoreTypes";
export * from "./ats/atsParsedResumeTypes";
export * from "./ats/atsReportTypes";

export const resumeAtsCheckerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkResumeATS: builder.mutation<ResumeATSReport, FormData>({
      query: (formData) => ({ url: "/api/v2/resume-ats-checker/check", method: "POST", body: formData }),
      transformResponse: (response: ATSApiResponse<ResumeATSReport> | ResumeATSReport) => {
        if ("data" in response && "success" in response) return (response as ATSApiResponse<ResumeATSReport>).data;
        return response as ResumeATSReport;
      },
    }),
  }),
  overrideExisting: true,
});
export const { useCheckResumeATSMutation } = resumeAtsCheckerApi;