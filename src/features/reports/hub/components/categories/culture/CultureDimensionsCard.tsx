export function CultureDimensionsCard({ cultureBreakdownRes }: { cultureBreakdownRes: any }) {
  const list = cultureBreakdownRes?.data;
  if (!list || list.length === 0) return null;
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Organizational Culture Dimensions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {list.map((dim: any, idx: number) => (
          <div key={idx} className="p-3.5 bg-slate-900/50 rounded-lg border border-slate-800 text-xs">
            <p className="font-semibold text-white">{dim.category}</p>
            <div className="flex justify-between mt-1 text-slate-400"><span>Score: <strong className="text-indigo-400">{dim.score}/100</strong></span>{dim.benchmark !== undefined && <span>Benchmark: {dim.benchmark}</span>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
