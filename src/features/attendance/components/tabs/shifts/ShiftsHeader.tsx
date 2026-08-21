import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ShiftsHeader({ onAddShift }: { onAddShift: () => void }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Configured Shift Patterns</h2>
        <p className="text-[11px] text-muted-foreground">Manage work timing, grace periods, and department allocations.</p>
      </div>
      <Button onClick={onAddShift} size="sm" className="h-8 text-xs flex items-center gap-1.5 shadow-sm">
        <Plus className="h-3.5 w-3.5" /> Create Shift Pattern
      </Button>
    </div>
  );
}
