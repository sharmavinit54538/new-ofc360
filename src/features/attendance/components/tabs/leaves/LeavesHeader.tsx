import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function LeavesHeader({ onApplyLeave }: { onApplyLeave: () => void }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Leave Balances & Time-Off History</h2>
        <p className="text-[11px] text-muted-foreground">Request, review, and track statutory and annual paid leaves.</p>
      </div>
      <Button onClick={onApplyLeave} size="sm" className="h-8 text-xs flex items-center gap-1.5 shadow-sm">
        <Plus className="h-3.5 w-3.5" /> Apply for Leave
      </Button>
    </div>
  );
}
