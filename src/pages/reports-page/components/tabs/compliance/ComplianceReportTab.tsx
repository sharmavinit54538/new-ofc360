import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { ComplianceStatsCards } from "./ComplianceStatsCards";
import { StatutoryRegisterCard } from "./StatutoryRegisterCard";
import { ComplianceRiskAuditCard } from "./ComplianceRiskAuditCard";

export function ComplianceReportTab({ compDash, compRisks, compReadiness, complianceFilings }: any) {
  const { data: compData, isLoading, isError } = compDash;
  return (
    <motion.div key="compliance" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-6">
      {isLoading ? <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-3"><Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" /><p className="text-xs text-muted-foreground">Loading compliance telemetry...</p></div> : isError ? <div className="p-8 text-center rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2"><AlertTriangle className="w-8 h-8 mx-auto text-destructive" /><h4 className="font-bold text-sm text-foreground">Failed to Load Compliance Analytics</h4></div> : (
        <>
          <ComplianceStatsCards compData={compData} compReadinessRes={compReadiness} />
          <StatutoryRegisterCard complianceFilings={complianceFilings} />
          <ComplianceRiskAuditCard list={compRisks.data} />
        </>
      )}
    </motion.div>
  );
}
