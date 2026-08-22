import type { HolidayItem } from "@/stores/attendanceStore";
import { SelectedDateInspector } from "./SelectedDateInspector";
import { MonthHolidaysList } from "./MonthHolidaysList";

interface Props {
  month: number;
  activeDateStr: string | null;
  selectedDateHolidays: HolidayItem[];
  currentMonthHolidays: HolidayItem[];
  onAddHoliday: (d?: string) => void;
  onDeleteHoliday: (id: string) => void;
  onSelectDate: (d: string) => void;
}

export function HolidayCalendarSidebar(props: Props) {
  return (
    <div className="space-y-4 flex flex-col">
      <SelectedDateInspector activeDateStr={props.activeDateStr} holidays={props.selectedDateHolidays} onAddHoliday={props.onAddHoliday} onDeleteHoliday={props.onDeleteHoliday} />
      <MonthHolidaysList month={props.month} holidays={props.currentMonthHolidays} activeDateStr={props.activeDateStr} onSelectDate={props.onSelectDate} />
    </div>
  );
}
