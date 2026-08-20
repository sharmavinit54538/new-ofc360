import { ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";

export function ApprovalsStageCard({ stage }: { stage: any }) {
  const { handleSignOffWorkflow, isApprovingProc, approvalWorkflowRes } = usePayrollContext();
  const tiers = approvalWorkflowRes?.data?.tiers || [true, false, false], isApproved = tiers[stage.idx];
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card flex flex-col justify-between h-48">
      <div className="space-y-1.5"><h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">{stage.title}</h3><p className="text-[11px] text-muted-foreground leading-relaxed">{stage.desc}</p></div>
      {isApproved ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold p-2 bg-emerald-500/10 rounded-xl justify-center"><ShieldCheck className="w-4 h-4" /> Signed Off & Locked</div>
      ) : (
        <Button onClick={() => handleSignOffWorkflow(stage.idx)} disabled={isApprovingProc} className="w-full text-xs font-bold gap-1.5 gradient-bg text-primary-foreground h-9"><Lock className="w-3.5 h-3.5" /> Sign Off {stage.role}</Button>
      )}
    </div>
  );
}
