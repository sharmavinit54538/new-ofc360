export interface CalendarNavProps {
  year: number;
  month: number;
  holidayCount: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}
