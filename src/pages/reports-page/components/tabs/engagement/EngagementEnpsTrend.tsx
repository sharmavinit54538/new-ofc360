export function EngagementEnpsTrend({ list }: { list?: any[] }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground">Monthly eNPS Sentiment Trend</h3>
      {list && list.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {list.map((t, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-center">
              <p className="text-xs text-muted-foreground">{t.month}</p>
              <p className="text-xl font-bold text-primary font-mono mt-1">{t.score > 0 ? `+${t.score}` : t.score}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.responses} responses</p>
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-muted-foreground py-4 text-center">No trend points available</p>}
    </div>
  );
}
