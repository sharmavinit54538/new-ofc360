export function EngagementDeptBreakdown({ list }: { list?: any[] }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground">Department Engagement Breakdown</h3>
      {list && list.length > 0 ? (
        <div className="space-y-2.5">
          {list.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
              <span className="font-bold text-foreground">{item.department || item.team || "Team"}</span>
              <div className="flex items-center gap-3"><span className="text-muted-foreground">Score: <strong className="text-primary font-mono">{item.score}</strong></span>{item.participationRate !== undefined && <span className="text-muted-foreground">({item.participationRate}%)</span>}</div>
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-muted-foreground py-4 text-center">No department breakdown recorded</p>}
    </div>
  );
}
