import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

export function AnalyticsHeader({ onRefresh, isLoading }: { onRefresh: () => void; isLoading: boolean }) {
  return (
    <div className="flex items-center justify-between pb-1">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Attendance Intelligence & Trends</h2>
        <p className="text-[11px] text-muted-foreground">Aggregated punctuality, health scores, and AI anomaly tracking.</p>
      </div>
      <Button onClick={onRefresh} disabled={isLoading} variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1.5 shadow-sm">
        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Refresh
      </Button>
    </div>
  );
}
