import { AttendanceTabPanesPart1 } from "./AttendanceTabPanesPart1";
import { AttendanceTabPanesPart2 } from "./AttendanceTabPanesPart2";
import type { AttendanceHookResult } from "../types/attendanceHookResult";

export function AttendanceTabPanes({ att }: { att: AttendanceHookResult }) {
  return (
    <>
      <AttendanceTabPanesPart1 att={att} />
      <AttendanceTabPanesPart2 att={att} />
    </>
  );
}
