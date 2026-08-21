import { useFaceAttendanceQueries } from "./queries/useFaceAttendanceQueries";
import { useFaceMutations } from "./queries/useFaceMutations";
import { useHolidayQueries } from "./queries/useHolidayQueries";
import { useLeaveQueries } from "./queries/useLeaveQueries";
import { useTimesheetQueries } from "./queries/useTimesheetQueries";
import { useShiftExportQueries } from "./queries/useShiftExportQueries";

export function useAttendanceQueries({ isHrOrAdmin, isManagerOrAbove }: { isHrOrAdmin: boolean; isManagerOrAbove: boolean }) {
  return {
    ...useFaceAttendanceQueries(isHrOrAdmin, isManagerOrAbove),
    ...useFaceMutations(),
    ...useHolidayQueries(),
    ...useLeaveQueries(),
    ...useTimesheetQueries(),
    ...useShiftExportQueries(),
  };
}
