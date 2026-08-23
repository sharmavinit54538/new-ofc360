export function EnpsTrendCard({ enpsTrendRes }: { enpsTrendRes: any }) {
  const list = enpsTrendRes?.data || [];
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">eNPS Sentiment Trend</h3>
      {list.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {list.map((t: any, idx: number) => (
            <div key={idx} className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 text-center">
              <p className="text-xs text-slate-400">{t.month}</p>
              <p className="text-xl font-bold text-indigo-400 mt-1">{t.score > 0 ? `+${t.score}` : t.score}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.responses} responses</p>
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-slate-500">No trend points available</p>}
    </div>
  );
}
