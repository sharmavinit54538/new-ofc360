/**
 * Legacy barrel file — re-exports from the canonical managers API.
 * New code should import directly from "@/features/managers/api".
 */
export {
  managersApi,
  useGetManagersQuery,
  useGetManagerByIdQuery,
  useGetManagerTeamQuery,
  useGetDirectReportsQuery,
  useGetManagerAnalyticsQuery,
  useAssignManagerMutation,
  useRemoveManagerMutation,
} from "@/features/managers/api";

export type {
  Manager,
  ManagerDirectoryParams,
} from "@/features/managers/api";