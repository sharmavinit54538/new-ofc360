import { ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StatutoryRegisterCard({ complianceFilings }: { complianceFilings: any[] }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div><h3 className="font-bold text-base text-foreground">Statutory HR Compliance & Audit Register</h3><p className="text-xs text-muted-foreground">Central & state statutory filings generated from Payroll & Attendance stores.</p></div>
        <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs font-bold gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Live Register</Badge>
      </div>
      {complianceFilings.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 space-y-2"><ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground/40" /><h4 className="font-bold text-sm text-foreground">No Compliance Filings Logged</h4><p className="text-xs text-muted-foreground">Generate EPFO ECR or ESIC returns in Payroll to view audit filings here.</p></div>
      ) : (
        <div className="space-y-2.5">{complianceFilings.map((c) => (<div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-secondary/30 border border-border/40 gap-2"><div><h4 className="font-bold text-xs text-foreground">{c.type}</h4><p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> Period: {c.period} • Date: {c.filingDate}</p></div><Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">{c.status}</Badge></div>))}</div>
      )}
    </div>
  );
}
