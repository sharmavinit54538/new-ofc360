import type { HolidayCalendarMainProps } from "../types/calendarMainProps";
import { SelectedDateInspector } from "./SelectedDateInspector";
import { MonthHolidaysList } from "./MonthHolidaysList";

export function HolidayCalendarSidebar(props: HolidayCalendarMainProps) {
  const { month, activeDateStr, selectedDateHolidays, currentMonthHolidays, onAddHoliday, onDeleteHoliday, onSelectDate } = props;
  return (
    <div className="space-y-4 flex flex-col">
      <SelectedDateInspector activeDateStr={activeDateStr} holidays={selectedDateHolidays} onAddHoliday={onAddHoliday} onDeleteHoliday={onDeleteHoliday} />
      <MonthHolidaysList month={month} holidays={currentMonthHolidays} activeDateStr={activeDateStr} onSelectDate={onSelectDate} />
    </div>
  );
}
