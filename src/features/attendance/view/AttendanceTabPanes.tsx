import { AttendanceTabPanesPart1 } from "./AttendanceTabPanesPart1";
import { AttendanceTabPanesPart2 } from "./AttendanceTabPanesPart2";

export function AttendanceTabPanes({ att }: { att: any }) {
  return (
    <>
      <AttendanceTabPanesPart1 att={att} />
      <AttendanceTabPanesPart2 att={att} />
    </>
  );
}
