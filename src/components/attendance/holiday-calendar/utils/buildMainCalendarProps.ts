import type { HolidayCalendarViewState } from "../types/calendarStateHook";
import type { HolidayCalendarMainProps } from "../types/calendarMainProps";

export function buildMainCalendarProps(
  st: HolidayCalendarViewState,
  onAdd: (d?: string) => void,
  onDel: (id: string) => void
): HolidayCalendarMainProps {
  return {
    year: st.nav.year, month: st.nav.month,
    holidayCount: st.cal.currentMonthHolidays.length,
    calendarDays: st.cal.calendarDays,
    activeDateStr: st.cal.activeDateStr,
    selectedDateHolidays: st.cal.selectedDateHolidays,
    currentMonthHolidays: st.cal.currentMonthHolidays,
    onSelectDate: st.cal.setActiveDateStr,
    onAddHoliday: onAdd, onDeleteHoliday: onDel,
    onPrev: st.nav.handlePrevMonth,
    onNext: st.nav.handleNextMonth,
    onToday: st.nav.handleToday,
  };
}
