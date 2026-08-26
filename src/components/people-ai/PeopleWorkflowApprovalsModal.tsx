import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ShieldAlert,
  User,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useGetPeopleIntelligenceSummaryQuery, useApproveWorkflowMutation, useRejectWorkflowMutation } from "@/services/api/peopleAiApi";
import { toast } from "sonner";

interface PeopleWorkflowApprovalsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PeopleWorkflowApprovalsModal: React.FC<PeopleWorkflowApprovalsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { data: summary, refetch } = useGetPeopleIntelligenceSummaryQuery();
  const [approveApi, { isLoading: isApproving }] = useApproveWorkflowMutation();
  const [rejectApi, { isLoading: isRejecting }] = useRejectWorkflowMutation();

  const workflows = summary?.pendingWorkflows || [];

  const handleApprove = async (workflowId: string, title: string) => {
    try {
      await approveApi({ workflowId, actor: "HR Admin" }).unwrap();
      toast.success(`Workflow "${title}" approved and executed.`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve workflow.");
    }
  };

  const handleReject = async (workflowId: string, title: string) => {
    try {
      await rejectApi({ workflowId, reason: "Declined by HR Admin", actor: "HR Admin" }).unwrap();
      toast.success(`Workflow "${title}" rejected.`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject workflow.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-border/60 shadow-2xl">
        <DialogHeader className="p-5 border-b border-border/50 bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Autonomous People Operations Queue</span>
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {workflows.length} Pending
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Review and execute AI-synthesized HR workflows with human-in-the-loop governance.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-5">
          {workflows.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-foreground">Operations Queue Clear</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Zero workflows currently awaiting approval. All autonomous operations are up to date.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="glass-card rounded-xl p-4 border border-border/60 bg-card space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase text-primary border-primary/30">
                          {wf.type.replace(/_/g, " ")}
                        </Badge>
                        {wf.requiresConfirmation && (
                          <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Confirmation Required
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-foreground">{wf.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(wf.id, wf.title)}
                        disabled={isRejecting || isApproving}
                        className="h-8 text-xs px-2.5 font-medium border-border/60 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(wf.id, wf.title)}
                        disabled={isRejecting || isApproving}
                        className="h-8 text-xs px-3 gradient-bg text-primary-foreground font-semibold shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Approve & Execute
                      </Button>
                    </div>
                  </div>

                  {/* Workflow Steps Preview */}
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Execution Steps ({wf.steps.length})
                    </span>
                    <div className="space-y-1.5">
                      {wf.steps.map((step, sIdx) => (
                        <div key={step.id} className="flex items-start gap-2 text-xs">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                              step.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-500"
                                : sIdx === wf.currentStepIndex
                                ? "bg-primary/20 text-primary animate-pulse"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {sIdx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-[11px]">{step.name}</p>
                            <p className="text-[10px] text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
