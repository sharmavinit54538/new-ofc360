import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TimesheetsHeader({ onLogTimesheet }: { onLogTimesheet: () => void }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Project & Activity Timesheets</h2>
        <p className="text-[11px] text-muted-foreground">Log client billable hours and daily project task milestones.</p>
      </div>
      <Button onClick={onLogTimesheet} size="sm" className="h-8 text-xs flex items-center gap-1.5 shadow-sm">
        <Plus className="h-3.5 w-3.5" /> Log Timesheet
      </Button>
    </div>
  );
}
