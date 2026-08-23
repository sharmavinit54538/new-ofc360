export function PerformanceCards({ perfDashboardRes }: { perfDashboardRes: any }) {
  const d = perfDashboardRes?.data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Total AI Appraisals</p><p className="text-2xl font-bold text-white mt-1">{d?.totalEvaluations ?? 0}</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Avg Performance Score</p><p className="text-2xl font-bold text-emerald-400 mt-1">{d?.avgPerformanceScore ? `${d.avgPerformanceScore} / 5.0` : "N/A"}</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Top Performers</p><p className="text-2xl font-bold text-purple-400 mt-1">{d?.topPerformersCount ?? 0}</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Skill Gap Alerts</p><p className="text-2xl font-bold text-amber-400 mt-1">{d?.skillGapsCount ?? 0}</p></div>
    </div>
  );
}
