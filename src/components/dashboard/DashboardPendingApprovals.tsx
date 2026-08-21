import { useState } from "react";
import { Check, X, CalendarCheck, UserCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLeaveStore } from "@/stores/leaveStore";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface PendingApprovalsProps {
  onboardingEmployees: any[];
}

export function DashboardPendingApprovals({ onboardingEmployees }: PendingApprovalsProps) {
  const { toast } = useToast();
  const { leaveRequests, updateLeaveStatus } = useLeaveStore();

  // Mock pending leaves if store is empty for instant demonstration
  const [sampleLeaves, setSampleLeaves] = useState([
    {
      id: "leave_demo_1",
      employeeName: "Mamraj Yadav",
      role: "Engineering Manager",
      type: "Casual Leave",
      dates: "24 Aug - 26 Aug (3 days)",
      reason: "Family function",
      status: "Pending",
    },
    {
      id: "leave_demo_2",
      employeeName: "Sunaina Mehra",
      role: "Software Engineer",
      type: "Sick Leave",
      dates: "25 Aug (1 day)",
      reason: "Medical checkup",
      status: "Pending",
    },
  ]);

  const activeLeaves =
    leaveRequests.length > 0
      ? leaveRequests.filter((l) => l.status === "Pending")
      : sampleLeaves;

  const handleApproveLeave = (id: string, name: string) => {
    if (leaveRequests.some((l) => l.id === id)) {
      updateLeaveStatus(id, "Approved");
    } else {
      setSampleLeaves((prev) => prev.filter((l) => l.id !== id));
    }
    toast({
      title: "Leave Request Approved",
      description: `Leave request for ${name} has been approved.`,
    });
  };

  const handleRejectLeave = (id: string, name: string) => {
    if (leaveRequests.some((l) => l.id === id)) {
      updateLeaveStatus(id, "Rejected");
    } else {
      setSampleLeaves((prev) => prev.filter((l) => l.id !== id));
    }
    toast({
      title: "Leave Request Rejected",
      description: `Leave request for ${name} was rejected.`,
      variant: "destructive",
    });
  };

  const [activeTab, setActiveTab] = useState<"leaves" | "onboarding">("leaves");

  return (
    <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-base text-foreground">Action Items & Approvals</h3>
          </div>

          <div className="flex items-center bg-secondary/70 p-0.5 rounded-lg border border-border/50 text-xs">
            <button
              onClick={() => setActiveTab("leaves")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "leaves"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Leaves</span>
              {activeLeaves.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeLeaves.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("onboarding")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "onboarding"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Onboarding</span>
              {onboardingEmployees.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {onboardingEmployees.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "leaves" ? (
          <div className="space-y-2.5">
            {activeLeaves.length > 0 ? (
              activeLeaves.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between gap-3 hover:bg-secondary/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground truncate">
                        {(item as any).employeeName || (item as any).userName || "Employee"}
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {(item as any).dates || `${(item as any).startDate} - ${(item as any).endDate}`} • {(item as any).reason || "Personal"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApproveLeave(item.id, (item as any).employeeName || "Employee")}
                      className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectLeave(item.id, (item as any).employeeName || "Employee")}
                      className="h-7 px-2 text-xs font-medium text-destructive hover:bg-destructive/10 border-destructive/30 rounded-lg cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg bg-muted/10">
                <Check className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <p className="font-medium text-foreground">All leave requests reviewed</p>
                <p className="text-[11px] text-muted-foreground">No pending approvals at this moment.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {onboardingEmployees.length > 0 ? (
              onboardingEmployees.slice(0, 3).map((emp) => (
                <div
                  key={emp.id}
                  className="p-3 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {emp.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-foreground truncate">{emp.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{emp.role} • {emp.department}</div>
                    </div>
                  </div>

                  <Link to={`/people`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 gap-1 text-primary border-primary/30 rounded-lg">
                      <UserCheck className="w-3 h-3" />
                      <span>Review KYC</span>
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg bg-muted/10">
                <UserCheck className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <p className="font-medium text-foreground">All onboarding complete</p>
                <p className="text-[11px] text-muted-foreground">Every staff member has active profile status.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">SLA Target: &lt; 24 hrs response</span>
        <Link to="/attendance">
          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-primary hover:bg-primary/10">
            <span>Manage All Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
