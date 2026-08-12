import { useAuthStore } from "@/stores/authStore";
import { useLeaveStore } from "@/stores/leaveStore";
import { useEmployeeStore } from "@/stores/employeeStore";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  BarChart3,
  Heart,
  Check,
  X,
  Clock,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ManagerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useLeaveStore();
  const employees = useEmployeeStore((s) => s.employees);

  // Filter direct reports / team members
  const myTeam = employees.filter((emp) => {
    return (
      emp.department === user?.department ||
      emp.role?.toLowerCase().includes("engineer") ||
      emp.role?.toLowerCase().includes("developer")
    );
  });

  const handleApprove = (id: string, name: string) => {
    approveLeaveRequest(id);
    toast.success(`Leave request approved for ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    rejectLeaveRequest(id);
    toast.error(`Leave request rejected for ${name}`);
  };

  const pendingRequests = leaveRequests.filter((r) => r.status === "Pending");

  return (
    <RoleGuard allowedRoles={["manager", "hr_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/50">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Users className="w-3.5 h-3.5" />
              <span>My Team Scope</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Manager Workspace
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Welcome back, {user?.name || "Manager"}. Oversee team attendance, approve leave requests, track team goals, and monitor engagement.
            </p>
          </div>
        </div>

        {/* Manager Stats Cards (Data Honest: '—' when empty) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">My Direct Reports</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {myTeam.length > 0 ? myTeam.length : "—"}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {myTeam.length > 0 ? `${myTeam.length} assigned members` : "No team members assigned"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Pending Approvals</p>
              <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {pendingRequests.length}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {pendingRequests.length > 0 ? `${pendingRequests.length} time-off requests` : "All reviews completed"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Team Performance</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">—</div>
              <p className="text-[11px] text-muted-foreground">Appraisal cycle pending</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Team Morale Score</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">—</div>
              <p className="text-[11px] text-muted-foreground">Pulse check awaiting data</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Heart className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        {/* Section 1: Team Leave Approvals */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div>
              <h3 className="text-base font-bold text-foreground">Team Leave Approvals</h3>
              <p className="text-xs text-muted-foreground">Review and manage pending time-off requests for your team</p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold">
              {pendingRequests.length} Pending
            </Badge>
          </div>

          {leaveRequests.length > 0 ? (
            <div className="space-y-3">
              {leaveRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/50 bg-card/60 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{req.employeeName}</span>
                      <Badge variant="secondary" className="text-[10px]">{req.type}</Badge>
                      <Badge
                        className={`text-[10px] ${
                          req.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : req.status === "Rejected" || req.status === "Denied"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {req.startDate || req.createdAt} {req.endDate ? `to ${req.endDate}` : ""} ({req.days || 1} day{(req.days || 1) > 1 ? "s" : ""})
                    </p>
                    {req.reason && (
                      <p className="text-xs text-muted-foreground italic">"{req.reason}"</p>
                    )}
                  </div>

                  {req.status === "Pending" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(req.id, req.employeeName)}
                        className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(req.id, req.employeeName)}
                        className="h-8 text-xs gradient-bg text-primary-foreground gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground italic">
                      Action Completed
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-3 border border-dashed border-border/50 rounded-xl bg-muted/10">
              <CalendarCheck className="w-8 h-8 text-muted-foreground/40 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">No pending leave requests</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  All team leave and time-off applications have been processed. New submissions from direct reports will render here in real time.
                </p>
              </div>
              <Link to="/manager/approvals">
                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                  <span>Open Approvals Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Team Performance & Goals Empty State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-3 text-center flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Team Goals & OKRs</h4>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Team goal tracking and quarterly review insights will populate here once performance goals are configured for your team.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-3 text-center flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Team Documents & Charters</h4>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Shared team documentation, onboarding plans, and guidelines will render here when files are uploaded to your team repository.
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
