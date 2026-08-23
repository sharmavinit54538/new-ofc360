export function CultureDimensionsList({ list }: { list?: any[] }) {
  if (!list || list.length === 0) return null;
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground">Culture Dimensions & Benchmarks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {list.map((dim, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs">
            <p className="font-bold text-foreground">{dim.category}</p>
            <div className="flex justify-between mt-2 text-muted-foreground"><span>Score: <strong className="text-primary font-mono">{dim.score}/100</strong></span>{dim.benchmark !== undefined && <span>Benchmark: {dim.benchmark}</span>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
