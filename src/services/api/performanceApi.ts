import { baseApi } from "./baseApi";
import type { PerformanceReview } from "./performance/performanceTypes";

export * from "./performance/performanceTypes";

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPerformanceReviews: builder.query<PerformanceReview[], { employeeId?: string }>({
      query: (params) => `/api/v1/performance/reviews${params?.employeeId ? `?employeeId=${params.employeeId}` : ""}`,
      providesTags: ["Performance"],
    }),
    submitReview: builder.mutation<PerformanceReview, Partial<PerformanceReview>>({
      query: (body) => ({ url: "/api/v1/performance/reviews", method: "POST", body }),
      invalidatesTags: ["Performance"],
    }),
  }),
});
export const { useGetPerformanceReviewsQuery, useSubmitReviewMutation } = performanceApi;