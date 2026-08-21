import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function RostersHeader({ onAssignRoster }: { onAssignRoster: () => void }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Weekly Roster Scheduling</h2>
        <p className="text-[11px] text-muted-foreground">Assign employees to fixed or rotational shifts.</p>
      </div>
      <Button onClick={onAssignRoster} size="sm" className="h-8 text-xs flex items-center gap-1.5 shadow-sm">
        <Plus className="h-3.5 w-3.5" /> Assign Schedule
      </Button>
    </div>
  );
}
