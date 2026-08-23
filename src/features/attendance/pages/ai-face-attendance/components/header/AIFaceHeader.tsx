import { ScanFace, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveClockBadge } from "./LiveClockBadge";

export function AIFaceHeader({ isRefreshing, onRefresh }: { isRefreshing: boolean; onRefresh: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center"><ScanFace className="w-5 h-5" /></div>
        <div><h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2"><span>AI Face Attendance</span><Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Biometric Vision</Badge></h1><p className="text-xs text-muted-foreground">Automated facial recognition check-in, liveness detection, and organization roster.</p></div>
      </div>
      <div className="flex items-center gap-3">
        <LiveClockBadge />
        <Button size="sm" variant="outline" onClick={onRefresh} className="text-xs gap-1.5 h-9"><RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} /><span className="hidden sm:inline">Refresh</span></Button>
      </div>
    </div>
  );
}