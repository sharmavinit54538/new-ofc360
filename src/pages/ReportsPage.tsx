import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Heart,
  Globe,
  ShieldCheck,
  Download,
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Plus,
  TrendingUp,
  Award,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { usePayrollStore } from "@/stores/payrollStore";
import { useLeaveStore } from "@/stores/leaveStore";
import { toast } from "sonner";

import {
  useGetPerformanceDashboardQuery,
  useGetPerformanceTrendsQuery,
  useGetKpiAttainmentQuery,
  useGetTopPerformersQuery,
  useGetSkillGapsQuery,
} from "@/features/reports/performanceReportsApi";

import {
  useGetEngagementSummaryQuery,
  useGetEngagementTrendQuery,
  useGetEnpsTrendQuery,
  useGetEngagementBreakdownQuery,
  useGetEngagementSurveysQuery,
} from "@/features/reports/engagementReportsApi";

import {
  useGetCultureTelemetryQuery,
  useGetCultureTrendQuery,
  useGetCultureBreakdownQuery,
  useGetCultureFeedbackQuery,
} from "@/features/reports/cultureReportsApi";

import {
  useGetComplianceDashboardQuery,
  useGetComplianceRisksQuery,
  useGetAuditReadinessQuery,
  useGetSecurityAuditLogQuery,
} from "@/features/reports/complianceReportsApi";

import { useGetHeadcountAnalyticsQuery } from "@/features/reports/reportsCoreApi";

// Chart Styles
const chartStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  color: "hsl(var(--foreground))",
  fontSize: 12,
};

const COLOR_PALETTE = ["#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];
const DEPT_COLORS = COLOR_PALETTE;

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "workforce";
  const [dateRange, setDateRange] = useState("Q2-2026");

  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees)
    ? rawEmployees
    : Array.isArray((rawEmployees as any)?.items)
    ? (rawEmployees as any).items
    : Array.isArray((rawEmployees as any)?.data)
    ? (rawEmployees as any).data
    : [];
  const attendanceStore = useAttendanceStore();
  const punches = Array.isArray(attendanceStore.punches) ? attendanceStore.punches : [];
  const payrollStore = usePayrollStore();
  const runs = Array.isArray(payrollStore.payrollRuns) ? payrollStore.payrollRuns : Array.isArray((payrollStore as any).runs) ? (payrollStore as any).runs : [];
  const complianceFilings = Array.isArray(payrollStore.complianceFilings) ? payrollStore.complianceFilings : [];
  const leaveStore = useLeaveStore();
  const leaveRequests = Array.isArray(leaveStore.leaveRequests) ? leaveStore.leaveRequests : [];

  // Core Analytics
  const { data: headcountRes } = useGetHeadcountAnalyticsQuery(undefined, {
    skip: activeTab !== "workforce",
  });

  // Performance API Queries
  const { data: perfDashboardRes, isLoading: perfLoading, isError: perfError } = useGetPerformanceDashboardQuery(undefined, {
    skip: activeTab !== "performance",
  });
  const { data: perfTrendsRes } = useGetPerformanceTrendsQuery(undefined, {
    skip: activeTab !== "performance",
  });
  const { data: perfKpiRes } = useGetKpiAttainmentQuery(undefined, {
    skip: activeTab !== "performance",
  });
  const { data: perfTopRes } = useGetTopPerformersQuery(undefined, {
    skip: activeTab !== "performance",
  });
  const { data: perfSkillGapsRes } = useGetSkillGapsQuery(undefined, {
    skip: activeTab !== "performance",
  });

  // Engagement API Queries
  const { data: engagementRes, isLoading: engagementLoading, isError: engagementError } = useGetEngagementSummaryQuery(undefined, {
    skip: activeTab !== "engagement",
  });
  const { data: enpsTrendRes } = useGetEnpsTrendQuery(undefined, {
    skip: activeTab !== "engagement",
  });
  const { data: engagementBreakdownRes } = useGetEngagementBreakdownQuery(undefined, {
    skip: activeTab !== "engagement",
  });
  const { data: engagementSurveysRes } = useGetEngagementSurveysQuery(undefined, {
    skip: activeTab !== "engagement",
  });

  // Culture API Queries
  const { data: cultureRes, isLoading: cultureLoading, isError: cultureError } = useGetCultureTelemetryQuery(undefined, {
    skip: activeTab !== "culture",
  });
  const { data: cultureTrendRes } = useGetCultureTrendQuery(undefined, {
    skip: activeTab !== "culture",
  });
  const { data: cultureBreakdownRes } = useGetCultureBreakdownQuery(undefined, {
    skip: activeTab !== "culture",
  });
  const { data: cultureFeedbackRes } = useGetCultureFeedbackQuery(undefined, {
    skip: activeTab !== "culture",
  });

  // Compliance API Queries
  const { data: compDashboardRes, isLoading: compLoading, isError: compError } = useGetComplianceDashboardQuery(undefined, {
    skip: activeTab !== "compliance",
  });
  const { data: compRisksRes } = useGetComplianceRisksQuery(undefined, {
    skip: activeTab !== "compliance",
  });
  const { data: compReadinessRes } = useGetAuditReadinessQuery(undefined, {
    skip: activeTab !== "compliance",
  });
  const { data: securityAuditRes } = useGetSecurityAuditLogQuery(undefined, {
    skip: activeTab !== "compliance",
  });

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleExport = (format: string) => {
    if (employees.length === 0 && punches.length === 0 && runs.length === 0) {
      toast.error("No active records available to export.");
      return;
    }
    toast.success(`Exporting ${activeTab.toUpperCase()} report as ${format}...`, { duration: 1800 });
  };

  // Dynamic Department Allocation from real employees
  const deptMap: Record<string, number> = {};
  employees.forEach((emp) => {
    if (emp?.department) {
      deptMap[emp.department] = (deptMap[emp.department] || 0) + 1;
    }
  });

  const dynamicDeptData = Object.entries(deptMap).map(([name, count], idx) => ({
    name,
    count,
    color: DEPT_COLORS[idx % DEPT_COLORS.length],
  }));

  // Has-data checkers for genuine empty state determination
  const perfData = perfDashboardRes?.data;
  const hasPerfData = Boolean(
    perfData &&
    ((perfData.totalEvaluations && perfData.totalEvaluations > 0) ||
      perfData.avgPerformanceScore ||
      (Array.isArray(perfTopRes?.data) && perfTopRes.data.length > 0) ||
      (Array.isArray(perfSkillGapsRes?.data) && perfSkillGapsRes.data.length > 0) ||
      (Array.isArray(perfKpiRes?.data) && perfKpiRes.data.length > 0))
  );

  const engagementData = engagementRes?.data;
  const hasEngagementData = Boolean(
    engagementData &&
    (engagementData.engagementScore !== undefined ||
      engagementData.enpsScore !== undefined ||
      engagementData.enps !== undefined ||
      engagementData.responseRate !== undefined ||
      (Array.isArray(enpsTrendRes?.data) && enpsTrendRes.data.length > 0) ||
      (Array.isArray(engagementBreakdownRes?.data) && engagementBreakdownRes.data.length > 0) ||
      (Array.isArray(engagementSurveysRes?.data) && engagementSurveysRes.data.length > 0))
  );

  const cultureData = cultureRes?.data;
  const hasCultureData = Boolean(
    cultureData &&
    (cultureData.inclusionIndex !== undefined ||
      cultureData.diHiringRatio !== undefined ||
      (Array.isArray(cultureData.genderDistribution) && cultureData.genderDistribution.length > 0) ||
      (Array.isArray(cultureBreakdownRes?.data) && cultureBreakdownRes.data.length > 0) ||
      (Array.isArray(cultureFeedbackRes?.data) && cultureFeedbackRes.data.length > 0))
  );

  const compData = compDashboardRes?.data;
  const hasCompData = Boolean(
    (compData && (compData.complianceScore !== undefined || compData.openViolations !== undefined)) ||
    (Array.isArray(compRisksRes?.data) && compRisksRes.data.length > 0) ||
    (Array.isArray(securityAuditRes?.data) && securityAuditRes.data.length > 0) ||
    complianceFilings.length > 0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Clean Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Select value={activeTab} onValueChange={setTab}>
            <SelectTrigger className="w-60 text-xs h-9 bg-card border-border/70 font-semibold shadow-xs">
              <SelectValue placeholder="Select Report Domain" />
            </SelectTrigger>
            <SelectContent>
              {[
                { id: "workforce", label: "Workforce & Headcount Reports" },
                { id: "performance", label: "Performance & Appraisal Reports" },
                { id: "engagement", label: "Engagement & eNPS Reports" },
                { id: "culture", label: "Culture & D&I Telemetry" },
                { id: "compliance", label: "Compliance & Risk Audit Register" },
              ].map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36 text-xs h-9 bg-secondary/30 border-border/60">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q2-2026">Q2 2026 (Current)</SelectItem>
              <SelectItem value="Q1-2026">Q1 2026</SelectItem>
              <SelectItem value="FY-2025-26">FY 2025-26</SelectItem>
              <SelectItem value="ALL-TIME">All-Time</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("CSV")}
            className="text-xs h-9 gap-1.5 border-border/60 bg-secondary/30"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
          </Button>

          <Button
            size="sm"
            onClick={() => handleExport("PDF")}
            className="text-xs h-9 gap-1.5 gradient-bg text-primary-foreground font-bold"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Tab Content Panes */}
      <AnimatePresence mode="wait">
        {/* 1. WORKFORCE & HEADCOUNT */}
        {activeTab === "workforce" && (
          <motion.div
            key="workforce"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground">Total Headcount</span>
                <p className="text-2xl font-extrabold text-foreground font-mono mt-1">{employees.length}</p>
                <span className="text-[11px] text-emerald-500 font-semibold">Active Staff</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground">Departments</span>
                <p className="text-2xl font-extrabold text-primary font-mono mt-1">{Object.keys(deptMap).length}</p>
                <span className="text-[11px] text-muted-foreground">Configured</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground">Present Today</span>
                <p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">{punches.filter(p => p?.type === "Check-In").length}</p>
                <span className="text-[10px] text-emerald-500 font-semibold">Live punch count</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground">On Leave</span>
                <p className="text-2xl font-extrabold text-blue-500 font-mono mt-1">{leaveRequests.filter(l => l?.status === "approved" || (l?.status as string) === "Approved").length}</p>
                <span className="text-[11px] text-muted-foreground">Approved Time-Off</span>
              </div>
            </div>

            {employees.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-3">
                <Users className="w-10 h-10 mx-auto text-muted-foreground/40" />
                <h4 className="font-bold text-base text-foreground">No Employee Records Found</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Add employees to your organization directory to generate live headcount charts and departmental distribution reports.
                </p>
                <Button size="sm" onClick={() => navigate("/people")} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                  <Plus className="w-4 h-4" /> Add First Employee
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                  <h3 className="font-bold text-sm text-foreground">Active Department Headcount Breakdown</h3>
                  <div className="space-y-2">
                    {dynamicDeptData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                        <span className="flex items-center gap-2 font-bold text-foreground">
                          <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                          {d.name}
                        </span>
                        <span className="font-mono font-bold text-primary">
                          {d.count} Staff ({employees.length > 0 ? Math.round((d.count / employees.length) * 100) : 0}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                  <h3 className="font-bold text-sm text-foreground">Department Allocation Chart</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPie>
                      <Pie data={dynamicDeptData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
                        {dynamicDeptData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={chartStyle} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Growth Trend (if available) */}
            {headcountRes?.data && headcountRes.data.length > 0 && (
              <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
                <h3 className="font-bold text-sm text-foreground">Headcount Growth Trend</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  {headcountRes.data.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-secondary/30 border border-border/40">
                      <p className="text-xs text-muted-foreground">{item.m}</p>
                      <p className="text-lg font-bold text-primary mt-1 font-mono">{item.n}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 2. PERFORMANCE REPORTS */}
        {activeTab === "performance" && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            {perfLoading ? (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-3">
                <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Loading real performance telemetry...</p>
              </div>
            ) : perfError ? (
              <div className="p-8 text-center rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
                <h4 className="font-bold text-sm text-foreground">Failed to Load Performance Analytics</h4>
                <p className="text-xs text-muted-foreground">Unable to fetch metrics from the performance API service.</p>
              </div>
            ) : !hasPerfData ? (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-3">
                <Target className="w-10 h-10 mx-auto text-muted-foreground/40" />
                <h4 className="font-bold text-base text-foreground">No Appraisal & KPI Data Recorded</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Appraisal cycles and quarterly OKR scores will generate organization-wide performance radar charts here.
                </p>
                <Button size="sm" onClick={() => navigate("/performance")} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                  <Plus className="w-4 h-4" /> Log Performance Review
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                    <span className="text-xs text-muted-foreground">Total Appraisals</span>
                    <p className="text-2xl font-extrabold text-foreground font-mono mt-1">
                      {perfData?.totalEvaluations ?? 0}
                    </p>
                    <span className="text-[11px] text-muted-foreground">Evaluations</span>
                  </div>

                  <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                    <span className="text-xs text-muted-foreground">Avg Performance Score</span>
                    <p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">
                      {perfData?.avgPerformanceScore ? `${perfData.avgPerformanceScore}/5.0` : "N/A"}
                    </p>
                    <span className="text-[11px] text-emerald-500 font-semibold">Org Average</span>
                  </div>

                  <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                    <span className="text-xs text-muted-foreground">Top Performers</span>
                    <p className="text-2xl font-extrabold text-purple-500 font-mono mt-1">
                      {perfData?.topPerformersCount ?? (perfTopRes?.data?.length || 0)}
                    </p>
                    <span className="text-[11px] text-purple-500 font-semibold">Exceeding goals</span>
                  </div>

                  <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                    <span className="text-xs text-muted-foreground">Skill Gap Alerts</span>
                    <p className="text-2xl font-extrabold text-amber-500 font-mono mt-1">
                      {perfData?.skillGapsCount ?? (perfSkillGapsRes?.data?.length || 0)}
                    </p>
                    <span className="text-[11px] text-amber-500 font-semibold">Attention required</span>
                  </div>
                </div>

                {/* Top Performers & Skill Gaps */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" /> Top Performing Talent
                    </h3>
                    {perfTopRes?.data && perfTopRes.data.length > 0 ? (
                      <div className="space-y-2.5">
                        {perfTopRes.data.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                            <div>
                              <p className="font-bold text-foreground">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground">{item.department} • {item.employeeId}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-emerald-500">{item.score} / 5.0</span>
                              <p className="text-[10px] text-primary font-semibold">{item.rating}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">No individual high performers recorded</p>
                    )}
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-500" /> AI Skill Gap Analysis
                    </h3>
                    {perfSkillGapsRes?.data && perfSkillGapsRes.data.length > 0 ? (
                      <div className="space-y-3">
                        {perfSkillGapsRes.data.map((gap, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs space-y-1.5">
                            <div className="flex justify-between font-medium">
                              <span className="font-bold text-foreground">{gap.skill}</span>
                              <span className="text-amber-500 font-semibold">{gap.affectedEmployees} affected</span>
                            </div>
                            <Progress value={Math.min(100, (gap.currentLevel / (gap.requiredLevel || 1)) * 100)} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">No skill gaps detected</p>
                    )}
                  </div>
                </div>

                {/* KPI Attainment List */}
                {perfKpiRes?.data && perfKpiRes.data.length > 0 && (
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground">Department KPI Attainment</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {perfKpiRes.data.map((kpi, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                          <p className="font-bold text-foreground">{kpi.department}</p>
                          <div className="flex justify-between mt-2 text-muted-foreground">
                            <span>Attainment: <strong className="text-emerald-500 font-mono">{kpi.attainmentRate}%</strong></span>
                            <span>Target: {kpi.target}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* 3. ENGAGEMENT REPORTS */}
        {activeTab === "engagement" && (
          <motion.div
            key="engagement"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            {engagementLoading ? (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-3">
                <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Loading real engagement telemetry...</p>
              </div>
            ) : engagementError ? (
              <div className="p-8 text-center rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
                <h4 className="font-bold text-sm text-foreground">Failed to Load Engagement Data</h4>
                <p className="text-xs text-muted-foreground">Unable to fetch metrics from the engagement API service.</p>
              </div>
            ) : !hasEngagementData ? (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-3">
                <Heart className="w-10 h-10 mx-auto text-muted-foreground/40" />
                <h4 className="font-bold text-base text-foreground">No Pulse Survey Responses</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Employee engagement pulse surveys will display monthly eNPS sentiment trendlines here.
                </p>
                <Button size="sm" onClick={() => navigate("/engagement")} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                  <Plus className="w-4 h-4" /> Launch Employee Survey
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                    <span className="text-xs text-muted-foreground">eNPS Score</span>
                    <p className="text-2xl font-extrabold text-primary font-mono mt-1">
                      {engagementData?.enpsScore !== undefined
                        ? (engagementData.enpsScore > 0 ? `+${engagementData.enpsScore}` : `${engagementData.enpsScore}`)
                        : (engagementData?.enps !== undefined ? `${engagementData.enps}` : "N/A")}
                    </p>
                    <span className="text-[11px] text-muted-foreground">Range: -100 to +100</span>
                  </div>

                  <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                    <span className="text-xs text-muted-foreground">Response Rate</span>
                    <p className="text-2xl font-extrabold text-foreground font-mono mt-1">
                      {engagementData?.responseRate !== undefined ? `${engagementData.responseRate}%` : "N/A"}
                    </p>
                    <span className="text-[11px] text-emerald-500 font-semibold">Participation</span>
                  </div>

                  <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                    <span className="text-xs text-muted-foreground">Promoters</span>
                    <p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">
                      {engagementData?.promoters !== undefined ? `${engagementData.promoters}%` : "N/A"}
                    </p>
                    <span className="text-[11px] text-emerald-500 font-semibold">Brand Advocates</span>
                  </div>

                  <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                    <span className="text-xs text-muted-foreground">Detractors</span>
                    <p className="text-2xl font-extrabold text-rose-500 font-mono mt-1">
                      {engagementData?.detractors !== undefined ? `${engagementData.detractors}%` : "N/A"}
                    </p>
                    <span className="text-[11px] text-rose-500 font-semibold">At-Risk Sentiment</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* eNPS Trend */}
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground">Monthly eNPS Sentiment Trend</h3>
                    {enpsTrendRes?.data && enpsTrendRes.data.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {enpsTrendRes.data.map((t, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-center">
                            <p className="text-xs text-muted-foreground">{t.month}</p>
                            <p className="text-xl font-bold text-primary font-mono mt-1">
                              {t.score > 0 ? `+${t.score}` : t.score}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{t.responses} responses</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">No trend points available</p>
                    )}
                  </div>

                  {/* Department Breakdown */}
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground">Department Engagement Breakdown</h3>
                    {engagementBreakdownRes?.data && engagementBreakdownRes.data.length > 0 ? (
                      <div className="space-y-2.5">
                        {engagementBreakdownRes.data.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                            <span className="font-bold text-foreground">{item.department || item.team || "Team"}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground">Score: <strong className="text-primary font-mono">{item.score}</strong></span>
                              {item.participationRate !== undefined && (
                                <span className="text-muted-foreground">({item.participationRate}%)</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">No department breakdown recorded</p>
                    )}
                  </div>
                </div>

                {/* Survey Register */}
                {engagementSurveysRes?.data && engagementSurveysRes.data.length > 0 && (
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground">Live & Completed Surveys</h3>
                    <div className="space-y-2.5">
                      {engagementSurveysRes.data.map((survey) => (
                        <div key={survey.id} className="flex justify-between items-center p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                          <div>
                            <p className="font-bold text-foreground">{survey.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Responses: {survey.responses} {survey.totalEligible ? `/ ${survey.totalEligible}` : ""}
                            </p>
                          </div>
                          <Badge className={survey.status === "active" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold" : "bg-secondary text-muted-foreground"}>
                            {survey.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* 4. CULTURE REPORTS */}
        {activeTab === "culture" && (
          <motion.div
            key="culture"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            {cultureLoading ? (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-3">
                <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Loading real culture telemetry...</p>
              </div>
            ) : cultureError ? (
              <div className="p-8 text-center rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
                <h4 className="font-bold text-sm text-foreground">Failed to Load Culture Telemetry</h4>
                <p className="text-xs text-muted-foreground">Unable to fetch metrics from the culture API service.</p>
              </div>
            ) : !hasCultureData ? (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-3">
                <Globe className="w-10 h-10 mx-auto text-muted-foreground/40" />
                <h4 className="font-bold text-base text-foreground">No Culture Telemetry</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Psychological safety and diversity telemetry will populate once survey inputs are captured.
                </p>
                <Button size="sm" onClick={() => navigate("/culture")} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                  <Plus className="w-4 h-4" /> View Culture Portal
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
                    <span className="text-xs text-muted-foreground">Inclusion Index Score</span>
                    <p className="text-3xl font-extrabold text-emerald-500 font-mono mt-1">
                      {cultureData?.inclusionIndex !== undefined ? `${cultureData.inclusionIndex} / 100` : "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      D&I Hiring Ratio: <strong className="text-foreground">{cultureData?.diHiringRatio !== undefined ? `${cultureData.diHiringRatio}%` : "N/A"}</strong>
                    </p>
                    {cultureData?.psychologicalSafetyScore !== undefined && (
                      <p className="text-xs text-primary font-medium">
                        Psychological Safety Score: {cultureData.psychologicalSafetyScore} / 100
                      </p>
                    )}
                  </div>

                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
                    <h3 className="font-bold text-sm text-foreground">Gender Demographics</h3>
                    {cultureData?.genderDistribution && cultureData.genderDistribution.length > 0 ? (
                      <div className="space-y-2">
                        {cultureData.genderDistribution.map((g, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-secondary/30 border border-border/40">
                            <span className="text-muted-foreground font-medium">{g.label}</span>
                            <span className="font-bold text-foreground font-mono">{g.value}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">No gender demographics recorded</p>
                    )}
                  </div>
                </div>

                {/* Cultural Dimensions Breakdown */}
                {cultureBreakdownRes?.data && cultureBreakdownRes.data.length > 0 && (
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground">Culture Dimensions & Benchmarks</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {cultureBreakdownRes.data.map((dim, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                          <p className="font-bold text-foreground">{dim.category}</p>
                          <div className="flex justify-between mt-2 text-muted-foreground">
                            <span>Score: <strong className="text-primary font-mono">{dim.score}/100</strong></span>
                            {dim.benchmark !== undefined && <span>Benchmark: {dim.benchmark}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Culture Feedback Sentiment */}
                {cultureFeedbackRes?.data && cultureFeedbackRes.data.length > 0 && (
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground">Culture Feedback Sentiment</h3>
                    <div className="space-y-2.5">
                      {cultureFeedbackRes.data.map((fb) => (
                        <div key={fb.id} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                          <div>
                            <span className="font-bold text-foreground">{fb.theme}</span>
                            {fb.comment && <p className="text-muted-foreground mt-0.5">{fb.comment}</p>}
                          </div>
                          <Badge className={
                            fb.sentiment === "positive" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" :
                            fb.sentiment === "negative" ? "bg-rose-500/15 text-rose-500 border-rose-500/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                          }>
                            {fb.sentiment}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* 5. COMPLIANCE REPORTS */}
        {activeTab === "compliance" && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            {compLoading ? (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-3">
                <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Loading real compliance telemetry...</p>
              </div>
            ) : compError ? (
              <div className="p-8 text-center rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
                <h4 className="font-bold text-sm text-foreground">Failed to Load Compliance Analytics</h4>
                <p className="text-xs text-muted-foreground">Unable to fetch metrics from the compliance API service.</p>
              </div>
            ) : (
              <>
                {/* Metric Summary Cards */}
                {compData && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                      <span className="text-xs text-muted-foreground">Compliance Score</span>
                      <p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">
                        {compData.complianceScore !== undefined ? `${compData.complianceScore}%` : "N/A"}
                      </p>
                      <span className="text-[11px] text-emerald-500 font-semibold">Health Status</span>
                    </div>

                    <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                      <span className="text-xs text-muted-foreground">Open Violations</span>
                      <p className="text-2xl font-extrabold text-rose-500 font-mono mt-1">
                        {compData.openViolations ?? 0}
                      </p>
                      <span className="text-[11px] text-rose-500 font-semibold">Action Required</span>
                    </div>

                    <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                      <span className="text-xs text-muted-foreground">Audit Readiness</span>
                      <p className="text-2xl font-extrabold text-primary font-mono mt-1">
                        {compReadinessRes?.data?.overallScore !== undefined ? `${compReadinessRes.data.overallScore}/100` : "N/A"}
                      </p>
                      <span className="text-[11px] text-primary font-semibold">Preparedness</span>
                    </div>

                    <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                      <span className="text-xs text-muted-foreground">Missing Documents</span>
                      <p className="text-2xl font-extrabold text-amber-500 font-mono mt-1">
                        {compData.missingDocumentsCount ?? 0}
                      </p>
                      <span className="text-[11px] text-amber-500 font-semibold">Pending Filings</span>
                    </div>
                  </div>
                )}

                {/* Statutory Register (Preserved) */}
                <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-foreground">Statutory HR Compliance & Audit Register</h3>
                      <p className="text-xs text-muted-foreground">Central & state statutory filings generated from Payroll & Attendance stores.</p>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs font-bold gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Live Register
                    </Badge>
                  </div>

                  {complianceFilings.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
                      <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground/40" />
                      <h4 className="font-bold text-sm text-foreground">No Compliance Filings Logged</h4>
                      <p className="text-xs text-muted-foreground">Generate EPFO ECR or ESIC returns in Payroll to view audit filings here.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {complianceFilings.map((comp) => (
                        <div
                          key={comp.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-secondary/30 border border-border/40 gap-2"
                        >
                          <div>
                            <h4 className="font-bold text-xs text-foreground">{comp.type}</h4>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> Period: {comp.period} • Date: {comp.filingDate}
                            </p>
                          </div>
                          <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                            {comp.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk Audit Register */}
                {compRisksRes?.data && compRisksRes.data.length > 0 && (
                  <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500" /> Compliance Risk Audit Register
                    </h3>
                    <div className="space-y-2.5">
                      {compRisksRes.data.map((risk, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-muted-foreground">{risk.id}</span>
                              <span className="font-bold text-foreground">{risk.title}</span>
                              <Badge className={
                                risk.severity === "high" || risk.severity === "critical"
                                  ? "bg-rose-500/15 text-rose-500 border-rose-500/30 text-[10px] font-bold uppercase"
                                  : "bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] font-bold uppercase"
                              }>
                                {risk.severity}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{risk.description}</p>
                          </div>
                          <span className="text-muted-foreground">{risk.department}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}