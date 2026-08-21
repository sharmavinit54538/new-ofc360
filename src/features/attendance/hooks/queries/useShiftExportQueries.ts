import { useGetShiftsQuery, useGetRostersQuery, useLazyExportMusterRollQuery } from "../../attendanceApi";

export function useShiftExportQueries(isHrOrAdmin: boolean) {
  const { data: shiftsApiRes, refetch: refetchShifts } = useGetShiftsQuery();
  const { data: rostersApiRes, refetch: refetchRosters } = useGetRostersQuery();
  const [triggerExportMusterRoll, { isLoading: isExporting }] = useLazyExportMusterRollQuery();
  return { shiftsApiRes, rostersApiRes, isExporting, triggerExportMusterRoll, refetchShifts, refetchRosters, isHrOrAdmin };
}
