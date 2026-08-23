import type { HolidayCalendarViewProps } from "./types/holidayCalendarProps";
import { useHolidayCalendarViewState } from "./hooks/useHolidayCalendarViewState";
import { HolidayHeader } from "./components/HolidayHeader";
import { HolidayFiltersBar } from "./components/HolidayFiltersBar";
import { HolidayCalendarBody } from "./components/HolidayCalendarBody";
import { buildCalendarBodyProps } from "./utils/buildCalendarBodyProps";

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