import type { HolidayCalendarBodyProps } from "../types/calendarBodyProps";
import { HolidayCalendarMain } from "./HolidayCalendarMain";
import { HolidayCardsGrid } from "./HolidayCardsGrid";

export function HolidayCalendarBody({ viewMode, mainProps, gridProps }: HolidayCalendarBodyProps) {
  return viewMode === "calendar" ? <HolidayCalendarMain {...mainProps} /> : <HolidayCardsGrid {...gridProps} />;
}
