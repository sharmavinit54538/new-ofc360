import { CheckinConsole } from "./checkin/CheckinConsole";
import { CheckinTimeline } from "./checkin/CheckinTimeline";
import type { PunchRecord } from "../../types/attendance.types";

export function CheckinTab(p: Parameters<typeof CheckinConsole>[0] & { list: PunchRecord[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      <div className="lg:col-span-2"><CheckinConsole {...p} /></div>
      <div><CheckinTimeline list={p.list} /></div>
    </div>
  );
}
