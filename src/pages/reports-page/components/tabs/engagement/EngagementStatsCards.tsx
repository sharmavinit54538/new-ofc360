export function EngagementStatsCards({ engData }: { engData: any }) {
  const enps = engData?.enpsScore !== undefined ? (engData.enpsScore > 0 ? `+${engData.enpsScore}` : `${engData.enpsScore}`) : (engData?.enps !== undefined ? `${engData.enps}` : "N/A");
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">eNPS Score</span><p className="text-2xl font-extrabold text-primary font-mono mt-1">{enps}</p><span className="text-[11px] text-muted-foreground">Range: -100 to +100</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Response Rate</span><p className="text-2xl font-extrabold text-foreground font-mono mt-1">{engData?.responseRate !== undefined ? `${engData.responseRate}%` : "N/A"}</p><span className="text-[11px] text-emerald-500 font-semibold">Participation</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Promoters</span><p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">{engData?.promoters !== undefined ? `${engData.promoters}%` : "N/A"}</p><span className="text-[11px] text-emerald-500 font-semibold">Brand Advocates</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Detractors</span><p className="text-2xl font-extrabold text-rose-500 font-mono mt-1">{engData?.detractors !== undefined ? `${engData.detractors}%` : "N/A"}</p><span className="text-[11px] text-rose-500 font-semibold">At-Risk Sentiment</span></div>
    </div>
  );
}
