export function CultureGenderCard({ data }: { data: any }) {
  const dist = Array.isArray(data?.genderDistribution) ? data.genderDistribution : [];
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
      <h3 className="font-bold text-sm text-foreground">Gender Demographics</h3>
      {dist.length > 0 ? (
        <div className="space-y-2">
          {dist.map((g: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-secondary/30 border border-border/40">
              <span className="text-muted-foreground font-medium">{g.label}</span><span className="font-bold text-foreground font-mono">{g.value}%</span>
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-muted-foreground py-4 text-center">No gender demographics recorded</p>}
    </div>
  );
}
