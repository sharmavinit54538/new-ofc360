import type { HolidayCalendarViewState } from "../types/calendarStateHook";
import type { HolidayCalendarBodyProps } from "../types/calendarBodyProps";
import { buildMainCalendarProps } from "./buildMainCalendarProps";

export function buildCalendarBodyProps(
  st: HolidayCalendarViewState,
  onAdd: (d?: string) => void,
  onDel: (id: string) => void
): HolidayCalendarBodyProps {
  return {
    viewMode: st.viewMode,
    mainProps: buildMainCalendarProps(st, onAdd, onDel),
    gridProps: {
      holidays: st.cal.filteredHolidays,
      onDeleteHoliday: onDel,
    },
  };
}
