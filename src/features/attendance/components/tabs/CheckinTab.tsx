import { CheckinConsole } from "./checkin/CheckinConsole";
import { CheckinTimeline } from "./checkin/CheckinTimeline";

export function CheckinTab(p: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      <div className="lg:col-span-2"><CheckinConsole {...p} /></div>
      <div><CheckinTimeline list={p.list} /></div>
    </div>
  );
}
