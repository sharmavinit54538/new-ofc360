import type { SelectedDateInspectorProps } from "../types/selectedInspectorProps";
import { SelectedDateInspectorHeader } from "./SelectedDateInspectorHeader";
import { SelectedDateItem } from "./SelectedDateItem";
import { SelectedDateEmpty } from "./SelectedDateEmpty";

export function SelectedDateInspector({ activeDateStr, holidays = [], onAddHoliday, onDeleteHoliday }: SelectedDateInspectorProps) {
  const content = holidays.length > 0
    ? <div className="space-y-3">{holidays.map((h) => <SelectedDateItem key={h.id} holiday={h} onDelete={onDeleteHoliday} />)}</div>
    : <SelectedDateEmpty dateStr={activeDateStr} onAddHoliday={onAddHoliday} />;
  return (
    <div className="glass-card rounded-3xl p-5 border border-border/60 bg-card shadow-sm space-y-3">
      <SelectedDateInspectorHeader activeDateStr={activeDateStr} />
      {content}
    </div>
  );
}
