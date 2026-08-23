export function ComplianceCards({ compDashboardRes, compReadinessRes }: { compDashboardRes: any; compReadinessRes: any }) {
  const cd = compDashboardRes?.data;
  const cr = compReadinessRes?.data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Compliance Health Score</p><p className="text-3xl font-bold text-emerald-400 mt-1">{cd?.complianceScore !== undefined ? `${cd.complianceScore}%` : "N/A"}</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Open Risk Violations</p><p className="text-3xl font-bold text-rose-400 mt-1">{cd?.openViolations ?? 0}</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Audit Readiness Score</p><p className="text-3xl font-bold text-indigo-400 mt-1">{cr?.overallScore !== undefined ? `${cr.overallScore} / 100` : "N/A"}</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Missing Documents</p><p className="text-3xl font-bold text-amber-400 mt-1">{cd?.missingDocumentsCount ?? 0}</p></div>
    </div>
  );
}
