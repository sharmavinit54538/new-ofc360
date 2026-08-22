import { Calendar as CalendarIcon } from "lucide-react";

export function HolidayEmptyState() {
  return (
    <div className="col-span-full p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
      <CalendarIcon className="w-8 h-8 mx-auto text-muted-foreground/40" />
      <h4 className="font-bold text-sm text-foreground">No Holidays Found</h4>
      <p className="text-xs text-muted-foreground">Click "+ Add Company Holiday" or adjust your search filter.</p>
    </div>
  );
}
