import { usePunchActions } from "./actions/usePunchActions";
import { useShiftRosterActions } from "./actions/useShiftRosterActions";
import { useHolidayActions } from "./actions/useHolidayActions";
import { useRegularizationActions } from "./actions/useRegularizationActions";
import { useTimesheetActions } from "./actions/useTimesheetActions";
import { useLeaveActions } from "./actions/useLeaveActions";
import { useOvertimeActions } from "./actions/useOvertimeActions";
import { useExportAction } from "./actions/useExportAction";

export function useAttendanceActions(p: any) {
  const punch = usePunchActions(p);
  const shiftRoster = useShiftRosterActions(p);
  const holiday = useHolidayActions(p);
  const reg = useRegularizationActions(p);
  const timesheet = useTimesheetActions(p);
  const leave = useLeaveActions(p);
  const overtime = useOvertimeActions(p);
  const handleExportMusterRoll = useExportAction(p);
  return { ...punch, ...shiftRoster, ...holiday, ...reg, ...timesheet, ...leave, ...overtime, handleExportMusterRoll };
}
