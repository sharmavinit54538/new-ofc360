export function getCalendarDayNumClassName(
  isToday: boolean,
  isSelected: boolean,
  isCurrentMonth: boolean
): string {
  if (isToday) return "bg-primary text-primary-foreground";
  if (isSelected) return "text-primary font-extrabold";
  if (isCurrentMonth) return "text-foreground";
  return "text-muted-foreground";
}
