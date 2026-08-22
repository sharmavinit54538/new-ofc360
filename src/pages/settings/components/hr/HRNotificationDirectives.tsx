import { Switch } from "@/components/ui/switch";
import type { HRFormData } from "../../types/hrTypes";

export function HRNotificationDirectives({ data, onChange }: { data: HRFormData; onChange: (d: HRFormData) => void }) {
  return (
    <div className="pt-4 border-t border-border/30 space-y-4">
      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Automated Notification Directives</h4>
      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
        <div className="space-y-0.5"><p className="text-xs font-semibold text-foreground">Auto-Alert HR on Candidate Acceptance</p><p className="text-[11px] text-muted-foreground">Receive instant notifications when an offer letter is electronically signed.</p></div>
        <Switch checked={data.autoOnboardingAlerts} onCheckedChange={(c) => onChange({ ...data, autoOnboardingAlerts: c })} />
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
        <div className="space-y-0.5"><p className="text-xs font-semibold text-foreground">Weekly Policy & Attendance Digest</p><p className="text-[11px] text-muted-foreground">Email aggregated department attendance and leave reports every Monday morning.</p></div>
        <Switch checked={data.policyDigestWeekly} onCheckedChange={(c) => onChange({ ...data, policyDigestWeekly: c })} />
      </div>
    </div>
  );
}
