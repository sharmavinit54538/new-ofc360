export function WorkforceDeptBreakdown({ data, total }: { data: any[]; total: number }) {
  return (
    <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground">Active Department Headcount Breakdown</h3>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
            <span className="flex items-center gap-2 font-bold text-foreground"><span className="w-3 h-3 rounded-full" style={{ background: d.color }} />{d.name}</span>
            <span className="font-mono font-bold text-primary">{d.count} Staff ({total > 0 ? Math.round((d.count / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
