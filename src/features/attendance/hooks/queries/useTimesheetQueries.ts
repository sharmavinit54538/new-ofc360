import { useGetTimesheetsQuery, useCreateTimesheetMutation, useApproveTimesheetMutation } from "../../attendanceApi";

export function useTimesheetQueries() {
  const { data: timesheetsApiRes, refetch: refetchTimesheets } = useGetTimesheetsQuery();
  const [createTimesheetApi] = useCreateTimesheetMutation();
  const [approveTimesheetApi] = useApproveTimesheetMutation();
  return { timesheetsApiRes, refetchTimesheets, createTimesheetApi, approveTimesheetApi };
}
