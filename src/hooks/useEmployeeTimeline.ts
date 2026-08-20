import { useGetEmployeeTimelineQuery, useAddTimelineEventMutation, useRecordMilestoneMutation } from "@/services/api/timelineApi";

export function useEmployeeTimeline(employeeId: string) {
  const { data: timelineEvents, isLoading, isFetching, error, refetch } = useGetEmployeeTimelineQuery(employeeId, { skip: !employeeId });
  const [addEvent, { isLoading: isAdding }] = useAddTimelineEventMutation();
  const [recordMilestone, { isLoading: isRecordingMilestone }] = useRecordMilestoneMutation();
  return {
    events: timelineEvents || [], isLoading, isFetching,
    isMutating: isAdding || isRecordingMilestone, error, refetch, addEvent, recordMilestone,
  };
}