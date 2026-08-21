import type { useAttendanceModals } from "../hooks/useAttendanceModals";
import type { useAttendanceActions } from "../hooks/useAttendanceActions";

export interface AttendanceDialogProps {
  modals: ReturnType<typeof useAttendanceModals>;
  actions: ReturnType<typeof useAttendanceActions>;
}
