import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { PerformanceStatsCards } from "./PerformanceStatsCards";
import { PerformanceEmptyState } from "./PerformanceEmptyState";
import { PerformanceTopPerformers } from "./PerformanceTopPerformers";
import { PerformanceSkillGaps } from "./PerformanceSkillGaps";
import { PerformanceKpis } from "./PerformanceKpis";

export function PerformanceReportTab({ perfDash, perfTop, perfSkills, perfKpi, onNavigate }: any) {
  const perfData = perfDash?.data?.data ?? perfDash?.data;
  const topList = perfTop?.data?.data ?? perfTop?.data;
  const skillsList = perfSkills?.data?.data ?? perfSkills?.data;
  const kpiList = perfKpi?.data?.data ?? perfKpi?.data;
  const { isLoading, isError } = perfDash;
  const hasData = Boolean(
    perfData && (
      (perfData.totalEvaluations && perfData.totalEvaluations > 0) ||
      perfData.avgPerformanceScore ||
      (Array.isArray(topList) && topList.length > 0) ||
      (Array.isArray(skillsList) && skillsList.length > 0) ||
      (Array.isArray(kpiList) && kpiList.length > 0)
    )
  );
  return (
    <motion.div key="performance" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-6">
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-3">
          <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Loading performance telemetry...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
          <h4 className="font-bold text-sm text-foreground">Failed to Load Performance Analytics</h4>
        </div>
      ) : !hasData ? (
        <PerformanceEmptyState onNavigate={onNavigate} />
      ) : (
        <div className="space-y-6">
          <PerformanceStatsCards
            perfData={perfData}
            topCount={Array.isArray(topList) ? topList.length : 0}
            gapCount={Array.isArray(skillsList) ? skillsList.length : 0}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceTopPerformers list={topList} />
            <PerformanceSkillGaps list={skillsList} />
          </div>
          <PerformanceKpis list={kpiList} />
        </div>
      )}
    </motion.div>
  );
}
