export function ComplianceStatsCards({ compData, compReadinessRes }: { compData: any; compReadinessRes: any }) {
  if (!compData) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Compliance Score</span><p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">{compData.complianceScore !== undefined ? `${compData.complianceScore}%` : "N/A"}</p><span className="text-[11px] text-emerald-500 font-semibold">Health Status</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Open Violations</span><p className="text-2xl font-extrabold text-rose-500 font-mono mt-1">{compData.openViolations ?? 0}</p><span className="text-[11px] text-rose-500 font-semibold">Action Required</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Audit Readiness</span><p className="text-2xl font-extrabold text-primary font-mono mt-1">{compReadinessRes?.data?.overallScore !== undefined ? `${compReadinessRes.data.overallScore}/100` : "N/A"}</p><span className="text-[11px] text-primary font-semibold">Preparedness</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Missing Documents</span><p className="text-2xl font-extrabold text-amber-500 font-mono mt-1">{compData.missingDocumentsCount ?? 0}</p><span className="text-[11px] text-amber-500 font-semibold">Pending Filings</span></div>
    </div>
  );
}
