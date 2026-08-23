export function WorkforceTrendCard({ headcountRes }: { headcountRes: any }) {
  const list = headcountRes?.data;
  if (!list || list.length === 0) return null;
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
      <h3 className="font-bold text-sm text-foreground">Headcount Growth Trend</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
        {list.map((item: any, idx: number) => (
          <div key={idx} className="p-3 rounded-xl bg-secondary/30 border border-border/40">
            <p className="text-xs text-muted-foreground">{item.m}</p><p className="text-lg font-bold text-primary mt-1 font-mono">{item.n}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
