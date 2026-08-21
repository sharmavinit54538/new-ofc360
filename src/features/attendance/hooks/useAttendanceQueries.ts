import { useFaceAttendanceQueries } from "./queries/useFaceAttendanceQueries";
import { useFaceMutations } from "./queries/useFaceMutations";
import { useHolidayQueries } from "./queries/useHolidayQueries";
import { useLeaveQueries } from "./queries/useLeaveQueries";
import { useTimesheetQueries } from "./queries/useTimesheetQueries";
import { useShiftExportQueries } from "./queries/useShiftExportQueries";
import { useGetEmployeesQuery } from "../services/externalApisPart2";

export function useAttendanceQueries({ isHrOrAdmin, isManagerOrAbove }: { isHrOrAdmin: boolean; isManagerOrAbove: boolean }) {
  const { data: rawEmployees = [] } = useGetEmployeesQuery(undefined, { skip: !isHrOrAdmin && !isManagerOrAbove });
  const employees = Array.isArray(rawEmployees)
    ? rawEmployees
    : Array.isArray((rawEmployees as any)?.items)
    ? (rawEmployees as any).items
    : Array.isArray((rawEmployees as any)?.data)
    ? (rawEmployees as any).data
    : [];

  return {
    ...useFaceAttendanceQueries({ isHrOrAdmin, isManagerOrAbove }),
    ...useFaceMutations(),
    ...useHolidayQueries(),
    ...useLeaveQueries(),
    ...useTimesheetQueries(),
    ...useShiftExportQueries(isHrOrAdmin),
    employees,
  };
}
