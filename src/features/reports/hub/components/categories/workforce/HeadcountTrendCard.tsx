export function HeadcountTrendCard({ headcountRes, loading }: { headcountRes: any; loading: boolean }) {
  const list = headcountRes?.data || [];
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 col-span-2">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Headcount Growth Trend</h3>
      {loading ? <p className="text-xs text-slate-400">Loading headcount trends...</p> : list.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          {list.map((item: any, idx: number) => (
            <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800"><p className="text-xs text-slate-400">{item.m}</p><p className="text-lg font-bold text-indigo-400 mt-1">{item.n}</p></div>
          ))}
        </div>
      ) : <p className="text-xs text-slate-500">No headcount trend data recorded</p>}
    </div>
  );
}
