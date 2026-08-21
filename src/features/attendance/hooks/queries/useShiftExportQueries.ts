import {
  useCreateV2ShiftsPlansMutation,
  useLazyGetExportsAttendanceQuery,
  useGetEmployeesQuery,
} from "../services/attendanceApi";

export function useShiftExportQueries() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const [createShiftPlanApi] = useCreateV2ShiftsPlansMutation();
  const [triggerAttendanceExport, { isFetching: isExporting }] = useLazyGetExportsAttendanceQuery();

  return { employees, createShiftPlanApi, triggerAttendanceExport, isExporting };
}
