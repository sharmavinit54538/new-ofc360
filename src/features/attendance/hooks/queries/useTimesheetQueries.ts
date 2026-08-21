import {
  useGetTimesheetsHistoryQuery,
  useCreateTimesheetsWeeklyMutation,
  useCreateTimesheetsTimesheetIdReviewMutation,
} from "../services/attendanceApi";

export function useTimesheetQueries() {
  const { data: timesheetsApiRes, isLoading: isTimesheetsLoading, refetch: refetchTimesheets } = useGetTimesheetsHistoryQuery(undefined);
  const [createTimesheetApi, { isLoading: isCreatingTimesheet }] = useCreateTimesheetsWeeklyMutation();
  const [reviewTimesheetApi] = useCreateTimesheetsTimesheetIdReviewMutation();

  return { timesheetsApiRes, isTimesheetsLoading, refetchTimesheets, createTimesheetApi, isCreatingTimesheet, reviewTimesheetApi };
}
