/**
 * Legacy barrel file — re-exports from the canonical performance API.
 * New code should import directly from "@/features/performance/api".
 */
export {
  performanceApi,
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
} from "@/features/performance/api";

export type {
  PerformanceCycle,
  PerformanceReview,
  PerformanceGoal,
  PerformanceTemplate,
} from "@/features/performance/api";