import type { HolidayCardItemProps } from "../types/holidayCardProps";
import { SelectedDateItemHeader } from "./SelectedDateItemHeader";
import { SelectedDateItemMeta } from "./SelectedDateItemMeta";

export function SelectedDateItem({ holiday, onDelete }: HolidayCardItemProps) {
  return (
    <div className="p-3 rounded-2xl bg-secondary/30 border border-border/50 space-y-2">
      <SelectedDateItemHeader holiday={holiday} onDelete={onDelete} />
      <SelectedDateItemMeta holiday={holiday} />
    </div>
  );
}
