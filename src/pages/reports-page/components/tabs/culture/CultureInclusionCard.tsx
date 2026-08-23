export function CultureInclusionCard({ data }: { data: any }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
      <span className="text-xs text-muted-foreground">Inclusion Index Score</span>
      <p className="text-3xl font-extrabold text-emerald-500 font-mono mt-1">{data?.inclusionIndex !== undefined ? `${data.inclusionIndex} / 100` : "N/A"}</p>
      <p className="text-xs text-muted-foreground">D&I Hiring Ratio: <strong className="text-foreground">{data?.diHiringRatio !== undefined ? `${data.diHiringRatio}%` : "N/A"}</strong></p>
      {data?.psychologicalSafetyScore !== undefined && <p className="text-xs text-primary font-medium">Psychological Safety Score: {data.psychologicalSafetyScore} / 100</p>}
    </div>
  );
}
