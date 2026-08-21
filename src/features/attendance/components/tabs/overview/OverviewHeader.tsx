import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function OverviewHeader({ count, onExport, isExporting }: { count: number; onExport: () => void; isExporting: boolean }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Live Attendance Stream</h2>
        <p className="text-[11px] text-muted-foreground">Showing {count} real-time verified records.</p>
      </div>
      <Button onClick={onExport} disabled={isExporting} variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1.5 border-border/80 shadow-sm">
        <Download className="h-3.5 w-3.5" /> Export Muster Roll (.csv)
      </Button>
    </div>
  );
}
