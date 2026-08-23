export function TopPerformersCard({ perfTopRes }: { perfTopRes: any }) {
  const list = perfTopRes?.data || [];
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Top Performing Talent</h3>
      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <div><p className="text-sm font-medium text-white">{item.name}</p><p className="text-xs text-slate-400">{item.department} • {item.employeeId}</p></div>
              <div className="text-right"><span className="text-sm font-bold text-emerald-400">{item.score} / 5.0</span><p className="text-[10px] text-indigo-400">{item.rating}</p></div>
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-slate-500">No top performers recorded</p>}
    </div>
  );
}
