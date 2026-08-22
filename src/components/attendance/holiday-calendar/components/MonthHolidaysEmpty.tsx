import { Sparkles } from "lucide-react";

export function MonthHolidaysEmpty() {
  return (
    <div className="text-center py-8 text-muted-foreground text-xs space-y-1">
      <Sparkles className="w-6 h-6 mx-auto text-muted-foreground/30" />
      <p className="font-semibold text-foreground">No Holidays This Month</p>
      <p className="text-[11px]">Use the navigation arrows to view other months.</p>
    </div>
  );
}
