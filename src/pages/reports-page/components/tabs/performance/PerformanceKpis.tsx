export function PerformanceKpis({ list }: { list?: any[] }) {
  if (!list || list.length === 0) return null;
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground">Department KPI Attainment</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {list.map((kpi, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs">
            <p className="font-bold text-foreground">{kpi.department}</p>
            <div className="flex justify-between mt-2 text-muted-foreground"><span>Attainment: <strong className="text-emerald-500 font-mono">{kpi.attainmentRate}%</strong></span><span>Target: {kpi.target}%</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
