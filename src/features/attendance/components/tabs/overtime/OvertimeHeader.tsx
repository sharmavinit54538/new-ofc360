import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function OvertimeHeader({ onRequestOvertime }: { onRequestOvertime: () => void }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Overtime (OT) Approvals & Records</h2>
        <p className="text-[11px] text-muted-foreground">Manage extra working hours, rate multipliers, and overtime payroll credit.</p>
      </div>
      <Button onClick={onRequestOvertime} size="sm" className="h-8 text-xs flex items-center gap-1.5 shadow-sm">
        <Plus className="h-3.5 w-3.5" /> Request OT
      </Button>
    </div>
  );
}
