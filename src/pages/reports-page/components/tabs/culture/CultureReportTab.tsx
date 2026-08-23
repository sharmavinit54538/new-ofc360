import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { CultureInclusionCard } from "./CultureInclusionCard";
import { CultureGenderCard } from "./CultureGenderCard";
import { CultureEmptyState } from "./CultureEmptyState";
import { CultureDimensionsList } from "./CultureDimensionsList";
import { CultureFeedbackList } from "./CultureFeedbackList";

export function CultureReportTab({ cultTelem, cultBreak, cultFeedback, onNavigate }: any) {
  const { data: cultureData, isLoading, isError } = cultTelem;
  const hasData = Boolean(cultureData && (cultureData.inclusionIndex !== undefined || cultureData.diHiringRatio !== undefined || (cultureData.genderDistribution?.length > 0) || (cultBreak.data?.length > 0) || (cultFeedback.data?.length > 0)));
  return (
    <motion.div key="culture" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-6">
      {isLoading ? <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-3"><Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" /><p className="text-xs text-muted-foreground">Loading culture telemetry...</p></div> : isError ? <div className="p-8 text-center rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2"><AlertTriangle className="w-8 h-8 mx-auto text-destructive" /><h4 className="font-bold text-sm text-foreground">Failed to Load Culture Telemetry</h4></div> : !hasData ? <CultureEmptyState onNavigate={onNavigate} /> : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><CultureInclusionCard data={cultureData} /><CultureGenderCard data={cultureData} /></div>
          <CultureDimensionsList list={cultBreak.data} /><CultureFeedbackList list={cultFeedback.data} />
        </div>
      )}
    </motion.div>
  );
}
