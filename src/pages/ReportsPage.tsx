import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  PieChart,
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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { usePayrollStore } from "@/stores/payrollStore";
import { useLeaveStore } from "@/stores/leaveStore";
import { toast } from "sonner";

// Chart Styles
const chartStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  color: "hsl(var(--foreground))",
  fontSize: 12,
};

const COLOR_PALETTE = ["#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "workforce";
  const [dateRange, setDateRange] = useState("Q2-2026");

  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const { punches, overtimes } = useAttendanceStore();
  const { runs, payslips, complianceFilings } = usePayrollStore();
  const { leaveRequests } = useLeaveStore();

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
    const dept = emp.department || "General";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });

  const dynamicDeptData = Object.keys(deptMap).map((dept, index) => ({
    name: dept,
    count: deptMap[dept],
    color: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

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
                <p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">{punches.filter(p => p.type === "Check-In").length}</p>
                <span className="text-[10px] text-emerald-500 font-semibold">Live punch count</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground">On Leave</span>
                <p className="text-2xl font-extrabold text-blue-500 font-mono mt-1">{leaveRequests.filter(l => l.status === "Approved").length}</p>
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
                        <span className="font-mono font-bold text-primary">{d.count} Staff ({Math.round((d.count / employees.length) * 100)}%)</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
