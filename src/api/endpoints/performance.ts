import { api } from "../client";

export interface PerformanceCycle {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  review_start_date: string;
  review_end_date: string;
  status: "draft" | "active" | "completed" | "archived";
  review_type: "self" | "manager" | "peer" | "360";
  created_at: string;
  updated_at: string;
}

export interface PerformanceReview {
  id: string;
  cycle_id: string;
  employee_id: string;
  reviewer_id?: string;
  review_type: "self" | "manager" | "peer" | "360";
  status: "pending" | "in_progress" | "submitted" | "acknowledged" | "completed";
  overall_score?: number;
  goals: Array<{
    id: string;
    title: string;
    description?: string;
    weight: number;
    score?: number;
    self_score?: number;
    manager_score?: number;
  }>;
  competencies: Array<{
    id: string;
    name: string;
    description?: string;
    weight: number;
    score?: number;
    self_score?: number;
    manager_score?: number;
  }>;
  strengths?: string;
  areas_for_improvement?: string;
  manager_comments?: string;
  employee_comments?: string;
  submitted_at?: string;
  acknowledged_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceGoal {
  id: string;
  employee_id: string;
  cycle_id?: string;
  title: string;
  description?: string;
  category: "individual" | "team" | "organization";
  status: "not_started" | "in_progress" | "completed" | "cancelled" | "on_hold";
  progress: number;
  target_date: string;
  start_date: string;
  completed_date?: string;
  weight: number;
  metrics: Array<{ name: string; target: number; current: number; unit: string }>;
  created_at: string;
  updated_at: string;
}

export interface PerformanceTemplate {
  id: string;
  name: string;
  description?: string;
  review_type: "self" | "manager" | "peer" | "360";
  goals: Array<{ title: string; description?: string; weight: number }>;
  competencies: Array<{ name: string; description?: string; weight: number }>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const performanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPerformanceCycles: builder.query<PerformanceCycle[], { status?: string }>({
      query: (params) => `/api/v1/performance/cycles?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Performance"],
    }),

    getPerformanceCycleById: builder.query<PerformanceCycle, string>({
      query: (id) => `/api/v1/performance/cycles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Performance", id }],
    }),

    createPerformanceCycle: builder.mutation<PerformanceCycle, Partial<PerformanceCycle>>({
      query: (body) => ({
        url: "/api/v1/performance/cycles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Performance"],
    }),

    updatePerformanceCycle: builder.mutation<PerformanceCycle, { id: string; data: Partial<PerformanceCycle> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/performance/cycles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Performance", id }, { type: "Performance", id: "LIST" }],
    }),

    deletePerformanceCycle: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/performance/cycles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Performance"],
    }),

    activatePerformanceCycle: builder.mutation<PerformanceCycle, string>({
      query: (id) => ({
        url: `/api/v1/performance/cycles/${id}/activate`,
        method: "POST",
      }),
      invalidatesTags: ["Performance"],
    }),

    closePerformanceCycle: builder.mutation<PerformanceCycle, string>({
      query: (id) => ({
        url: `/api/v1/performance/cycles/${id}/close`,
        method: "POST",
      }),
      invalidatesTags: ["Performance"],
    }),

    getPerformanceReviews: builder.query<PerformanceReview[], { cycle_id?: string; employee_id?: string; status?: string }>({
      query: (params) => `/api/v1/performance/reviews?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Performance", "Review"],
    }),

    getPerformanceReviewById: builder.query<PerformanceReview, string>({
      query: (id) => `/api/v1/performance/reviews/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Review", id }],
    }),

    createPerformanceReview: builder.mutation<PerformanceReview, Partial<PerformanceReview>>({
      query: (body) => ({
        url: "/api/v1/performance/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Performance", "Review"],
    }),

    updatePerformanceReview: builder.mutation<PerformanceReview, { id: string; data: Partial<PerformanceReview> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/performance/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Review", id }, { type: "Performance", id: "LIST" }],
    }),

    submitPerformanceReview: builder.mutation<PerformanceReview, string>({
      query: (id) => ({
        url: `/api/v1/performance/reviews/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: ["Performance", "Review"],
    }),

    acknowledgePerformanceReview: builder.mutation<PerformanceReview, string>({
      query: (id) => ({
        url: `/api/v1/performance/reviews/${id}/acknowledge`,
        method: "POST",
      }),
      invalidatesTags: ["Performance", "Review"],
    }),

    getMyReviews: builder.query<PerformanceReview[], { cycle_id?: string }>({
      query: (params) => `/api/v1/performance/my-reviews?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Performance", "Review"],
    }),

    getTeamReviews: builder.query<PerformanceReview[], { cycle_id?: string; manager_id?: string }>({
      query: (params) => `/api/v1/performance/team-reviews?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Performance", "Review"],
    }),

    getPerformanceGoals: builder.query<PerformanceGoal[], { employee_id?: string; cycle_id?: string; status?: string }>({
      query: (params) => `/api/v1/performance/goals?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Performance", "Goal"],
    }),

    getPerformanceGoalById: builder.query<PerformanceGoal, string>({
      query: (id) => `/api/v1/performance/goals/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Goal", id }],
    }),

    createPerformanceGoal: builder.mutation<PerformanceGoal, Partial<PerformanceGoal>>({
      query: (body) => ({
        url: "/api/v1/performance/goals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Performance", "Goal"],
    }),

    updatePerformanceGoal: builder.mutation<PerformanceGoal, { id: string; data: Partial<PerformanceGoal> }>({
      query: ({ id, data }) => ({
        url: `/api/v1/performance/goals/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Goal", id }, { type: "Performance", id: "LIST" }],
    }),

    updateGoalProgress: builder.mutation<PerformanceGoal, { id: string; progress: number }>({
      query: ({ id, progress }) => ({
        url: `/api/v1/performance/goals/${id}/progress`,
        method: "PATCH",
        body: { progress },
      }),
      invalidatesTags: ["Performance", "Goal"],
    }),

    deletePerformanceGoal: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/v1/performance/goals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Performance", "Goal"],
    }),

    getPerformanceTemplates: builder.query<PerformanceTemplate[], void>({
      query: () => "/api/v1/performance/templates",
      providesTags: ["Performance"],
    }),

    createPerformanceTemplate: builder.mutation<PerformanceTemplate, Partial<PerformanceTemplate>>({
      query: (body) => ({
        url: "/api/v1/performance/templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Performance"],
    }),

    getPerformanceAnalytics: builder.query<any, { cycle_id?: string; department?: string }>({
      query: (params) => `/api/v1/performance/analytics?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Performance"],
    }),
  }),
});

export const {
  useGetPerformanceCyclesQuery,
  useGetPerformanceCycleByIdQuery,
  useCreatePerformanceCycleMutation,
  useUpdatePerformanceCycleMutation,
  useDeletePerformanceCycleMutation,
  useActivatePerformanceCycleMutation,
  useClosePerformanceCycleMutation,
  useGetPerformanceReviewsQuery,
  useGetPerformanceReviewByIdQuery,
  useCreatePerformanceReviewMutation,
  useUpdatePerformanceReviewMutation,
  useSubmitPerformanceReviewMutation,
  useAcknowledgePerformanceReviewMutation,
  useGetMyReviewsQuery,
  useGetTeamReviewsQuery,
  useGetPerformanceGoalsQuery,
  useGetPerformanceGoalByIdQuery,
  useCreatePerformanceGoalMutation,
  useUpdatePerformanceGoalMutation,
  useUpdateGoalProgressMutation,
  useDeletePerformanceGoalMutation,
  useGetPerformanceTemplatesQuery,
  useCreatePerformanceTemplateMutation,
  useGetPerformanceAnalyticsQuery,
} = performanceApi;