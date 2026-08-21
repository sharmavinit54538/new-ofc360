import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function HolidaysHeader({ isHrOrAdmin, onAddHoliday }: { isHrOrAdmin: boolean; onAddHoliday: () => void }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Official Organization Holidays</h2>
        <p className="text-[11px] text-muted-foreground">National, regional, and company declared paid holidays.</p>
      </div>
      {isHrOrAdmin && (
        <Button onClick={onAddHoliday} size="sm" className="h-8 text-xs flex items-center gap-1.5 shadow-sm">
          <Plus className="h-3.5 w-3.5" /> Declare Holiday
        </Button>
      )}
    </div>
  );
}
