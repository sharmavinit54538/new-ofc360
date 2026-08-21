import { useGetLeavesQuery, useApplyLeaveMutation, useReviewLeaveMutation } from "../../attendanceApi";

export function useLeaveQueries() {
  const { data: leavesApiRes, refetch: refetchLeaves } = useGetLeavesQuery();
  const [applyLeaveApi] = useApplyLeaveMutation();
  const [reviewLeaveApi] = useReviewLeaveMutation();
  return { leavesApiRes, refetchLeaves, applyLeaveApi, reviewLeaveApi };
}
