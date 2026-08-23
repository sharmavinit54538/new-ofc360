export function KpiAttainmentCard({ perfKpiRes }: { perfKpiRes: any }) {
  const list = perfKpiRes?.data;
  if (!list || list.length === 0) return null;
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Department KPI Attainment</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {list.map((kpi: any, idx: number) => (
          <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-xs">
            <p className="text-slate-300 font-medium">{kpi.department}</p>
            <div className="flex justify-between mt-1 text-slate-400"><span>Attainment: <strong className="text-emerald-400">{kpi.attainmentRate}%</strong></span><span>Target: {kpi.target}%</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
