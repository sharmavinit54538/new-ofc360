import {
  useGetLeavesHistoryQuery,
  useCreateLeavesApplyMutation,
  useCreateLeavesLeaveIdReviewMutation,
} from "../services/attendanceApi";

export function useLeaveQueries() {
  const { data: leavesApiRes, isLoading: isLeavesLoading, refetch: refetchLeaves } = useGetLeavesHistoryQuery(undefined);
  const [applyLeaveApi, { isLoading: isApplyingLeave }] = useCreateLeavesApplyMutation();
  const [reviewLeaveApi] = useCreateLeavesLeaveIdReviewMutation();

  return { leavesApiRes, isLeavesLoading, refetchLeaves, applyLeaveApi, isApplyingLeave, reviewLeaveApi };
}
