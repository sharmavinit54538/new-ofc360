export function CultureOverviewCard({ cultureRes }: { cultureRes: any }) {
  const d = cultureRes?.data;
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <p className="text-xs text-slate-400">Inclusion Index Score</p>
      <p className="text-3xl font-bold text-emerald-400 mt-1">{d?.inclusionIndex !== undefined ? `${d.inclusionIndex} / 100` : "N/A"}</p>
      <p className="text-xs text-slate-400 mt-2">D&I Hiring Ratio: {d?.diHiringRatio !== undefined ? `${d.diHiringRatio}%` : "N/A"}</p>
      {d?.psychologicalSafetyScore !== undefined && <p className="text-xs text-indigo-400 mt-1">Psychological Safety Score: {d.psychologicalSafetyScore} / 100</p>}
    </div>
  );
}
