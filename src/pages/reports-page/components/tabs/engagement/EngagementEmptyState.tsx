import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EngagementEmptyState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-3">
      <Heart className="w-10 h-10 mx-auto text-muted-foreground/40" />
      <h4 className="font-bold text-base text-foreground">No Pulse Survey Responses</h4>
      <p className="text-xs text-muted-foreground max-w-md mx-auto">Employee engagement pulse surveys will display monthly eNPS sentiment trendlines here.</p>
      <Button size="sm" onClick={onNavigate} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"><Plus className="w-4 h-4" /> Launch Employee Survey</Button>
    </div>
  );
}
