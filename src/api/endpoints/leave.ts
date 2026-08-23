/**
 * Legacy barrel file — re-exports from the canonical leave API.
 * New code should import directly from "@/features/attendance/api".
 */
export {
  leaveApi,
  useGetLeaveBalancesQuery,
  useGetLeaveBalancesByEmployeeQuery,
  useApplyLeaveMutation,
  useGetLeaveHistoryQuery,
  useGetPendingLeavesQuery,
  useReviewLeaveMutation,
  useCancelLeaveMutation,
  useGetLeavePoliciesQuery,
  useGetLeaveTypesQuery,
} from "@/features/attendance/api";

export type {
  LeaveBalance,
  LeaveRequest,
  ApplyLeaveRequest,
  ReviewLeaveRequest,
  LeavePolicy,
} from "@/features/attendance/api";