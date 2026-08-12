import { baseApi } from "./baseApi";

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  cycle: string;
  rating: number;
  feedback: string;
  status: "draft" | "submitted" | "approved";
  createdAt: string;
}

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPerformanceReviews: builder.query<PerformanceReview[], { employeeId?: string }>({
      query: (params) => {
        const q = params?.employeeId ? `?employeeId=${params.employeeId}` : "";
        return `/api/v1/performance/reviews${q}`;
      },
      providesTags: ["Performance"],
    }),

    submitReview: builder.mutation<PerformanceReview, Partial<PerformanceReview>>({
      query: (body) => ({
        url: "/api/v1/performance/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Performance"],
    }),
  }),
});

export const {
  useGetPerformanceReviewsQuery,
  useSubmitReviewMutation,
} = performanceApi;
