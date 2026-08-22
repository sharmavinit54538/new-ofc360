interface Props {
  dayNum: number;
  numClass: string;
  hasHolidays: boolean;
}

export function CalendarDayCellHeader({ dayNum, numClass, hasHolidays }: Props) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs font-bold font-mono rounded-lg w-6 h-6 flex items-center justify-center ${numClass}`}>
        {dayNum}
      </span>
      {hasHolidays && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
    </div>
  );
}
