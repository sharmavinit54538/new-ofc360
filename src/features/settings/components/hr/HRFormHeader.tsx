import { Save, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HRFormHeader({ isSaving, isLoading, isFetching, onRefresh }: { isSaving: boolean; isLoading: boolean; isFetching: boolean; onRefresh: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-4">
      <div><h3 className="text-base font-bold text-foreground">HR Administration & Grievance Directory</h3><p className="text-xs text-muted-foreground">Define points of contact for employee grievances, policy escalations, and onboarding notices.</p></div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={isFetching} className="text-xs h-8 gap-1"><RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh</Button>
        <Button type="submit" size="sm" disabled={isSaving || isLoading} className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold h-8">{isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save HR Info</Button>
      </div>
    </div>
  );
}
