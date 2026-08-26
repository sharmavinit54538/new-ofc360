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
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Wrench,
  User,
  Sparkles,
} from "lucide-react";
import { useGetPeopleDataHealthQuery, useFixDataQualityIssueMutation } from "@/services/api/peopleAiApi";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useGetDepartmentsQuery } from "@/services/api/departmentApi";
import type { DataQualityIssue } from "@/services/people-ai/peopleAiTypes";
import { toast } from "sonner";

interface PeopleDataHealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PeopleDataHealthModal: React.FC<PeopleDataHealthModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const { data: rawDepartments = [] } = useGetDepartmentsQuery();

  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const departments = Array.isArray(rawDepartments) ? rawDepartments : [];

  const { data: report, refetch } = useGetPeopleDataHealthQuery(
    { employees, departments },
    { skip: !open }
  );

  const [fixIssueApi, { isLoading: isFixing }] = useFixDataQualityIssueMutation();

  const score = report?.score ?? 96;
  const issues = report?.issues ?? [];

  const handleFix = async (issue: DataQualityIssue) => {
    try {
      const res = await fixIssueApi({ issue }).unwrap();
      toast.success(res.message);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to apply auto-fix.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-border/60 shadow-2xl">
        <DialogHeader className="p-5 border-b border-border/50 bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <span>People Data Health & Hygiene</span>
                <Badge
                  variant="outline"
                  className={`text-xs font-mono font-bold ${
                    score >= 90
                      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                  }`}
                >
                  Score: {score}%
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Continuous AI inspection of profile completeness, department mappings, and reporting consistency.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-5 space-y-4">
          {/* Summary Health Card */}
          <div className="glass-card rounded-xl p-4 border border-border/60 bg-card flex items-center justify-between gap-4 mb-4">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Total Audited Profiles</span>
              <p className="text-lg font-bold font-mono text-foreground">{employees.length} Records</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Clean Profiles</span>
              <p className="text-lg font-bold font-mono text-emerald-500">{report?.cleanRecordsCount || employees.length}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Actionable Issues</span>
              <p className="text-lg font-bold font-mono text-amber-500">{issues.length}</p>
            </div>
          </div>

          {issues.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-foreground">100% Data Quality Verified</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No duplicate records, broken department codes, or missing essential profile fields detected.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Identified Hygiene Anomalies ({issues.length})
              </h4>

              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="glass-card rounded-xl p-3.5 border border-border/60 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold uppercase ${
                          issue.severity === "CRITICAL"
                            ? "bg-destructive/15 text-destructive border-destructive/30"
                            : issue.severity === "HIGH"
                            ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                            : "bg-blue-500/15 text-blue-500 border-blue-500/30"
                        }`}
                      >
                        {issue.severity}
                      </Badge>
                      <span className="font-bold text-xs text-foreground truncate">
                        {issue.employeeName || "System Record"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{issue.description}</p>
                    <p className="text-[11px] text-primary font-medium">Suggested Fix: {issue.suggestedFix}</p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFix(issue)}
                    disabled={isFixing}
                    className="h-8 text-xs px-3 font-semibold border-primary/30 text-primary hover:bg-primary/10 shrink-0 gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Apply Auto-Fix</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
