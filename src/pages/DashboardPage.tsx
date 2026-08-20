import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  DollarSign,
  CalendarCheck,
  Sparkles,
  TrendingUp,
  Award,
  Info,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useCandidateStore } from "@/stores/candidateStore";
import { usePayrollStore } from "@/stores/payrollStore";
import { useLeaveStore } from "@/stores/leaveStore";
import { useGetDepartmentsQuery } from "@/services/api/departmentApi";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { stageColor } from "@/types/hr";
import { fmtMoney, getCurrencyIcon } from "@/utils/currency";

import EmployeeDashboardPage from "./dashboards/EmployeeDashboardPage";
import ManagerDashboardPage from "./dashboards/ManagerDashboardPage";
import ExecutiveDashboardPage from "./dashboards/ExecutiveDashboardPage";
import ITAdminDashboardPage from "./dashboards/ITAdminDashboardPage";
import SuperAdminDashboardPage from "./super-admin/SuperAdminDashboardPage";

const COLORS = [
  "#6366F1", // Indigo (Brand Primary)
  "#8B5CF6", // Violet (Brand Secondary)
  "#06B6D4", // Cyan (AI Accent)
  "#22C55E", // Emerald (Success)
  "#F59E0B", // Amber (Warning)
];
const tooltip = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
};
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function DashboardPage() {
  const { user } = useAuth();

  // Role-aware dashboard dispatch
  switch (user?.role) {
    case "super_admin":
      return <SuperAdminDashboardPage />;
    case "employee":
      return <EmployeeDashboardPage />;
    case "manager":
      return <ManagerDashboardPage />;
    case "executive":
      return <ExecutiveDashboardPage />;
    case "it_admin":
      return <ITAdminDashboardPage />;
    case "hr_admin":
    default:
      return <HRAdminDashboard />;
  }
}

function HRAdminDashboard() {
  const { user } = useAuth();

  // Live Queries & Stores
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const candidates = useCandidateStore((s) => s.candidates);
  const { data: rawDepartments = [] } = useGetDepartmentsQuery();
  const departments = Array.isArray(rawDepartments) ? rawDepartments : [];
  const { runs = [], payslips = [], settings } = usePayrollStore();
  const PayrollIcon = getCurrencyIcon(settings?.currency);
  const leaveRequests = useLeaveStore((s) => s.leaveRequests);


  // Computed Real-Time Metrics
  const totalWorkforce = employees.length;
  const activeEmployees = employees.filter(
    (e) => e.status === "Active" || !e.status
  ).length;
  const openCandidates = candidates.filter(
    (c) => !["Hired", "Rejected"].includes(c.stage)
  ).length;
  const interviewCandidates = candidates.filter(
    (c) => c.stage === "Interview"
  ).length;
  const pendingLeaves = leaveRequests.filter(
    (r) => r.status === "Pending"
  ).length;

  const monthlyPayroll = useMemo(() => {
    if (runs.length > 0) return runs[0].netTotal;
    if (payslips.length > 0) {
      return payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    }
    return employees.reduce(
      (sum, e) => sum + (typeof e.salary === "number" ? e.salary : 0),
      0
    );
  }, [runs, payslips, employees]);

  // Department Distribution from Live Employees
  const departmentSplit = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((e) => {
      const deptName = e.department?.trim() || "Unassigned";
      counts[deptName] = (counts[deptName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [employees]);

  // Dynamic Payroll Run Trend
  const payrollTrendData = useMemo(() => {
    if (runs.length === 0) return [];
    return [...runs]
      .slice(0, 6)
      .reverse()
      .map((r) => ({
        m: `${r.month.slice(0, 3)} '${String(r.year).slice(-2)}`,
        v: Math.round(r.netTotal / 1000),
      }));
  }, [runs]);

  // Dynamic Candidate / Hiring Flow Data
  const hiringFlowData = useMemo(() => {
    if (candidates.length === 0 && employees.length === 0) return [];
    const stages: Record<string, number> = {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Hired: 0,
    };
    candidates.forEach((c) => {
      if (stages[c.stage] !== undefined) {
        stages[c.stage] += 1;
      }
    });
    return Object.entries(stages).map(([stage, count]) => ({
      stage,
      count,
    }));
  }, [candidates, employees]);

  // Dynamic Live System Insights
  const dynamicInsights = useMemo(() => {
    const list: {
      tone: "positive" | "warn" | "info" | "primary";
      text: string;
    }[] = [];

    if (totalWorkforce > 0) {
      list.push({
        tone: "positive",
        text: `${totalWorkforce} registered staff active across ${
          departmentSplit.length || departments.length || 1
        } departments.`,
      });
    } else {
      list.push({
        tone: "info",
        text: "Workforce directory is ready for employee onboarding.",
      });
    }

    if (pendingLeaves > 0) {
      list.push({
        tone: "warn",
        text: `${pendingLeaves} pending time-off request(s) awaiting manager review.`,
      });
    } else {
      list.push({
        tone: "positive",
        text: "All employee leave and time-off requests are up-to-date.",
      });
    }

    if (openCandidates > 0) {
      list.push({
        tone: "info",
        text: `${openCandidates} active candidate(s) moving through the recruitment pipeline.`,
      });
    } else {
      list.push({
        tone: "primary",
        text: "Recruitment ATS engine configured for job openings and candidate sourcing.",
      });
    }

    if (runs.length > 0) {
      list.push({
        tone: "primary",
        text: `Latest payroll processed for ${runs[0].month} ${runs[0].year} (${runs[0].status}).`,
      });
    }

    return list;
  }, [
    totalWorkforce,
    departmentSplit.length,
    departments.length,
    pendingLeaves,
    openCandidates,
    runs,
  ]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-header">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="page-subheader">
            Org-wide workforce intelligence & real-time HR analytics dashboard.
          </p>
        </div>
      </div>

      {/* KPI Cards (Zero Mock Data - 100% Live Store Synced) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={totalWorkforce.toLocaleString()}
          change={
            totalWorkforce > 0
              ? `${activeEmployees} active staff`
              : "No employees registered"
          }
          changeType={totalWorkforce > 0 ? "up" : "neutral"}
          icon={Users}
        />
        <StatCard
          title="Open Pipeline"
          value={String(openCandidates)}
          change={
            candidates.length > 0
              ? `${interviewCandidates} in interview stage`
              : "No candidates in pipeline"
          }
          changeType={openCandidates > 0 ? "up" : "neutral"}
          icon={Briefcase}
        />
        <StatCard
          title="Monthly Payroll"
          value={fmtMoney(monthlyPayroll)}
          change={
            runs.length > 0
              ? `Latest run: ${runs[0].month} ${runs[0].year}`
              : monthlyPayroll > 0
              ? "Estimated base payroll"
              : "Awaiting payroll run"
          }
          changeType={monthlyPayroll > 0 ? "up" : "neutral"}
          icon={PayrollIcon}
        />
        <StatCard
          title="Pending Approvals"
          value={String(pendingLeaves)}
          change={
            pendingLeaves > 0
              ? `${pendingLeaves} time-off requests pending`
              : "All approvals up-to-date"
          }
          changeType={pendingLeaves > 0 ? "down" : "up"}
          icon={CalendarCheck}
        />
      </div>

      {/* Charts Grid 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Candidate Flow / Recruitment Stages */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base">Recruitment Pipeline Stages</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {candidates.length} Total Candidates
            </Badge>
          </div>

          {hiringFlowData.length > 0 && candidates.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hiringFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="stage"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip contentStyle={tooltip} />
                <Bar
                  dataKey="count"
                  fill="#6366F1"
                  radius={[6, 6, 0, 0]}
                  name="Candidates"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[260px] text-center p-6 space-y-3 rounded-lg border border-dashed border-border/60 bg-muted/20">
              <Briefcase className="w-10 h-10 text-muted-foreground/40" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No active recruitment pipeline data
                </p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Candidate pipeline metrics and hiring stage funnels will render here as candidates are added in the Recruitment module.
                </p>
              </div>
              <Link to="/recruitment">
                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                  <span>Open Recruitment ATS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Department Headcount Split */}
        <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base">Department Distribution</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {departmentSplit.length} Departments
            </Badge>
          </div>

          {departmentSplit.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={departmentSplit}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {departmentSplit.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltip} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 justify-center max-h-20 overflow-y-auto">
                {departmentSplit.map((d, i) => (
                  <span
                    key={d.name}
                    className="text-[11px] flex items-center gap-1"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="truncate max-w-[100px]">{d.name}</span> ({d.value})
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[240px] text-center p-6 space-y-3 rounded-lg border border-dashed border-border/60 bg-muted/20">
              <PieChartIcon className="w-10 h-10 text-muted-foreground/40" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No department allocation
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Department headcount splits will visualize here once employees are registered in departments.
                </p>
              </div>
              <Link to="/people">
                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                  <span>Add Employees</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payroll Runs History / Forecast */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base">Payroll History & Disbursement (in $K)</h3>
            <Badge variant="outline" className="text-xs font-normal">
              {runs.length} Runs Processed
            </Badge>
          </div>

          {payrollTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={payrollTrendData}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#6366F1"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="#6366F1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="m"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={tooltip} />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#6366F1"
                  fill="url(#pg)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[220px] text-center p-6 space-y-3 rounded-lg border border-dashed border-border/60 bg-muted/20">
              <DollarSign className="w-10 h-10 text-muted-foreground/40" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No historical payroll runs recorded
                </p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Salary disbursements, statutory withholdings, and monthly cost charts will plot here as payroll runs are completed.
                </p>
              </div>
              <Link to="/payroll">
                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                  <span>Manage Payroll Runs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Dynamic Executive AI Insights */}
        <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-base">Workforce Signals & Insights</h3>
            </div>
            <ul className="space-y-3 text-sm">
              {dynamicInsights.map((i, idx) => {
                const iconMap = {
                  positive: (
                    <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  ),
                  warn: (
                    <CalendarCheck className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  ),
                  primary: (
                    <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  ),
                  info: (
                    <Info className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                  ),
                };
                return (
                  <li key={idx} className="flex gap-2.5 items-start">
                    {iconMap[i.tone]}
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {i.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-4 border-t border-border/40 mt-4">
            <Link to="/intelligence">
              <Button size="sm" variant="ghost" className="w-full text-xs text-primary justify-between h-8 px-2 hover:bg-primary/10">
                <span>View Full AI Intelligence Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Data Tables Grid (Live Data from Zustand Stores) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Employee Directory */}
        <div className="glass-card rounded-xl p-5 overflow-hidden border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Recent Employee Directory</h3>
              <p className="text-xs text-muted-foreground">Live workforce personnel records</p>
            </div>
            <Badge variant="secondary">
              {employees.length} {employees.length === 1 ? "Employee" : "Employees"}
            </Badge>
          </div>

          {employees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.slice(0, 6).map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div className="text-sm font-medium">{e.name}</div>
                        <div className="text-xs text-muted-foreground">{e.role}</div>
                      </TableCell>
                      <TableCell className="text-sm">{e.department || "General"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {e.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-mono">
                        {fmtMoney(e.salary || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center space-y-3 border border-dashed border-border/50 rounded-lg bg-muted/10 my-2">
              <Users className="w-8 h-8 text-muted-foreground/40 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No employees registered</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Add staff members, contractors, and executives in the People directory to populate live records.
                </p>
              </div>
              <Link to="/people">
                <Button size="sm" className="gradient-bg text-primary-foreground text-xs gap-1.5 h-8">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add First Employee</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* AI-Ranked Pipeline Candidates */}
        <div className="glass-card rounded-xl p-5 overflow-hidden border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Recruitment Pipeline Candidates</h3>
              <p className="text-xs text-muted-foreground">Active talent pool and match scores</p>
            </div>
            <Badge variant="secondary">
              {candidates.length} {candidates.length === 1 ? "Candidate" : "Candidates"}
            </Badge>
          </div>

          {candidates.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">AI Match Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.slice(0, 6).map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.role}</div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            stageColor[c.stage] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.stage}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-bold gradient-text">
                          {c.aiScore ? `${c.aiScore}%` : "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center space-y-3 border border-dashed border-border/50 rounded-lg bg-muted/10 my-2">
              <Briefcase className="w-8 h-8 text-muted-foreground/40 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No pipeline candidates</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Create job postings and source or evaluate candidate resumes in the ATS module.
                </p>
              </div>
              <Link to="/recruitment">
                <Button size="sm" className="gradient-bg text-primary-foreground text-xs gap-1.5 h-8">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Source Candidates</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
