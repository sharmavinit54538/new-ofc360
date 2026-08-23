import { useState } from "react";
import { DEFAULT_VIEW_YEAR, DEFAULT_VIEW_MONTH_INDEX } from "../constants/calendarDefaults";

export function useHolidayNavigation() {
  const [viewDate, setViewDate] = useState(() => new Date(DEFAULT_VIEW_YEAR, DEFAULT_VIEW_MONTH_INDEX, 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const handleToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return { viewDate, year, month, handlePrevMonth, handleNextMonth, handleToday };
}
