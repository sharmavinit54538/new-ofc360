export function formatCalendarDate(
  year: number,
  monthIndex: number,
  dayNum: number
): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(dayNum).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function isTodayDate(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}
