import { useShiftModal } from "./modals/useShiftModal";
import { useRosterModal } from "./modals/useRosterModal";
import { useHolidayModal } from "./modals/useHolidayModal";
import { useRegModal } from "./modals/useRegModal";
import { useTimesheetModal } from "./modals/useTimesheetModal";
import { useOvertimeModal } from "./modals/useOvertimeModal";
import { useLeaveModal } from "./modals/useLeaveModal";

export function useAttendanceModals() {
  return {
    ...useShiftModal(),
    ...useRosterModal(),
    ...useHolidayModal(),
    ...useRegModal(),
    ...useTimesheetModal(),
    ...useOvertimeModal(),
    ...useLeaveModal(),
  };
}
