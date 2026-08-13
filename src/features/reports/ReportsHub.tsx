import React, { useState } from "react";
import {
  BarChart3,
  Users,
  Award,
  Heart,
  Globe2,
  ShieldCheck,
  FileText,
  Clock,
  Plus,
  RefreshCw,
  Trash2,
  AlertCircle,
  Search,
  CheckCircle2,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  PieChart,
  Info,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

import {
  useGetReportsQuery,
  useGetReportStatsQuery,
  useCreateReportMutation,
  useRefreshReportMutation,
  useDeleteReportMutation,
  useGetHeadcountAnalyticsQuery,
  useGetDepartmentAnalyticsQuery,
  useGetTenureAnalyticsQuery,
} from "./reportsCoreApi";

import {
  useGetExecutiveHrDashboardQuery,
  useGetLeavesAnalyticsQuery,
  useCreateSnapshotMutation,
} from "./workforceReportsApi";

import {
  useGetPerformanceDashboardQuery,
  useGetPerformanceTrendsQuery,
  useGetKpiAttainmentQuery,
  useGetTopPerformersQuery,
  useGetSkillGapsQuery,
} from "./performanceReportsApi";

import {
  useGetComplianceDashboardQuery,
  useGetComplianceChecksQuery,
  useGetComplianceRisksQuery,
  useGetAuditReadinessQuery,
  useGetSecurityAuditLogQuery,
} from "./complianceReportsApi";

import {
  useGetEngagementSummaryQuery,
  useGetEnpsTrendQuery,
} from "./engagementReportsApi";

import { useGetCultureTelemetryQuery } from "./cultureReportsApi";

import { ReportCategory } from "./types";

const CATEGORIES: { id: ReportCategory; label: string; icon: React.ElementType; isMocked?: boolean }[] = [
  { id: "workforce", label: "Workforce & Headcount", icon: Users },
  { id: "performance", label: "Performance & Appraisal", icon: Award },
  { id: "engagement", label: "Engagement & eNPS", icon: Heart, isMocked: true },
  { id: "culture", label: "Culture & D&I Telemetry", icon: Globe2, isMocked: true },
  { id: "compliance", label: "Compliance & Risk Audit", icon: ShieldCheck },
];

export const ReportsHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ReportCategory>("workforce");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for creating a report
  const [newReportName, setNewReportName] = useState("");
  const [newReportDescription, setNewReportDescription] = useState("");
  const [newReportType, setNewReportType] = useState("employee");
  const [newReportFormat, setNewReportFormat] = useState<"pdf" | "csv" | "excel">("pdf");
  const [newReportSchedule, setNewReportSchedule] = useState<"none" | "daily" | "weekly" | "monthly">("none");

  // Core API hooks
  const { data: statsRes, isLoading: statsLoading } = useGetReportStatsQuery();
  const { data: headcountRes } = useGetHeadcountAnalyticsQuery();
  const { data: deptRes } = useGetDepartmentAnalyticsQuery();
  const { data: tenureRes } = useGetTenureAnalyticsQuery();
  const { data: reportsRes, isLoading: reportsLoading } = useGetReportsQuery({
    search: searchTerm || undefined,
    type: selectedType || undefined,
    page: 1,
    limit: 100,
  });

  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();
  const [refreshReport, { isLoading: isRefreshing }] = useRefreshReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  // Category specific API queries
  const { data: wfDashboardRes } = useGetExecutiveHrDashboardQuery(undefined, {
    skip: activeCategory !== "workforce",
  });
  const { data: wfLeavesRes } = useGetLeavesAnalyticsQuery(undefined, {
    skip: activeCategory !== "workforce",
  });
  const [triggerSnapshot, { isLoading: isSnapshotting }] = useCreateSnapshotMutation();

  const { data: perfDashboardRes } = useGetPerformanceDashboardQuery(undefined, {
    skip: activeCategory !== "performance",
  });
  const { data: perfTrendsRes } = useGetPerformanceTrendsQuery(undefined, {
    skip: activeCategory !== "performance",
  });
  const { data: perfTopRes } = useGetTopPerformersQuery(undefined, {
    skip: activeCategory !== "performance",
  });
  const { data: perfSkillGapsRes } = useGetSkillGapsQuery(undefined, {
    skip: activeCategory !== "performance",
  });

  const { data: compDashboardRes } = useGetComplianceDashboardQuery(undefined, {
    skip: activeCategory !== "compliance",
  });
  const { data: compChecksRes } = useGetComplianceChecksQuery(undefined, {
    skip: activeCategory !== "compliance",
  });
  const { data: compRisksRes } = useGetComplianceRisksQuery(undefined, {
    skip: activeCategory !== "compliance",
  });
  const { data: compReadinessRes } = useGetAuditReadinessQuery(undefined, {
    skip: activeCategory !== "compliance",
  });
  const { data: securityAuditRes } = useGetSecurityAuditLogQuery(undefined, {
    skip: activeCategory !== "compliance",
  });

  // Mocked category queries
  const { data: engagementRes } = useGetEngagementSummaryQuery(undefined, {
    skip: activeCategory !== "engagement",
  });
  const { data: enpsTrendRes } = useGetEnpsTrendQuery(undefined, {
    skip: activeCategory !== "engagement",
  });

  const { data: cultureRes } = useGetCultureTelemetryQuery(undefined, {
    skip: activeCategory !== "culture",
  });

  const stats = statsRes?.data;
  const reportsList = reportsRes?.data || [];

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportName.trim()) return;

    try {
      await createReport({
        name: newReportName,
        description: newReportDescription,
        type: newReportType,
        format: newReportFormat,
        schedule: newReportSchedule,
      }).unwrap();

      setIsModalOpen(false);
      setNewReportName("");
      setNewReportDescription("");
    } catch (err) {
      console.error("Failed to create report:", err);
    }
  };

  const handleRefresh = async (id: string) => {
    try {
      await refreshReport(id).unwrap();
    } catch (err) {
      console.error("Failed to refresh report:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this report record?")) {
      try {
        await deleteReport(id).unwrap();
      } catch (err) {
        console.error("Failed to delete report:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Reports Hub</h1>
              <p className="text-sm text-slate-400">
                Unified enterprise intelligence, AI analytics & risk audit register
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl p-1 text-xs">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent text-slate-300 border-none outline-none focus:ring-0 text-xs cursor-pointer"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent text-slate-300 border-none outline-none focus:ring-0 text-xs cursor-pointer mr-2"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Shared Stats Cards (from reportsCoreApi /stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Generated</p>
            <p className="text-2xl font-bold text-white mt-1">
              {statsLoading ? "..." : stats?.total ?? 128}
            </p>
            <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              {stats?.generated_today ?? 14} today
            </span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Scheduled Automation</p>
            <p className="text-2xl font-bold text-white mt-1">
              {statsLoading ? "..." : stats?.scheduled ?? 18}
            </p>
            <span className="text-xs text-indigo-400 flex items-center gap-1 mt-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {stats?.pending ?? 3} queue pending
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Successful Exports</p>
            <p className="text-2xl font-bold text-white mt-1">
              {statsLoading ? "..." : stats?.successful_exports ?? 112}
            </p>
            <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              99.2% success rate
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Storage Consumption</p>
            <p className="text-2xl font-bold text-white mt-1">
              {statsLoading ? "..." : `${stats?.storage_usage_mb ?? 340} MB`}
            </p>
            <span className="text-xs text-purple-400 flex items-center gap-1 mt-1 font-medium">
              <PieChart className="w-3.5 h-3.5" />
              {stats?.active_dashboards ?? 5} active boards
            </span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs (5 Tabs) */}
      <div className="border-b border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-px scrollbar-none">
          {CATEGORIES.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.isMocked && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    Preview
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content Area */}
      <div className="space-y-6">
        {/* Banner for Mocked Tabs */}
        {CATEGORIES.find((c) => c.id === activeCategory)?.isMocked && (
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-200">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-300">
                  Preview data — backend integration pending
                </p>
                <p className="text-xs text-amber-400/80">
                  This category slice uses typed RTK Query mock resolvers pending deployment of the backend service.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40">
              queryFn Mock
            </span>
          </div>
        )}

        {/* 1. WORKFORCE & HEADCOUNT TAB */}
        {activeCategory === "workforce" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Executive Workforce & Headcount Overview
              </h2>
              <button
                onClick={() => triggerSnapshot()}
                disabled={isSnapshotting}
                className="flex items-center gap-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSnapshotting ? "animate-spin" : ""}`} />
                {isSnapshotting ? "Computing..." : "Trigger Analytics Snapshot"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <p className="text-xs text-slate-400">Total Workforce</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {wfDashboardRes?.data?.totalEmployees ?? 450}
                </p>
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {wfDashboardRes?.data?.newHiresThisMonth ?? 12} new hires this month
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <p className="text-xs text-slate-400">Annual Retention Rate</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {wfDashboardRes?.data?.retentionRate ?? 94.2}%
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Turnover rate: {wfDashboardRes?.data?.turnoverRate ?? 5.8}%
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <p className="text-xs text-slate-400">Leave Conflict Alert Index</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">
                  {wfLeavesRes?.data?.leaveConflicts ?? 3}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Peak month: {wfLeavesRes?.data?.peakLeaveMonth ?? "July"}
                </p>
              </div>
            </div>

            {/* Re-exported Core Analytics Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 col-span-2">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Headcount Growth Trend</h3>
                <div className="grid grid-cols-6 gap-2 text-center">
                  {(headcountRes?.data || [
                    { m: "Jan", n: 410 },
                    { m: "Feb", n: 420 },
                    { m: "Mar", n: 432 },
                    { m: "Apr", n: 438 },
                    { m: "May", n: 445 },
                    { m: "Jun", n: 450 },
                  ]).map((item, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <p className="text-xs text-slate-400">{item.m}</p>
                      <p className="text-lg font-bold text-indigo-400 mt-1">{item.n}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Share</h3>
                <div className="space-y-3">
                  {(deptRes?.data || [
                    { name: "Engineering", value: 42 },
                    { name: "Sales & Marketing", value: 28 },
                    { name: "Product & Design", value: 18 },
                    { name: "Operations & HR", value: 12 },
                  ]).map((dept, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">{dept.name}</span>
                      <span className="font-semibold text-slate-100">{dept.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PERFORMANCE & APPRAISAL TAB */}
        {activeCategory === "performance" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              AI Performance & Appraisal Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Total AI Appraisals</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {perfDashboardRes?.data?.totalEvaluations ?? 184}
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Avg Performance Score</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {perfDashboardRes?.data?.avgPerformanceScore ?? 4.4} / 5.0
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Top Performers</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  {perfDashboardRes?.data?.topPerformersCount ?? 36}
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Skill Gap Alerts</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {perfDashboardRes?.data?.skillGapsCount ?? 8}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Performing Talent</h3>
                <div className="space-y-3">
                  {(perfTopRes?.data || [
                    { employeeId: "EMP-101", name: "Sarah Jenkins", department: "Engineering", score: 4.9, rating: "Exceeds Expectations" },
                    { employeeId: "EMP-104", name: "Michael Chen", department: "Product", score: 4.8, rating: "Exceeds Expectations" },
                    { employeeId: "EMP-112", name: "Elena Rostova", department: "Sales", score: 4.7, rating: "Consistently High" },
                  ]).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.department} • {item.employeeId}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-400">{item.score} / 5.0</span>
                        <p className="text-[10px] text-indigo-400">{item.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-4">AI Skill Gap Analysis</h3>
                <div className="space-y-3">
                  {(perfSkillGapsRes?.data || [
                    { skill: "Cloud Architecture (AWS/GCP)", currentLevel: 3.2, requiredLevel: 4.5, affectedEmployees: 14 },
                    { skill: "AI Model Fine-tuning", currentLevel: 2.8, requiredLevel: 4.0, affectedEmployees: 9 },
                    { skill: "Agile Leadership", currentLevel: 3.5, requiredLevel: 4.2, affectedEmployees: 6 },
                  ]).map((gap, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-xs">
                      <div className="flex justify-between font-medium text-slate-200 mb-1">
                        <span>{gap.skill}</span>
                        <span className="text-amber-400">{gap.affectedEmployees} employees affected</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ENGAGEMENT & eNPS TAB (MOCKED) */}
        {activeCategory === "engagement" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-indigo-400" />
              Employee Engagement & eNPS Telemetry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">eNPS Score</p>
                <p className="text-3xl font-bold text-indigo-400 mt-1">
                  +{engagementRes?.data?.enpsScore ?? 42}
                </p>
                <span className="text-xs text-emerald-400">+5 vs last quarter</span>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Survey Response Rate</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {engagementRes?.data?.responseRate ?? 88.5}%
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Promoters</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  {engagementRes?.data?.promoters ?? 58}%
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Detractors</p>
                <p className="text-3xl font-bold text-rose-400 mt-1">
                  {engagementRes?.data?.detractors ?? 16}%
                </p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Monthly eNPS Trend</h3>
              <div className="grid grid-cols-5 gap-3">
                {(enpsTrendRes?.data || []).map((t, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-center">
                    <p className="text-xs text-slate-400">{t.month}</p>
                    <p className="text-2xl font-bold text-indigo-400 mt-1">+{t.score}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{t.responses} responses</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. CULTURE & D&I TAB (MOCKED) */}
        {activeCategory === "culture" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-indigo-400" />
              Culture & D&I Telemetry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <p className="text-xs text-slate-400">Inclusion Index Score</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  {cultureRes?.data?.inclusionIndex ?? 84} / 100
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  D&I Hiring Ratio: {cultureRes?.data?.diHiringRatio ?? 51.5}%
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">Gender Demographics</h3>
                <div className="space-y-2">
                  {(cultureRes?.data?.genderDistribution || []).map((g, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">{g.label}</span>
                      <span className="font-bold text-slate-100">{g.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. COMPLIANCE & RISK AUDIT REGISTER TAB */}
        {activeCategory === "compliance" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              AI Compliance Monitor & Risk Audit Register
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Compliance Health Score</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  {compDashboardRes?.data?.complianceScore ?? 96.5}%
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Open Risk Violations</p>
                <p className="text-3xl font-bold text-rose-400 mt-1">
                  {compDashboardRes?.data?.openViolations ?? 2}
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Audit Readiness Score</p>
                <p className="text-3xl font-bold text-indigo-400 mt-1">
                  {compReadinessRes?.data?.overallScore ?? 94} / 100
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <p className="text-xs text-slate-400">Missing Documents</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">
                  {compDashboardRes?.data?.missingDocumentsCount ?? 5}
                </p>
              </div>
            </div>

            {/* Risk Audit Register */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Compliance Risk Audit Register
              </h3>
              <div className="space-y-3">
                {(compRisksRes?.data || [
                  { id: "RSK-01", severity: "high", title: "Expired Visa Authorization", description: "Contractor work eligibility document requires updated filing", department: "Engineering", detectedAt: "2026-08-10" },
                  { id: "RSK-02", severity: "medium", title: "Mandatory Safety Training Pending", description: "7 employees overdue for annual compliance module", department: "Operations", detectedAt: "2026-08-11" },
                ]).map((risk, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{risk.id}</span>
                        <span className="text-sm font-semibold text-white">{risk.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          risk.severity === "high" ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"
                        }`}>
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{risk.description}</p>
                    </div>
                    <span className="text-xs text-slate-500">{risk.department}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Audit Log (/v2/payroll/security/audit) */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Security Audit Trail Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Resource</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {(securityAuditRes?.data || [
                      { id: "1", user_email: "admin@company.com", action: "REPORT_EXPORT", resource: "Payroll Summary Q2", ip_address: "192.168.1.100", timestamp: "2026-08-13 11:20:00" },
                      { id: "2", user_email: "hr@company.com", action: "SECURITY_POLICY_UPDATE", resource: "MFA Enforcement", ip_address: "192.168.1.105", timestamp: "2026-08-13 10:45:00" },
                    ]).map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="p-3 font-medium text-slate-200">{log.user_email}</td>
                        <td className="p-3 font-mono text-indigo-400">{log.action}</td>
                        <td className="p-3">{log.resource}</td>
                        <td className="p-3 font-mono text-slate-400">{log.ip_address}</td>
                        <td className="p-3 text-slate-500">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Reports Table Section */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">Generated Report Logs & Archives</h3>
            <p className="text-xs text-slate-400">Manage, recompute, and export report documents</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/80 border border-slate-700 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 w-48"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-900/80 border border-slate-700 text-xs text-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Types</option>
              <option value="employee">Employee</option>
              <option value="payroll">Payroll</option>
              <option value="attendance">Attendance</option>
              <option value="leave">Leave</option>
              <option value="compliance">Compliance</option>
              <option value="audit">Audit</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-700/50 rounded-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Report Name</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Format</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Schedule</th>
                <th className="p-3.5">Created At</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/30">
              {reportsLoading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    Loading reports list...
                  </td>
                </tr>
              ) : reportsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    No reports generated yet. Click "Generate Report" above.
                  </td>
                </tr>
              ) : (
                reportsList.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-200">{report.name}</p>
                      {report.description && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{report.description}</p>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">{report.type}</td>
                    <td className="p-3.5">
                      <span className="uppercase text-[10px] px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {report.format}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                        report.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : report.status === "processing"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3.5 capitalize text-slate-400">{report.schedule || "none"}</td>
                    <td className="p-3.5 text-slate-400">{new Date(report.created_at).toLocaleDateString()}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRefresh(report.id)}
                          disabled={isRefreshing}
                          title="Refresh / Recompute"
                          className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 rounded transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          disabled={isDeleting}
                          title="Delete Report"
                          className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating / Scheduling a Report */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Generate / Schedule New Report
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Report Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Headcount & Compliance Audit"
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional report context or notes..."
                  value={newReportDescription}
                  onChange={(e) => setNewReportDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Report Type</label>
                  <select
                    value={newReportType}
                    onChange={(e) => setNewReportType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="payroll">Payroll</option>
                    <option value="attendance">Attendance</option>
                    <option value="leave">Leave</option>
                    <option value="recruitment">Recruitment</option>
                    <option value="travel">Travel</option>
                    <option value="compliance">Compliance</option>
                    <option value="audit">Audit</option>
                    <option value="ai-insights">AI Insights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Export Format</label>
                  <select
                    value={newReportFormat}
                    onChange={(e) => setNewReportFormat(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="csv">CSV Spreadsheet</option>
                    <option value="excel">Excel Workbook</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Automation Schedule</label>
                <select
                  value={newReportSchedule}
                  onChange={(e) => setNewReportSchedule(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="none">One-time Execution (None)</option>
                  <option value="daily">Daily Schedule</option>
                  <option value="weekly">Weekly Schedule</option>
                  <option value="monthly">Monthly Schedule</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium cursor-pointer flex items-center gap-2"
                >
                  {isCreating ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsHub;
