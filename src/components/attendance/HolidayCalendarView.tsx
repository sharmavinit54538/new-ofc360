import type { HolidayCalendarViewProps } from "./holiday-calendar/types/holidayCalendarProps";
import { useHolidayCalendarViewState } from "./holiday-calendar/hooks/useHolidayCalendarViewState";
import { HolidayHeader } from "./holiday-calendar/components/HolidayHeader";
import { HolidayFiltersBar } from "./holiday-calendar/components/HolidayFiltersBar";
import { HolidayCalendarBody } from "./holiday-calendar/components/HolidayCalendarBody";
import { buildCalendarBodyProps } from "./holiday-calendar/utils/buildCalendarBodyProps";

export function HolidayCalendarView(props: HolidayCalendarViewProps) {
  const state = useHolidayCalendarViewState(props.holidays);
  const bodyProps = buildCalendarBodyProps(state, props.onAddHoliday, props.onDeleteHoliday);
  const handleAdd = () => props.onAddHoliday(state.cal.activeDateStr || undefined);
  return (
    <div className="space-y-6">
      <HolidayHeader viewMode={state.viewMode} onViewModeChange={state.setViewMode} onAddHoliday={handleAdd} />
      <HolidayFiltersBar filters={state.filters} />
      <HolidayCalendarBody {...bodyProps} />
    </div>
  );
}
export default HolidayCalendarView;