export function EngagementBreakdownCard({ engagementBreakdownRes }: { engagementBreakdownRes: any }) {
  const list = engagementBreakdownRes?.data || [];
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Engagement Breakdown</h3>
      {list.length > 0 ? (
        <div className="space-y-2.5">
          {list.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-xs">
              <span className="font-medium text-slate-200">{item.department || item.team || "Team"}</span>
              <div className="flex items-center gap-3"><span className="text-slate-400">Score: <strong className="text-indigo-400">{item.score}</strong></span>{item.participationRate !== undefined && <span className="text-slate-500">({item.participationRate}% participation)</span>}</div>
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-slate-500">No department breakdown recorded</p>}
    </div>
  );
}
