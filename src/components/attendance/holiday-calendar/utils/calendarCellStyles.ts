export function getCalendarCellClassName(
  isCurrentMonth: boolean,
  isSelected: boolean,
  hasHolidays: boolean
): string {
  if (!isCurrentMonth) return "bg-secondary/10 border-border/20 opacity-40 hover:opacity-75";
  if (isSelected) return "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/30";
  if (hasHolidays) return "bg-secondary/30 border-primary/20 hover:border-primary/50 hover:bg-secondary/40";
  return "bg-card border-border/40 hover:border-border/80 hover:bg-secondary/20";
}

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
