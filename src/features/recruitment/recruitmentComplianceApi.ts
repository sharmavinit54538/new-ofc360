import { baseApi } from "@/services/api/baseApi";
import { APIResponse, GdprErasureRequest, EeocComplianceLog } from "./types";

export const recruitmentComplianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGdprErasureRequests: builder.query<
      APIResponse<GdprErasureRequest[]>,
      void
    >({
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "GDPR erasure requests retrieved",
            data: [],
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
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "EEOC compliance log retrieved",
            data: [],
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