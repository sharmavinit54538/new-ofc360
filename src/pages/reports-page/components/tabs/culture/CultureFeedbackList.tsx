import { Badge } from "@/components/ui/badge";

export function CultureFeedbackList({ list }: { list?: any[] }) {
  if (!list || list.length === 0) return null;
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground">Culture Feedback Sentiment</h3>
      <div className="space-y-2.5">
        {list.map((fb) => (
          <div key={fb.id} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
            <div><span className="font-bold text-foreground">{fb.theme}</span>{fb.comment && <p className="text-muted-foreground mt-0.5">{fb.comment}</p>}</div>
            <Badge className={fb.sentiment === "positive" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : fb.sentiment === "negative" ? "bg-rose-500/15 text-rose-500 border-rose-500/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"}>{fb.sentiment}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
