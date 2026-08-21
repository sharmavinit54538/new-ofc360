import { usePunchActions } from "./actions/usePunchActions";
import { useShiftRosterActions } from "./actions/useShiftRosterActions";
import { useHolidayActions } from "./actions/useHolidayActions";
import { useRegularizationActions } from "./actions/useRegularizationActions";
import { useTimesheetActions } from "./actions/useTimesheetActions";
import { useLeaveActions } from "./actions/useLeaveActions";
import { useOvertimeActions } from "./actions/useOvertimeActions";
import { useExportAction } from "./actions/useExportAction";

export function useAttendanceActions(p: Record<string, unknown>) {
  const punch = usePunchActions(p as unknown as Parameters<typeof usePunchActions>[0]);
  const shiftRoster = useShiftRosterActions(p as unknown as Parameters<typeof useShiftRosterActions>[0]);
  const holiday = useHolidayActions(p as unknown as Parameters<typeof useHolidayActions>[0]);
  const reg = useRegularizationActions(p as unknown as Parameters<typeof useRegularizationActions>[0]);
  const timesheet = useTimesheetActions(p as unknown as Parameters<typeof useTimesheetActions>[0]);
  const leave = useLeaveActions(p as unknown as Parameters<typeof useLeaveActions>[0]);
  const overtime = useOvertimeActions(p as unknown as Parameters<typeof useOvertimeActions>[0]);
  const handleExportMusterRoll = useExportAction(p as unknown as Parameters<typeof useExportAction>[0]);
  return { ...punch, ...shiftRoster, ...holiday, ...reg, ...timesheet, ...leave, ...overtime, handleExportMusterRoll };
}
