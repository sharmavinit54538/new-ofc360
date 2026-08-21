import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function RegularizationHeader({ onApply }: { onApply: () => void }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Attendance Regularization Requests</h2>
        <p className="text-[11px] text-muted-foreground">Submit justification for missed, late, or device-failure biometric punches.</p>
      </div>
      <Button onClick={onApply} size="sm" className="h-8 text-xs flex items-center gap-1.5 shadow-sm">
        <Plus className="h-3.5 w-3.5" /> Apply Regularization
      </Button>
    </div>
  );
}
