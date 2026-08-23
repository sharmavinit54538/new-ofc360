export function EngagementCards({ engagementRes }: { engagementRes: any }) {
  const d = engagementRes?.data;
  const enps = d?.enpsScore !== undefined ? (d.enpsScore > 0 ? `+${d.enpsScore}` : `${d.enpsScore}`) : (d?.enps !== undefined ? `${d.enps}` : "N/A");
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">eNPS Score</p><p className="text-3xl font-bold text-indigo-400 mt-1">{enps}</p><span className="text-xs text-slate-400">Score range: -100 to +100</span></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Survey Response Rate</p><p className="text-3xl font-bold text-white mt-1">{d?.responseRate !== undefined ? `${d.responseRate}%` : "N/A"}</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Promoters</p><p className="text-3xl font-bold text-emerald-400 mt-1">{d?.promoters !== undefined ? `${d.promoters}%` : "N/A"}</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4"><p className="text-xs text-slate-400">Detractors</p><p className="text-3xl font-bold text-rose-400 mt-1">{d?.detractors !== undefined ? `${d.detractors}%` : "N/A"}</p></div>
    </div>
  );
}
