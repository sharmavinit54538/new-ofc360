import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComplianceRiskAuditCard({ list }: { list?: any[] }) {
  const safeList = Array.isArray(list) ? list : [];
  if (safeList.length === 0) return null;
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-rose-500" /> Compliance Risk Audit Register</h3>
      <div className="space-y-2.5">
        {safeList.map((risk, idx) => (
          <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground">{risk.id}</span>
                <span className="font-bold text-foreground">{risk.title}</span>
                <Badge className={risk.severity === "high" || risk.severity === "critical" ? "bg-rose-500/15 text-rose-500 border-rose-500/30 text-[10px] font-bold uppercase" : "bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] font-bold uppercase"}>{risk.severity}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">{risk.description}</p>
            </div>
            <span className="text-muted-foreground">{risk.department}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
