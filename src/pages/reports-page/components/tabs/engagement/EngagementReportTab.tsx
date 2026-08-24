import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { EngagementStatsCards } from "./EngagementStatsCards";
import { EngagementEmptyState } from "./EngagementEmptyState";
import { EngagementEnpsTrend } from "./EngagementEnpsTrend";
import { EngagementDeptBreakdown } from "./EngagementDeptBreakdown";
import { EngagementSurveysList } from "./EngagementSurveysList";

export function EngagementReportTab({ engSum, enpsTrend, engBreak, engSurveys, onNavigate }: any) {
  const engData = engSum?.data?.data ?? engSum?.data;
  const enpsTrendList = enpsTrend?.data?.data ?? enpsTrend?.data;
  const engBreakList = engBreak?.data?.data ?? engBreak?.data;
  const engSurveysList = engSurveys?.data?.data ?? engSurveys?.data;
  const { isLoading, isError } = engSum;
  const hasData = Boolean(
    engData && (
      engData.engagementScore !== undefined ||
      engData.enpsScore !== undefined ||
      engData.enps !== undefined ||
      engData.responseRate !== undefined ||
      (Array.isArray(enpsTrendList) && enpsTrendList.length > 0) ||
      (Array.isArray(engBreakList) && engBreakList.length > 0) ||
      (Array.isArray(engSurveysList) && engSurveysList.length > 0)
    )
  );
  return (
    <motion.div key="engagement" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-6">
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-3">
          <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Loading engagement telemetry...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2">
          <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
          <h4 className="font-bold text-sm text-foreground">Failed to Load Engagement Data</h4>
        </div>
      ) : !hasData ? (
        <EngagementEmptyState onNavigate={onNavigate} />
      ) : (
        <div className="space-y-6">
          <EngagementStatsCards engData={engData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngagementEnpsTrend list={enpsTrendList} />
            <EngagementDeptBreakdown list={engBreakList} />
          </div>
          <EngagementSurveysList list={engSurveysList} />
        </div>
      )}
    </motion.div>
  );
}
