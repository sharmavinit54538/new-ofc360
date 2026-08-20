import { useAuth } from "@/hooks/useAuth";
import { usePayrollStore } from "@/stores/payrollStore";
import { useLeaveStore } from "@/stores/leaveStore";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  User,
  Clock,
  Calendar,
  FileText,
  DollarSign,
  Award,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { payslips } = usePayrollStore();
  const { leaveRequests } = useLeaveStore();

  const myPayslips = payslips.filter(
    (p) =>
      p.employeeId === user?.id ||
      p.employeeName.toLowerCase() === (user?.name || "").toLowerCase()
  );

  const myLeaves = leaveRequests.filter(
    (l) =>
      l.employeeId === user?.id ||
      l.employeeName.toLowerCase() === (user?.name || "").toLowerCase()
  );

  const handleCheckInToggle = () => {
    setIsCheckedIn(!isCheckedIn);
    toast.success(
      isCheckedIn ? "Checked out successfully" : "Checked in successfully"
    );
  };

  return (
    <RoleGuard allowedRoles={["employee", "hr_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/50">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <User className="w-3.5 h-3.5" />
              <span>Personal Workspace</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Employee Portal
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Welcome back, {user?.name || "Employee"}. Access your personal attendance, leave requests, payslips, goals, and support.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleCheckInToggle}
              className={`h-10 text-xs font-bold gap-2 rounded-xl shadow-md ${
                isCheckedIn
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "gradient-bg text-primary-foreground"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{isCheckedIn ? "Clock Out" : "Clock In"}</span>
            </Button>
          </div>
        </div>

        {/* Employee Stats Cards (Data Honest: '—' when empty) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Today's Shift Status</p>
              <div className="text-base font-bold text-foreground">
                {isCheckedIn ? "Active — Shift In Progress" : "Not Checked In"}
              </div>
              <p className="text-[11px] text-muted-foreground">Standard 9:00 AM - 6:00 PM</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isCheckedIn ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">My Leave Requests</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {myLeaves.length > 0 ? myLeaves.length : "—"}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {myLeaves.length > 0 ? `${myLeaves.filter(l => l.status === "Approved").length} approved` : "Paid & Casual Leave"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Latest Payslip Status</p>
              <div className="text-base font-bold text-foreground">
                {myPayslips.length > 0 ? "Available" : "—"}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {myPayslips.length > 0 ? `${myPayslips[0].month} ${myPayslips[0].year}` : "No payslips issued"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">My Goals Completed</p>
              <div className="text-2xl font-bold tracking-tight text-foreground">—</div>
              <p className="text-[11px] text-muted-foreground">Quarterly Review Cycle</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Award className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/employee/leave"
            className="p-4 rounded-xl border border-border/60 glass-card hover:border-primary/40 transition-all text-left space-y-2 group block"
          >
            <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-foreground">Apply for Leave</p>
              <p className="text-[11px] text-muted-foreground">Submit time-off request</p>
            </div>
          </Link>

          <Link
            to="/employee/payslips"
            className="p-4 rounded-xl border border-border/60 glass-card hover:border-primary/40 transition-all text-left space-y-2 group block"
          >
            <DollarSign className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-foreground">View Payslips</p>
              <p className="text-[11px] text-muted-foreground">Download salary advice</p>
            </div>
          </Link>

          <Link
            to="/employee/documents"
            className="p-4 rounded-xl border border-border/60 glass-card hover:border-primary/40 transition-all text-left space-y-2 group block"
          >
            <FileText className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-foreground">My Documents</p>
              <p className="text-[11px] text-muted-foreground">Tax forms & contracts</p>
            </div>
          </Link>

          <Link
            to="/employee/helpdesk"
            className="p-4 rounded-xl border border-border/60 glass-card hover:border-primary/40 transition-all text-left space-y-2 group block"
          >
            <HelpCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-bold text-foreground">Helpdesk Support</p>
              <p className="text-[11px] text-muted-foreground">Raise HR/IT query</p>
            </div>
          </Link>
        </div>

        {/* Empty States for Goals & Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card rounded-2xl p-6 border border-border/60 text-center space-y-2 flex flex-col items-center justify-center min-h-[200px]">
            <Award className="w-8 h-8 text-muted-foreground/50 mx-auto" />
            <h4 className="text-xs font-bold text-foreground">No active goals assigned</h4>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              Your performance goals and development milestones will display here once assigned by your manager.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border/60 text-center space-y-2 flex flex-col items-center justify-center min-h-[200px]">
            <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto" />
            <h4 className="text-xs font-bold text-foreground">No recent documents</h4>
            <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
              Personal offer letters, policy acknowledgments, and tax records will appear here.
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}