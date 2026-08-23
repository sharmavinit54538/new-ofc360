export function PerformanceStatsCards({ perfData, topCount, gapCount }: any) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Total Appraisals</span><p className="text-2xl font-extrabold text-foreground font-mono mt-1">{perfData?.totalEvaluations ?? 0}</p><span className="text-[11px] text-muted-foreground">Evaluations</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Avg Performance Score</span><p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">{perfData?.avgPerformanceScore ? `${perfData.avgPerformanceScore}/5.0` : "N/A"}</p><span className="text-[11px] text-emerald-500 font-semibold">Org Average</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Top Performers</span><p className="text-2xl font-extrabold text-purple-500 font-mono mt-1">{perfData?.topPerformersCount ?? topCount}</p><span className="text-[11px] text-purple-500 font-semibold">Exceeding goals</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Skill Gap Alerts</span><p className="text-2xl font-extrabold text-amber-500 font-mono mt-1">{perfData?.skillGapsCount ?? gapCount}</p><span className="text-[11px] text-amber-500 font-semibold">Attention required</span></div>
    </div>
  );
}
