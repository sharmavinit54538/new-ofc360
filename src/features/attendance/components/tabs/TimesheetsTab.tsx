import { TimesheetsHeader } from "./timesheets/TimesheetsHeader";
import { TimesheetsTable } from "./timesheets/TimesheetsTable";
import type { DisplayedTimesheet } from "../../types/attendance.types";

export function TimesheetsTab({ list, isManagerOrAbove, onLogTimesheet, onApprove }: {
  list: DisplayedTimesheet[]; isManagerOrAbove: boolean; onLogTimesheet: () => void; onApprove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <TimesheetsHeader onLogTimesheet={onLogTimesheet} />
      <TimesheetsTable list={list} isManagerOrAbove={isManagerOrAbove} onApprove={onApprove} />
    </div>
  );
}
