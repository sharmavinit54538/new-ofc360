import { useAttendance } from "./hooks/useAttendance";
import { AttendanceViewLayout } from "./view/AttendanceViewLayout";

export function AttendanceView() {
  const att = useAttendance();
  return <AttendanceViewLayout att={att} />;
}
export default AttendanceView;
