/**
 * Legacy barrel file — re-exports from the canonical employees API.
 * New code should import directly from "@/features/employees/api".
 */
export {
  employeesApi,
  normalizeEmployee,
  buildEmployeeCreatePayload,
  buildEmployeeUpdatePayload,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeeFullMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeStatsQuery,
  useGetEmployeeDashboardQuery,
  useImportEmployeesMutation,
  useExportEmployeesQuery,
  useLazyExportEmployeesQuery,
  useSendInvitationMutation,
  useSendInviteMutation,
  useDeactivateEmployeeMutation,
  useActivateEmployeeByAdminMutation,
  useActivateEmployeeMutation,
  useApproveOnboardingMutation,
  useRejectOnboardingMutation,
  useResetEmployeePasswordMutation,
  useGetOnboardingStatusQuery,
  useValidateEmployeeInvitationQuery,
  useLazyValidateEmployeeInvitationQuery,
} from "@/features/employees/api";

export type {
  GetEmployeesQueryParams,
  GetEmployeesQueryArg,
  EmployeeStats,
  EmployeeDashboardData,
  ImportResult,
  OnboardingStatus,
  ActivateEmployeePayload,
  ActivateEmployeeResponse,
  EmployeeCreateInput,
} from "@/features/employees/api";