import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SelectedDateEmpty({ dateStr, onAddHoliday }: { dateStr: string | null; onAddHoliday: (d?: string) => void }) {
  return (
    <div className="text-center py-6 space-y-2 bg-secondary/15 rounded-2xl p-4 border border-dashed border-border/50">
      <CalendarDays className="w-7 h-7 mx-auto text-muted-foreground/40" />
      <p className="text-xs font-semibold text-foreground">Standard Working Day</p>
      <p className="text-[11px] text-muted-foreground">No holiday scheduled for {dateStr}.</p>
      <Button size="sm" variant="outline" onClick={() => onAddHoliday(dateStr || undefined)} className="h-7 text-xs font-semibold gap-1 mt-1 border-border/60 bg-background">
        <Plus className="w-3 h-3" /> Schedule Holiday
      </Button>
    </div>
  );
}
