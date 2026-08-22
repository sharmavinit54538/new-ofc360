import type { HolidayCardItemProps } from "../types/holidayCardProps";
import { HolidayCardItemHeader } from "./HolidayCardItemHeader";
import { HolidayCardItemBody } from "./HolidayCardItemBody";
import { HolidayCardItemFooter } from "./HolidayCardItemFooter";

export function HolidayCardItem({ holiday, onDelete }: HolidayCardItemProps) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3 shadow-xs">
      <HolidayCardItemHeader holiday={holiday} onDelete={onDelete} />
      <HolidayCardItemBody holiday={holiday} />
      <HolidayCardItemFooter holiday={holiday} />
    </div>
  );
}
