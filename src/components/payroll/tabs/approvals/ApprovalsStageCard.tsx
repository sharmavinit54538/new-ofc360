import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function ApprovalsStageCard({ stage }: { stage: any }) {
  const { handleSignOffWorkflow, isApprovingProc, approvalWorkflowRes } = usePayrollContext();
  const tiers = approvalWorkflowRes?.data?.tiers || [true, false, false], isApproved = tiers[stage.idx];
  return (
    <Card className="glass-card border-border/60 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold">{stage.title}</CardTitle>
          {isApproved ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
        </div>
        <CardDescription className="text-xs">{stage.role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">{stage.desc}</p>
        {!isApproved && (
          <Button size="sm" onClick={() => handleSignOffWorkflow(stage.idx + 1)} disabled={isApprovingProc} className="w-full text-xs">
            Authorize & Sign Off <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
